import React, { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  ChevronRight, 
  TrendingDown, 
  TrendingUp, 
  Bell,
  Filter,
  Search,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { articleService } from "@/services/articles";
import { Article } from "@/types/article";
import { newsAnalyticsService, MarketSentiment, TrendingArticle } from "@/services/newsAnalytics";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  author: string;
  imageUrl?: string;
  isBreaking?: boolean;
  trending?: "up" | "down";
  change?: string;
  readTime: string;
  source: string;
}

// Helper function to convert Article to NewsArticle
const convertArticleToNews = (article: Article): NewsArticle => {
  const tags = article.keywords ? article.keywords.split(',').map(k => k.trim()) : [];
  
  return {
    id: article.id.toString(),
    title: article.title || 'Untitled News',
    excerpt: article.description || 'No description available',
    category: tags[0] || 'Market Update',
    publishedAt: article.date_post ? new Date(article.date_post).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ' • ' + new Date(article.date_post).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }) : new Date(article.created_at).toLocaleDateString('id-ID', {
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    }) + ' • ' + new Date(article.created_at).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    author: article.author || 'Tim Redaksi Sahamnesia',
    imageUrl: article.image_url || 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg',
    isBreaking: Math.random() > 0.7, // Random breaking news flag
    trending: Math.random() > 0.5 ? (Math.random() > 0.5 ? 'up' : 'down') : undefined,
    change: Math.random() > 0.5 ? `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5 + 0.1).toFixed(1)}%` : undefined,
    readTime: Math.ceil((article.content?.length || 0) / 200) + ' menit',
    source: article.source || 'Sahamnesia'
  };
};

interface MarketData {
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  trending: "up" | "down";
}

interface MarketNewsProps {
  onNavigate?: (page: string, newsId?: string) => void;
}

