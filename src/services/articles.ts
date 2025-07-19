import { supabase } from '@/lib/supabase'
import { Article, ArticleFilters, ArticleResponse } from '@/types/article'

export class ArticleService {
  /**
   * Fetch articles with optional filters
   */
  async getArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
    const { category, search, limit = 10, offset = 0 } = filters

    try {
      let query = supabase
        .from('articles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Apply search filter if provided
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,keywords.ilike.%${search}%`)
      }

      // Apply category filter if provided (assuming categories are stored in keywords or a separate field)
      if (category && category !== 'Semua') {
        query = query.ilike('keywords', `%${category}%`)
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) {
        throw new Error(`Failed to fetch articles: ${error.message}`)
      }

      return {
        data: data || [],
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      throw error
    }
  }

  /**
   * Get a single article by ID
   */
  async getArticleById(id: number): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Failed to fetch article: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error fetching article by ID:', error)
      throw error
    }
  }

   async getBlogById(id: number): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Failed to fetch article: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error fetching article by ID:', error)
      throw error
    }
  }

  /**
   * Get featured articles (latest or most popular)
   */
  async getFeaturedArticles(limit: number = 3): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Failed to fetch featured articles: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error fetching featured articles:', error)
      throw error
    }
  }

  /**
   * Search articles by title or content
   */
  async searchArticles(query: string, limit: number = 10): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%,keywords.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Failed to search articles: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error searching articles:', error)
      throw error
    }
  }

  /**
   * Get articles by category/tag
   */
  async getArticlesByCategory(category: string, limit: number = 10): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .ilike('keywords', `%${category}%`)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Failed to fetch articles by category: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error fetching articles by category:', error)
      throw error
    }
  }

  /**
   * Get article categories (extract from keywords)
   */
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('keywords')
        .not('keywords', 'is', null)

      if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`)
      }

      // Extract unique categories from keywords
      const categories = new Set<string>()
      
      data?.forEach(article => {
        if (article.keywords) {
          const keywords = article.keywords.split(',').map((k: string) => k.trim())
          keywords.forEach((keyword: string) => categories.add(keyword))
        }
      })

      return Array.from(categories).sort()
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  /**
   * Get recent articles
   */
  async getRecentArticles(limit: number = 5): Promise<Article[]> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Failed to fetch recent articles: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error fetching recent articles:', error)
      throw error
    }
  }

  /**
   * Increment view count for an article (client-side tracking)
   */
  async incrementViewCount(articleId: number): Promise<void> {
    try {
      // In a real implementation, you might want to:
      // 1. Track views in a separate table to avoid too many updates
      // 2. Use a queue/batch system to reduce database load
      // 3. Add rate limiting to prevent spam
      
      // For now, we'll just log it and potentially store in localStorage
      const viewKey = `article_view_${articleId}`;
      const lastViewed = localStorage.getItem(viewKey);
      const now = Date.now();
      
      // Only count as a view if it hasn't been viewed in the last hour
      if (!lastViewed || now - parseInt(lastViewed) > 60 * 60 * 1000) {
        localStorage.setItem(viewKey, now.toString());
        console.log(`Article ${articleId} view recorded`);
        
        // Here you could make an API call to increment the view count
        // await supabase.from('article_views').insert({ article_id: articleId, viewed_at: new Date() });
      }
    } catch (error) {
      console.error('Error tracking article view:', error);
      // Don't throw error for view tracking failures
    }
  }

  /**
   * Get most viewed articles (mock implementation)
   */
  async getMostViewedArticles(limit: number = 5): Promise<Article[]> {
    try {
      // In a real implementation, you would query by view count
      // For now, we'll just return recent articles as a fallback
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit * 2); // Get more articles to simulate variety

      if (error) {
        throw new Error(`Failed to fetch most viewed articles: ${error.message}`)
      }

      // Simulate view-based sorting by shuffling and taking the limit
      const shuffled = (data || []).sort(() => Math.random() - 0.5);
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error('Error fetching most viewed articles:', error)
      throw error
    }
  }
}

export const articleService = new ArticleService()