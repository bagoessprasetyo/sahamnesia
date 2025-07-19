import { supabase } from '@/lib/supabase';
import { 
  BlogPost, 
  BlogAuthor, 
  BlogCategory, 
  BlogFilters, 
  BlogResponse,
  BlogPostWithRelations,
  BlogPostCreate,
  BlogPostUpdate,
  BlogStats
} from '@/types/blog';

export class BlogService {
  /**
   * Fetch blog posts with optional filters and relations
   */
  async getBlogPosts(filters: BlogFilters = {}): Promise<BlogResponse> {
    const { 
      category, 
      author, 
      tags, 
      search, 
      status = 'published',
      is_featured,
      is_premium,
      limit = 10, 
      offset = 0,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = filters;

    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `, { count: 'exact' });

      // Apply status filter (handle 'all' status)
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply sorting
      query = query.order(sort_by, { ascending: sort_order === 'asc' });

      // Apply search filter
      if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
      }

      // Apply category filter
      if (category && category !== 'Semua') {
        if (typeof category === 'string') {
          query = query.eq('category.slug', category);
        }
      }

      // Apply author filter
      if (author) {
        query = query.eq('author.slug', author);
      }

      // Apply tags filter
      if (tags && tags.length > 0) {
        query = query.overlaps('tags', tags);
      }

      // Apply featured filter
      if (is_featured !== undefined) {
        query = query.eq('is_featured', is_featured);
      }

      // Apply premium filter
      if (is_premium !== undefined) {
        query = query.eq('is_premium', is_premium);
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch blog posts: ${error.message}`);
      }

      return {
        data: data || [],
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  /**
   * Get a single blog post by ID or slug with relations
   */
  async getBlogPostById(identifier: number | string): Promise<BlogPostWithRelations | null> {
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `)
        .eq('status', 'published');

      if (typeof identifier === 'number') {
        query = query.eq('id', identifier);
      } else {
        query = query.eq('slug', identifier);
      }

      const { data, error } = await query.single();

      if (error) {
        throw new Error(`Failed to fetch blog post: ${error.message}`);
      }

      // Increment view count
      if (data) {
        await this.incrementViewCount(data.id);
      }

      return data;
    } catch (error) {
      console.error('Error fetching blog post by identifier:', error);
      throw error;
    }
  }

  /**
   * Get featured blog posts
   */
  async getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch featured blog posts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching featured blog posts:', error);
      throw error;
    }
  }

  /**
   * Get recent blog posts
   */
  async getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch recent blog posts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent blog posts:', error);
      throw error;
    }
  }

  /**
   * Search blog posts
   */
  async searchBlogPosts(query: string, limit: number = 10): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `)
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to search blog posts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }
  }

  /**
   * Get blog posts by category
   */
  async getBlogPostsByCategory(categorySlug: string, limit: number = 10): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `)
        .eq('status', 'published')
        .eq('category.slug', categorySlug)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch blog posts by category: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching blog posts by category:', error);
      throw error;
    }
  }

  /**
   * Get blog posts by author
   */
  async getBlogPostsByAuthor(authorSlug: string, limit: number = 10): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `)
        .eq('status', 'published')
        .eq('author.slug', authorSlug)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch blog posts by author: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching blog posts by author:', error);
      throw error;
    }
  }

  /**
   * Get all blog categories
   */
  async getBlogCategories(): Promise<BlogCategory[]> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw new Error(`Failed to fetch blog categories: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
  }

  /**
   * Get all blog authors
   */
  async getBlogAuthors(): Promise<BlogAuthor[]> {
    try {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw new Error(`Failed to fetch blog authors: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching blog authors:', error);
      throw error;
    }
  }

  /**
   * Get all unique tags from blog posts
   */
  async getBlogTags(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('status', 'published')
        .not('tags', 'is', null);

      if (error) {
        throw new Error(`Failed to fetch blog tags: ${error.message}`);
      }

      // Extract unique tags
      const tags = new Set<string>();
      
      data?.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag: string) => tags.add(tag));
        }
      });

      return Array.from(tags).sort();
    } catch (error) {
      console.error('Error fetching blog tags:', error);
      throw error;
    }
  }

  /**
   * Get related blog posts
   */
  async getRelatedBlogPosts(postId: number, limit: number = 3): Promise<BlogPost[]> {
    try {
      // First get the current post to find related posts by category and tags
      const currentPost = await this.getBlogPostById(postId);
      if (!currentPost) return [];

      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `)
        .eq('status', 'published')
        .neq('id', postId)
        .or(`category_id.eq.${currentPost.category_id},tags.cs.{${currentPost.tags?.join(',') || ''}}`)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Failed to fetch related blog posts: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching related blog posts:', error);
      throw error;
    }
  }

  /**
   * Increment view count for a blog post
   */
  async incrementViewCount(postId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          view_count: supabase.raw('view_count + 1') 
        })
        .eq('id', postId);

      if (error) {
        console.error('Failed to increment view count:', error);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  /**
   * Get blog statistics
   */
  async getBlogStats(): Promise<BlogStats> {
    try {
      const [
        totalResult,
        publishedResult,
        draftResult,
        featuredResult,
        premiumResult,
        viewsResult
      ] = await Promise.all([
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_featured', true),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('is_premium', true),
        supabase.from('blog_posts').select('view_count, like_count, comment_count')
      ]);

      const totals = viewsResult.data?.reduce(
        (acc, post) => ({
          views: acc.views + (post.view_count || 0),
          likes: acc.likes + (post.like_count || 0),
          comments: acc.comments + (post.comment_count || 0),
        }),
        { views: 0, likes: 0, comments: 0 }
      ) || { views: 0, likes: 0, comments: 0 };

      return {
        totalPosts: totalResult.count || 0,
        publishedPosts: publishedResult.count || 0,
        draftPosts: draftResult.count || 0,
        featuredPosts: featuredResult.count || 0,
        premiumPosts: premiumResult.count || 0,
        totalViews: totals.views,
        totalLikes: totals.likes,
        totalComments: totals.comments,
      };
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      throw error;
    }
  }

  /**
   * Create a new blog post
   */
  async createBlogPost(postData: BlogPostCreate): Promise<BlogPost> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(postData)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create blog post: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  /**
   * Update a blog post
   */
  async updateBlogPost(postData: BlogPostUpdate): Promise<BlogPost> {
    try {
      const { id, ...updateData } = postData;
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update blog post: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  /**
   * Delete a blog post
   */
  async deleteBlogPost(postId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw new Error(`Failed to delete blog post: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }
}

export const blogService = new BlogService();