const News: React.FC<MarketNewsProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>([]);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Load articles and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [articlesResponse, categoriesData] = await Promise.all([
          articleService.getArticles({ limit: 50 }),
          articleService.getCategories()
        ]);
        
        setArticles(articlesResponse.data);
        setCategories(['Semua', ...categoriesData.slice(0, 10)]);
        
        // Debug logging
        console.log('News page loaded:', {
          articlesCount: articlesResponse.data.length,
          categoriesCount: categoriesData.length,
          categories: ['Semua', ...categoriesData.slice(0, 10)]
        });
        
        // Load analytics data
        loadAnalyticsData(articlesResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Load analytics data
  const loadAnalyticsData = async (articlesData: Article[]) => {
    // Load market sentiment
    try {
      setSentimentLoading(true);
      const sentiment = await newsAnalyticsService.analyzeMarketSentiment(articlesData);
      setMarketSentiment(sentiment);
    } catch (error) {
      console.error('Failed to load market sentiment:', error);
    } finally {
      setSentimentLoading(false);
    }
    
    // Load trending articles
    try {
      setTrendingLoading(true);
      const trending = await newsAnalyticsService.generateTrendingArticles(articlesData);
      setTrendingArticles(trending);
    } catch (error) {
      console.error('Failed to load trending articles:', error);
    } finally {
      setTrendingLoading(false);
    }
  };
  
  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      try {
        setIsSearching(true);
        const results = await articleService.searchArticles(searchQuery, 20);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);
  
  // Calculate categories with counts only when articles are loaded
  const categoriesWithCount = categories.map(cat => {
    if (cat === 'Semua') {
      return { name: cat, count: articles.length };
    }
    
    const count = articles.filter(article => {
      if (!article.keywords) return false;
      return article.keywords.toLowerCase().includes(cat.toLowerCase());
    }).length;
    
    return { name: cat, count };
  });


  // Convert articles to news articles
  const newsArticles = articles.map(convertArticleToNews);
  
  // Get breaking news (first 3 articles with breaking flag)
  const breakingNews = newsArticles.filter(article => article.isBreaking).slice(0, 3);

  // Get latest news (all articles)
  const latestNews = newsArticles;

  // Get filtered news based on search and category
  const getFilteredNews = () => {
    if (searchQuery.trim()) {
      return searchResults.map(convertArticleToNews);
    }
    
    if (selectedCategory === "Semua") {
      return latestNews;
    }
    
    return latestNews.filter(article => 
      article.category === selectedCategory || 
      article.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  };
  
  const filteredNews = getFilteredNews();
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNavigate={onNavigate} />
        <div className="container mx-auto px-4 py-16 text-center mt-16">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
            <span className="text-lg text-gray-600">Memuat berita...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onNavigate={onNavigate} />
        <div className="container mx-auto px-4 py-16 text-center mt-16">
          <div className="flex items-center justify-center text-red-600">
            <AlertCircle className="w-8 h-8 mr-2" />
            <span className="text-lg">Error: {error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={onNavigate} />
      
      {/* Breaking News Banner */}
      <section className="bg-red-600 text-white py-2 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <span className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
              BREAKING
            </span>
            <div className="flex space-x-8 animate-scroll">
              {breakingNews.map((news) => (
                <span key={news.id} className="text-sm whitespace-nowrap">
                  {news.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Berita Pasar Modal Indonesia
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Update terkini seputar saham, ekonomi, dan regulasi pasar modal Indonesia
            </p>
          </div>

          {/* Market Data Overview */}
          {/* <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Data Pasar Real-time</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Last updated: {new Date().toLocaleTimeString('id-ID')}
                </span>
                <button className="text-blue-600 hover:text-blue-700">
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {marketData.map((data, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">{data.symbol}</div>
                  <div className="text-lg font-bold text-gray-900">{data.price}</div>
                  <div className={`text-sm flex items-center ${
                    data.trending === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {data.trending === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    <span>{data.change} ({data.changePercent})</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Cari berita..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                Tanggal
              </button>
              <button className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Bell className="h-4 w-4 mr-2" />
                Notifikasi
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Breaking News Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Breaking News</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  Lihat Semua
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {breakingNews.map((article) => (
                  <article key={article.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    {article.imageUrl && (
                      <div className="relative">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                            BREAKING
                          </span>
                          {article.trending && (
                            <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center ${
                              article.trending === "up" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                            }`}>
                              {article.trending === "up" ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              )}
                              {article.change}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium">
                          {article.category}
                        </span>
                        <span className="text-sm text-gray-500">{article.publishedAt}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3 text-gray-500">
                          <span>By {article.author}</span>
                          <span>•</span>
                          <span>{article.readTime} baca</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) {
                              onNavigate('news-detail', article.id);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                          Baca
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categoriesWithCount.length > 0 ? categoriesWithCount.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              )) : (
                <div className="text-gray-500">Loading categories...</div>
              )}
            </div>

            {/* Latest News */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terbaru</h2>
              
              <div className="space-y-6">
                {filteredNews.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {searchQuery ? 'Tidak ada berita yang sesuai dengan pencarian.' : 'Tidak ada berita tersedia.'}
                    </p>
                  </div>
                ) : (
                  filteredNews.map((article) => (
                  <article key={article.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {article.imageUrl && (
                        <div className="md:w-64 flex-shrink-0">
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-48 md:h-40 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                              {article.category}
                            </span>
                            {article.trending && (
                              <span className={`px-2 py-1 rounded-md text-xs font-bold flex items-center ${
                                article.trending === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {article.trending === "up" ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {article.change}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{article.publishedAt}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span>By {article.author}</span>
                            <span>•</span>
                            <span>{article.readTime} baca</span>
                            <span>•</span>
                            <span>Sumber: {article.source}</span>
                          </div>
                          <button 
                            onClick={() => {
                              if (onNavigate) {
                                onNavigate('news-detail', article.id);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                          >
                            Baca Selengkapnya
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                  ))
                )}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                  Muat Berita Lainnya
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Live Updates */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Update Live</h3>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full animate-pulse">
                    ● LIVE
                  </span>
                </div>
                
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {latestNews.slice(0, 5).map((news) => (
                    <div key={news.id} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-500">{news.publishedAt}</span>
                        {news.trending && (
                          <span className={`text-xs flex items-center ${
                            news.trending === "up" ? "text-green-600" : "text-red-600"
                          }`}>
                            {news.trending === "up" ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {news.change}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {news.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Sentiment */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Sentimen Pasar</h3>
                  {sentimentLoading && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                
                {marketSentiment ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bullish</span>
                      <span className="text-lg font-bold text-green-600">{marketSentiment.bullish}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${marketSentiment.bullish}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bearish</span>
                      <span className="text-lg font-bold text-red-600">{marketSentiment.bearish}%</span>
                    </div>
                    {marketSentiment.neutral > 0 && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Neutral</span>
                          <span className="text-lg font-bold text-gray-600">{marketSentiment.neutral}%</span>
                        </div>
                      </>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        Dianalisis menggunakan AI • {new Date(marketSentiment.lastUpdated).toLocaleTimeString('id-ID')}
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {marketSentiment.summary}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bullish</span>
                      <span className="text-lg font-bold text-green-600">--%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-300 h-2 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bearish</span>
                      <span className="text-lg font-bold text-red-600">--%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Memuat analisis sentimen...
                    </p>
                  </div>
                )}
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-3">Dapatkan Update Berita</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Subscribe untuk mendapatkan update berita pasar modal terbaru langsung di email Anda.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
                  />
                  <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Most Read */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Paling Banyak Dibaca</h3>
                  {trendingLoading && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {trendingArticles.length > 0 ? (
                    trendingArticles.map((article, index) => (
                      <div 
                        key={article.id} 
                        className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('news-detail', article.id);
                          }
                        }}
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            {article.enhancedTitle}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                            {article.summary}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-400">
                            <span>{article.views.toLocaleString()} views</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                            <span>•</span>
                            <span className="bg-gray-100 text-gray-600 px-1 rounded">
                              {article.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback loading state
                    [1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full animate-pulse"></span>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {trendingArticles.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      Diurutkan berdasarkan algoritma AI • Diperbarui setiap 30 menit
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default News;