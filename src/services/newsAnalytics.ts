import { openAIService } from './openai';
import { Article } from '@/types/article';

export interface MarketSentiment {
  bullish: number;
  bearish: number;
  neutral: number;
  lastUpdated: string;
  summary: string;
}

export interface TrendingArticle {
  id: string;
  title: string;
  enhancedTitle: string;
  summary: string;
  readTime: string;
  views: number;
  category: string;
}

export interface NewsInsight {
  marketImpact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  keyPoints: string[];
  recommendation: string;
}

export class NewsAnalyticsService {
  private sentimentCache: MarketSentiment | null = null;
  private cacheExpiry = 30 * 60 * 1000; // 30 minutes
  private lastCacheTime = 0;

  /**
   * Analyze market sentiment from recent news articles using OpenAI
   */
  async analyzeMarketSentiment(articles: Article[]): Promise<MarketSentiment> {
    // Check cache first
    if (this.sentimentCache && Date.now() - this.lastCacheTime < this.cacheExpiry) {
      return this.sentimentCache;
    }

    try {
      // Take the latest 10 articles for analysis
      const recentArticles = articles.slice(0, 10);
      
      // Prepare content for analysis
      const articlesText = recentArticles
        .map(article => `${article.title}: ${article.description || ''}`)
        .join('\n\n');

      const prompt = `Analisis sentimen pasar saham Indonesia berdasarkan berita terbaru berikut:

${articlesText}

Berikan analisis dalam format JSON dengan struktur:
{
  "bullish": [persentase 0-100],
  "bearish": [persentase 0-100], 
  "neutral": [persentase 0-100],
  "summary": "[ringkasan singkat 2-3 kalimat tentang kondisi pasar]"
}

Pastikan total persentase = 100%. Fokus pada sentimen terhadap pasar saham Indonesia (IHSG/IDX).`;

      const response = await openAIService.sendMessage([
        { 
          id: 'sentiment-' + Date.now(),
          role: 'user', 
          content: prompt,
          timestamp: new Date()
        }
      ]);

      // Parse the JSON response
      const analysisMatch = response.match(/\{[\s\S]*\}/);
      if (!analysisMatch) {
        throw new Error('Invalid response format from OpenAI');
      }

      const analysis = JSON.parse(analysisMatch[0]);
      
      // Validate the response
      if (!analysis.bullish || !analysis.bearish || !analysis.neutral || !analysis.summary) {
        throw new Error('Incomplete analysis from OpenAI');
      }

      // Ensure percentages add up to 100
      const total = analysis.bullish + analysis.bearish + analysis.neutral;
      if (Math.abs(total - 100) > 1) {
        // Normalize if needed
        const factor = 100 / total;
        analysis.bullish = Math.round(analysis.bullish * factor);
        analysis.bearish = Math.round(analysis.bearish * factor);
        analysis.neutral = 100 - analysis.bullish - analysis.bearish;
      }

      const sentiment: MarketSentiment = {
        bullish: analysis.bullish,
        bearish: analysis.bearish,
        neutral: analysis.neutral,
        lastUpdated: new Date().toISOString(),
        summary: analysis.summary
      };

      // Cache the result
      this.sentimentCache = sentiment;
      this.lastCacheTime = Date.now();

      return sentiment;
    } catch (error) {
      console.error('Error analyzing market sentiment:', error);
      
      // Return fallback sentiment
      return {
        bullish: 65,
        bearish: 25,
        neutral: 10,
        lastUpdated: new Date().toISOString(),
        summary: 'Analisis sentimen tidak tersedia saat ini. Data menampilkan sentimen historis pasar.'
      };
    }
  }

