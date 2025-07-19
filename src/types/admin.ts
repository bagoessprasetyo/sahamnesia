export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export interface AdminPermissions {
  blog_posts: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    publish: boolean;
  };
  blog_categories: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  blog_authors: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  news_articles: {
    read: boolean;
    analytics: boolean;
  };
  admin_users: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  analytics: {
    view_dashboard: boolean;
    view_detailed: boolean;
    export_data: boolean;
  };
  media: {
    upload: boolean;
    delete: boolean;
    manage: boolean;
  };
}

export interface AdminSession {
  user: AdminUser;
  permissions: AdminPermissions;
  expires_at: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  user: AdminUser;
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  permissions: AdminPermissions;
}

export interface AdminStats {
  blog_posts: {
    total: number;
    published: number;
    drafts: number;
    scheduled: number;
  };
  news_articles: {
    total: number;
    today: number;
    this_week: number;
  };
  analytics: {
    total_views: number;
    today_views: number;
    trending_posts: number;
  };
  system: {
    storage_used: string;
    active_users: number;
    last_backup: string;
  };
}

export interface AdminActivity {
  id: string;
  admin_id: string;
  action: string;
  resource_type: 'blog_post' | 'category' | 'author' | 'user' | 'system';
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AdminNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  action_url?: string;
  action_text?: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminUserCreate {
  email: string;
  name: string;
  role: AdminRole;
  avatar_url?: string;
  password: string;
}

export interface AdminUserUpdate {
  name?: string;
  role?: AdminRole;
  avatar_url?: string;
  is_active?: boolean;
  password?: string;
}

// Content Management Interfaces
export interface ContentFilters {
  status?: 'all' | 'draft' | 'published' | 'archived';
  category?: string;
  author?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'published_at' | 'title' | 'views';
  sort_order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BulkAction {
  action: 'publish' | 'unpublish' | 'archive' | 'delete' | 'change_category' | 'add_tags';
  post_ids: number[];
  payload?: {
    category_id?: number;
    tags?: string[];
  };
}

export interface MediaFile {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text?: string;
  description?: string;
  uploaded_by: string;
  created_at: string;
}

export interface MediaUploadResponse {
  file: MediaFile;
  message: string;
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermissions> = {
  super_admin: {
    blog_posts: { create: true, read: true, update: true, delete: true, publish: true },
    blog_categories: { create: true, read: true, update: true, delete: true },
    blog_authors: { create: true, read: true, update: true, delete: true },
    news_articles: { read: true, analytics: true },
    admin_users: { create: true, read: true, update: true, delete: true },
    analytics: { view_dashboard: true, view_detailed: true, export_data: true },
    media: { upload: true, delete: true, manage: true }
  },
  admin: {
    blog_posts: { create: true, read: true, update: true, delete: true, publish: true },
    blog_categories: { create: true, read: true, update: true, delete: false },
    blog_authors: { create: true, read: true, update: true, delete: false },
    news_articles: { read: true, analytics: true },
    admin_users: { create: false, read: true, update: false, delete: false },
    analytics: { view_dashboard: true, view_detailed: true, export_data: false },
    media: { upload: true, delete: true, manage: true }
  },
  editor: {
    blog_posts: { create: true, read: true, update: true, delete: false, publish: false },
    blog_categories: { create: false, read: true, update: false, delete: false },
    blog_authors: { create: false, read: true, update: false, delete: false },
    news_articles: { read: true, analytics: false },
    admin_users: { create: false, read: false, update: false, delete: false },
    analytics: { view_dashboard: true, view_detailed: false, export_data: false },
    media: { upload: true, delete: false, manage: false }
  }
};