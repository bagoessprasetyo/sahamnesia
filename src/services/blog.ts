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
  BlogStats,
  BlogCategoryCreate,
  BlogCategoryUpdate,
  BlogAuthorCreate,
  BlogAuthorUpdate
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

  // =================== CATEGORY MANAGEMENT ===================

  /**
   * Get all blog categories (including inactive)
   */
  async getAllBlogCategories(): Promise<BlogCategory[]> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) {
        throw new Error(`Failed to fetch all blog categories: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all blog categories:', error);
      throw error;
    }
  }

  /**
   * Get blog category by ID
   */
  async getBlogCategoryById(id: number): Promise<BlogCategory | null> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(`Failed to fetch blog category: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching blog category:', error);
      throw error;
    }
  }

  /**
   * Create a new blog category
   */
  async createBlogCategory(categoryData: BlogCategoryCreate): Promise<BlogCategory> {
    try {
      // Generate slug if not provided
      const slug = categoryData.slug || this.generateSlug(categoryData.name);
      
      const { data, error } = await supabase
        .from('blog_categories')
        .insert({
          ...categoryData,
          slug,
          is_active: categoryData.is_active ?? true
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create blog category: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating blog category:', error);
      throw error;
    }
  }

  /**
   * Update a blog category
   */
  async updateBlogCategory(id: number, categoryData: BlogCategoryUpdate): Promise<BlogCategory> {
    try {
      // Generate slug if name is being updated and slug is not provided
      const updateData = { ...categoryData };
      if (categoryData.name && !categoryData.slug) {
        updateData.slug = this.generateSlug(categoryData.name);
      }

      const { data, error } = await supabase
        .from('blog_categories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update blog category: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating blog category:', error);
      throw error;
    }
  }

  /**
   * Delete a blog category
   */
  async deleteBlogCategory(id: number): Promise<void> {
    try {
      // Check if category is used by any posts
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('category_id', id)
        .limit(1);

      if (postsError) {
        throw new Error(`Failed to check category usage: ${postsError.message}`);
      }

      if (posts && posts.length > 0) {
        throw new Error('Cannot delete category that is used by existing posts. Please reassign or delete those posts first.');
      }

      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete blog category: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting blog category:', error);
      throw error;
    }
  }

  /**
   * Get category usage statistics
   */
  async getCategoryStats(): Promise<Array<{ category: BlogCategory; post_count: number }>> {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select(`
          *,
          blog_posts(count)
        `);

      if (error) {
        throw new Error(`Failed to fetch category stats: ${error.message}`);
      }

      return (data || []).map(item => ({
        category: {
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          color: item.color,
          icon: item.icon,
          is_active: item.is_active,
          created_at: item.created_at,
          updated_at: item.updated_at
        },
        post_count: item.blog_posts?.[0]?.count || 0
      }));
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
  }

  // =================== AUTHOR MANAGEMENT ===================

  /**
   * Get all blog authors (including inactive)
   */
  async getAllBlogAuthors(): Promise<BlogAuthor[]> {
    try {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .order('name');

      if (error) {
        throw new Error(`Failed to fetch all blog authors: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching all blog authors:', error);
      throw error;
    }
  }

  /**
   * Get blog author by ID
   */
  async getBlogAuthorById(id: number): Promise<BlogAuthor | null> {
    try {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw new Error(`Failed to fetch blog author: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching blog author:', error);
      throw error;
    }
  }

  /**
   * Create a new blog author
   */
  async createBlogAuthor(authorData: BlogAuthorCreate): Promise<BlogAuthor> {
    try {
      // Generate slug if not provided
      const slug = authorData.slug || this.generateSlug(authorData.name);
      
      const { data, error } = await supabase
        .from('blog_authors')
        .insert({
          ...authorData,
          slug,
          is_active: authorData.is_active ?? true,
          social_links: authorData.social_links || {}
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create blog author: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating blog author:', error);
      throw error;
    }
  }

  /**
   * Update a blog author
   */
  async updateBlogAuthor(id: number, authorData: BlogAuthorUpdate): Promise<BlogAuthor> {
    try {
      // Generate slug if name is being updated and slug is not provided
      const updateData = { ...authorData };
      if (authorData.name && !authorData.slug) {
        updateData.slug = this.generateSlug(authorData.name);
      }

      const { data, error } = await supabase
        .from('blog_authors')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update blog author: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating blog author:', error);
      throw error;
    }
  }

  /**
   * Delete a blog author
   */
  async deleteBlogAuthor(id: number): Promise<void> {
    try {
      // Check if author is used by any posts
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('author_id', id)
        .limit(1);

      if (postsError) {
        throw new Error(`Failed to check author usage: ${postsError.message}`);
      }

      if (posts && posts.length > 0) {
        throw new Error('Cannot delete author who has written posts. Please reassign or delete those posts first.');
      }

      const { error } = await supabase
        .from('blog_authors')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete blog author: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting blog author:', error);
      throw error;
    }
  }

  /**
   * Get author usage statistics
   */
  async getAuthorStats(): Promise<Array<{ author: BlogAuthor; post_count: number }>> {
    try {
      const { data, error } = await supabase
        .from('blog_authors')
        .select(`
          *,
          blog_posts(count)
        `);

      if (error) {
        throw new Error(`Failed to fetch author stats: ${error.message}`);
      }

      return (data || []).map(item => ({
        author: {
          id: item.id,
          name: item.name,
          slug: item.slug,
          bio: item.bio,
          avatar_url: item.avatar_url,
          role: item.role,
          email: item.email,
          social_links: item.social_links || {},
          is_active: item.is_active,
          created_at: item.created_at,
          updated_at: item.updated_at
        },
        post_count: item.blog_posts?.[0]?.count || 0
      }));
    } catch (error) {
      console.error('Error fetching author stats:', error);
      throw error;
    }
  }

  // =================== UTILITY METHODS ===================

  /**
   * Generate URL-friendly slug from text
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}

export const blogService = new BlogService();