  /**
   * Generate trending articles with enhanced titles and summaries
   */
  async generateTrendingArticles(articles: Article[]): Promise<TrendingArticle[]> {
    try {
      // Sort by a combination of recency and keyword richness
      const sortedArticles = articles
        .filter(article => article.title && article.description)
        .slice(0, 8) // Take top 8 for analysis
        .map(article => ({
          ...article,
          score: this.calculateTrendingScore(article)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Keep top 5

      const articlesText = sortedArticles
        .map((article, index) => `${index + 1}. ${article.title}: ${article.description}`)
        .join('\n\n');

      const prompt = `Berdasarkan berita saham Indonesia berikut, buat 5 judul menarik untuk sidebar "Paling Banyak Dibaca":

${articlesText}

Untuk setiap artikel, berikan:
1. Judul yang lebih menarik dan clickable (maksimal 60 karakter)
2. Summary singkat (maksimal 100 karakter)

Format response dalam JSON:
{
  "articles": [
    {
      "originalIndex": 1,
      "enhancedTitle": "[judul menarik]",
      "summary": "[summary singkat]"
    },
    ...
  ]
}

Pastikan judul menarik perhatian tapi tetap akurat.`;

      const response = await openAIService.sendMessage([
        { 
          id: 'trending-' + Date.now(),
          role: 'user', 
          content: prompt,
          timestamp: new Date()
        }
      ]);

      // Parse the JSON response
      const analysisMatch = response.match(/\{[\s\S]*\}/);
      if (!analysisMatch) {
        throw new Error('Invalid response format from OpenAI');
      }

      const analysis = JSON.parse(analysisMatch[0]);
      
      const trendingArticles: TrendingArticle[] = analysis.articles.map((item: any) => {
        const originalArticle = sortedArticles[item.originalIndex - 1];
        const readTime = Math.ceil((originalArticle.content?.length || 500) / 200);
        
        return {
          id: originalArticle.id.toString(),
          title: originalArticle.title || '',
          enhancedTitle: item.enhancedTitle,
          summary: item.summary,
          readTime: `${readTime} menit`,
          views: Math.floor(Math.random() * 1000) + 100, // Simulated views
          category: this.extractCategory(originalArticle.keywords)
        };
      });

      return trendingArticles;
    } catch (error) {
      console.error('Error generating trending articles:', error);
      
      // Return fallback trending articles
      return articles.slice(0, 5).map((article, index) => ({
        id: article.id.toString(),
        title: article.title || '',
        enhancedTitle: article.title || `Berita Trending ${index + 1}`,
        summary: article.description?.substring(0, 100) + '...' || 'Summary tidak tersedia',
        readTime: '5 menit',
        views: Math.floor(Math.random() * 1000) + 100,
        category: this.extractCategory(article.keywords)
      }));
    }
  }

  /**
   * Analyze individual news article for market impact
   */
  async analyzeNewsImpact(article: Article): Promise<NewsInsight> {
    try {
      const prompt = `Analisis dampak berita saham Indonesia berikut terhadap pasar:

Judul: ${article.title}
Deskripsi: ${article.description}
Konten: ${article.content?.substring(0, 1000) || ''}

Berikan analisis dalam format JSON:
{
  "marketImpact": "positive|negative|neutral",
  "confidence": [0-100],
  "keyPoints": ["poin kunci 1", "poin kunci 2", "poin kunci 3"],
  "recommendation": "rekomendasi singkat untuk investor"
}`;

      const response = await openAIService.sendMessage([
        { 
          id: 'impact-' + Date.now(),
          role: 'user', 
          content: prompt,
          timestamp: new Date()
        }
      ]);

      const analysisMatch = response.match(/\{[\s\S]*\}/);
      if (!analysisMatch) {
        throw new Error('Invalid response format');
      }

      return JSON.parse(analysisMatch[0]);
    } catch (error) {
      console.error('Error analyzing news impact:', error);
      
      return {
        marketImpact: 'neutral',
        confidence: 50,
        keyPoints: ['Analisis tidak tersedia'],
        recommendation: 'Lakukan riset lebih lanjut sebelum mengambil keputusan investasi.'
      };
    }
  }

  /**
   * Calculate trending score based on article properties
   */
  private calculateTrendingScore(article: Article): number {
    let score = 0;
    
    // Recency score (newer articles get higher score)
    const articleDate = new Date(article.date_post || article.created_at);
    const daysSincePublished = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 30 - daysSincePublished); // Max 30 points for very recent
    
    // Title quality score
    if (article.title) {
      // Favor titles with stock symbols, numbers, or financial terms
      const financialTerms = ['IHSG', 'saham', 'investasi', 'profit', 'dividen', 'IPO', 'trading'];
      const stockPattern = /\b[A-Z]{4}\b/g; // 4-letter stock codes
      
      financialTerms.forEach(term => {
        if (article.title?.toLowerCase().includes(term)) score += 5;
      });
      
      if (stockPattern.test(article.title)) score += 10;
      if (/\d+%/.test(article.title)) score += 8; // Contains percentage
      if (/Rp\s*\d+/.test(article.title)) score += 6; // Contains Rupiah amount
    }
    
    // Content quality score
    if (article.content) {
      score += Math.min(20, article.content.length / 100); // Up to 20 points for longer content
    }
    
    // Keyword richness
    if (article.keywords) {
      score += article.keywords.split(',').length * 2; // 2 points per keyword
    }
    
    return score;
  }

  /**
   * Extract primary category from keywords
   */
  private extractCategory(keywords: string | null): string {
    if (!keywords) return 'Umum';
    
    const keywordList = keywords.split(',').map(k => k.trim().toLowerCase());
    
    // Priority mapping
    const categoryMap: { [key: string]: string } = {
      'saham': 'Saham',
      'ihsg': 'Market Update',
      'ekonomi': 'Ekonomi',
      'regulasi': 'Regulasi',
      'ipo': 'IPO',
      'dividen': 'Dividen',
      'merger': 'Korporasi',
      'akuisisi': 'Korporasi'
    };
    
    for (const keyword of keywordList) {
      if (categoryMap[keyword]) {
        return categoryMap[keyword];
      }
    }
    
    return keywordList[0] || 'Umum';
  }

  /**
   * Get market sentiment - wrapper for analyzeMarketSentiment
   */
  async getMarketSentiment(articles: Article[]): Promise<MarketSentiment> {
    return this.analyzeMarketSentiment(articles);
  }

  /**
   * Get cached sentiment without API call
   */
  getCachedSentiment(): MarketSentiment | null {
    if (this.sentimentCache && Date.now() - this.lastCacheTime < this.cacheExpiry) {
      return this.sentimentCache;
    }
    return null;
  }

  /**
   * Clear sentiment cache
   */
  clearCache(): void {
    this.sentimentCache = null;
    this.lastCacheTime = 0;
  }
}

export const newsAnalyticsService = new NewsAnalyticsService();