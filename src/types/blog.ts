export interface BlogAuthor {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  avatar_url?: string;
  role: string;
  email?: string;
  social_links?: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogAuthorCreate {
  name: string;
  slug?: string;
  bio?: string;
  avatar_url?: string;
  role: string;
  email?: string;
  social_links?: Record<string, string>;
  is_active?: boolean;
}

export interface BlogAuthorUpdate {
  name?: string;
  slug?: string;
  bio?: string;
  avatar_url?: string;
  role?: string;
  email?: string;
  social_links?: Record<string, string>;
  is_active?: boolean;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogCategoryCreate {
  name: string;
  slug?: string;
  description?: string;
  color: string;
  icon?: string;
  is_active?: boolean;
}

export interface BlogCategoryUpdate {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image_url?: string;
  author_id?: number;
  category_id?: number;
  tags?: string[];
  is_featured: boolean;
  is_premium: boolean;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  reading_time?: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  author?: BlogAuthor;
  category?: BlogCategory;
}

export interface BlogPostWithRelations extends BlogPost {
  author: BlogAuthor;
  category: BlogCategory;
}

export interface BlogFilters {
  category?: string;
  author?: string;
  tags?: string[];
  search?: string;
  status?: 'draft' | 'published' | 'archived' | 'all';
  is_featured?: boolean;
  is_premium?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: 'created_at' | 'updated_at' | 'published_at' | 'title' | 'view_count';
  sort_order?: 'asc' | 'desc';
}

export interface BlogResponse {
  data: BlogPost[];
  total: number;
  hasMore: boolean;
}

export interface BlogPostCreate {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image_url?: string;
  author_id?: number;
  category_id?: number;
  tags?: string[];
  is_featured?: boolean;
  is_premium?: boolean;
  status?: 'draft' | 'published' | 'archived';
  published_at?: string;
  reading_time?: number;
  seo_title?: string;
  seo_description?: string;
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {
  id: number;
}

// Display interfaces for UI components
export interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  isPremium: boolean;
  isFeatured: boolean;
  views: number;
  comments: number;
  likes: number;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  featuredPosts: number;
  premiumPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}