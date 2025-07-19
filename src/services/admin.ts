import { supabase } from '@/lib/supabase';
import { 
  AdminUser, 
  AdminSession, 
  AdminLoginRequest, 
  AdminLoginResponse,
  AdminStats,
  AdminActivity,
  AdminNotification,
  AdminPermissions,
  ROLE_PERMISSIONS,
  MediaFile,
  MediaUploadResponse
} from '@/types/admin';

export class AdminService {
  private currentAdmin: AdminUser | null = null;
  private currentPermissions: AdminPermissions | null = null;

  /**
   * Login admin user
   */
  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      // First authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (authError) {
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('No user data returned');
      }

      // Get admin user data - use RPC function to avoid RLS issues
      let adminData: any = null;
      
      const { data: rpcData, error: adminError } = await supabase
        .rpc('get_admin_user_by_email', { user_email: credentials.email });

      if (adminError) {
        console.error('Admin user lookup error:', adminError);
        // Try direct query as fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', credentials.email)
          .eq('is_active', true)
          .single();
        
        if (fallbackError || !fallbackData) {
          await supabase.auth.signOut();
          throw new Error('Admin user not found or inactive');
        }
        
        adminData = fallbackData;
      } else if (rpcData && rpcData.length > 0) {
        adminData = rpcData[0];
      }

      if (!adminData) {
        await supabase.auth.signOut();
        throw new Error('Admin user not found or inactive');
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminData.id);

      // Set current admin and permissions
      this.currentAdmin = adminData;
      this.currentPermissions = ROLE_PERMISSIONS[adminData.role];

      // Create session record
      const sessionData = {
        admin_id: adminData.id,
        access_token: authData.session?.access_token || '',
        refresh_token: authData.session?.refresh_token || '',
        expires_at: new Date(Date.now() + (authData.session?.expires_in || 3600) * 1000).toISOString(),
        ip_address: '127.0.0.1', // In real app, get from request
        user_agent: navigator.userAgent
      };

      await supabase
        .from('admin_sessions')
        .insert(sessionData);

      // Log login activity (with error handling)
      try {
        await this.logActivity(adminData.id, 'login', 'system', adminData.id, {
          login_time: new Date().toISOString(),
          ip_address: sessionData.ip_address
        });
      } catch (activityError) {
        console.warn('Failed to log login activity:', activityError);
        // Don't fail login if activity logging fails
      }

      return {
        user: adminData,
        session: {
          access_token: authData.session?.access_token || '',
          refresh_token: authData.session?.refresh_token || '',
          expires_in: authData.session?.expires_in || 3600
        },
        permissions: this.currentPermissions
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout admin user
   */
  async logout(): Promise<void> {
    try {
      if (this.currentAdmin) {
        // Log logout activity (with error handling)
        try {
          await this.logActivity(this.currentAdmin.id, 'logout', 'system', this.currentAdmin.id, {
            logout_time: new Date().toISOString()
          });
        } catch (activityError) {
          console.warn('Failed to log logout activity:', activityError);
          // Don't fail logout if activity logging fails
        }

        // Revoke current session
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          await supabase
            .from('admin_sessions')
            .update({ is_revoked: true })
            .eq('access_token', sessionData.session.access_token);
        }
      }

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear current admin
      this.currentAdmin = null;
      this.currentPermissions = null;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current admin user
   */
  getCurrentAdmin(): AdminUser | null {
    return this.currentAdmin;
  }

  /**
   * Get current admin permissions
   */
  getCurrentPermissions(): AdminPermissions | null {
    return this.currentPermissions;
  }

  /**
   * Check if current admin has permission
   */
  hasPermission(resource: keyof AdminPermissions, action: string): boolean {
    if (!this.currentPermissions) return false;
    
    const resourcePermissions = this.currentPermissions[resource];
    if (!resourcePermissions) return false;
    
    return (resourcePermissions as any)[action] === true;
  }

  /**
   * Verify admin session and load current admin
   */
  async verifySession(): Promise<AdminUser | null> {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        return null;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        return null;
      }

      // Get admin user data
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', userData.user.email)
        .eq('is_active', true)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        return null;
      }

      // Set current admin and permissions
      this.currentAdmin = adminData;
      this.currentPermissions = ROLE_PERMISSIONS[adminData.role];

      return adminData;
    } catch (error) {
      console.error('Session verification error:', error);
      return null;
    }
  }

  /**
   * Get admin statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    try {
      if (!this.currentAdmin || !this.hasPermission('analytics', 'view_dashboard')) {
        throw new Error('Unauthorized to view admin statistics');
      }

      const { data, error } = await supabase.rpc('get_admin_stats', {
        p_admin_id: this.currentAdmin.id
      });

      if (error) {
        throw new Error(`Failed to fetch admin stats: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  /**
   * Get admin activities
   */
  async getAdminActivities(limit: number = 50, offset: number = 0): Promise<AdminActivity[]> {
    try {
      if (!this.currentAdmin || !this.hasPermission('analytics', 'view_dashboard')) {
        throw new Error('Unauthorized to view admin activities');
      }

      const { data, error } = await supabase
        .from('admin_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to fetch admin activities: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching admin activities:', error);
      throw error;
    }
  }

  /**
   * Get admin notifications
   */
  async getAdminNotifications(onlyUnread: boolean = false): Promise<AdminNotification[]> {
    try {
      if (!this.currentAdmin) {
        throw new Error('No admin user logged in');
      }

      let query = supabase
        .from('admin_notifications')
        .select('*')
        .eq('admin_id', this.currentAdmin.id)
        .order('created_at', { ascending: false });

      if (onlyUnread) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      if (!this.currentAdmin) {
        throw new Error('No admin user logged in');
      }

      const { error } = await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('admin_id', this.currentAdmin.id);

      if (error) {
        throw new Error(`Failed to mark notification as read: ${error.message}`);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Create admin notification
   */
  async createNotification(
    type: 'info' | 'success' | 'warning' | 'error',
    title: string,
    message: string,
    actionUrl?: string,
    actionText?: string
  ): Promise<void> {
    try {
      if (!this.currentAdmin) {
        throw new Error('No admin user logged in');
      }

      const { error } = await supabase
        .from('admin_notifications')
        .insert({
          admin_id: this.currentAdmin.id,
          type,
          title,
          message,
          action_url: actionUrl,
          action_text: actionText
        });

      if (error) {
        throw new Error(`Failed to create notification: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Log admin activity
   */
  async logActivity(
    adminId: string,
    action: string,
    resourceType: 'blog_post' | 'category' | 'author' | 'user' | 'system' | 'media',
    resourceId: string,
    details: Record<string, any> = {}
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_activities')
        .insert({
          admin_id: adminId,
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          details,
          ip_address: '127.0.0.1', // In real app, get from request
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'
        });

      if (error) {
        console.error('Failed to log activity:', error);
        throw error; // Throw so calling code can handle it
      }
    } catch (error) {
      console.error('Error logging activity:', error);
      throw error; // Re-throw so calling code can handle it
    }
  }

  /**
   * Upload media file
   */
  async uploadMedia(file: File, altText?: string, description?: string): Promise<MediaUploadResponse> {
    try {
      if (!this.currentAdmin || !this.hasPermission('media', 'upload')) {
        throw new Error('Unauthorized to upload media');
      }

      // Generate unique filename with timestamp and random string
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const fileName = `${timestamp}_${randomString}_${cleanName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Get current auth user ID
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        throw new Error('No authenticated user found');
      }

      // Save media record
      const mediaData = {
        filename: fileName,
        original_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        url: urlData.publicUrl,
        alt_text: altText || '',
        description: description || '',
        uploaded_by: authUser.user.id
      };

      const { data: mediaRecord, error: mediaError } = await supabase
        .from('admin_media')
        .insert(mediaData)
        .select()
        .single();

      if (mediaError) {
        // Clean up uploaded file if database insert fails
        try {
          await supabase.storage.from('media').remove([fileName]);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded file:', cleanupError);
        }
        throw new Error(`Failed to save media record: ${mediaError.message}`);
      }

      // Log activity (with error handling)
      try {
        await this.logActivity(
          this.currentAdmin.id,
          'upload',
          'media',
          mediaRecord.id,
          { filename: file.name, size: file.size, mime_type: file.type }
        );
      } catch (activityError) {
        console.warn('Failed to log media upload activity:', activityError);
        // Don't fail upload if activity logging fails
      }

      return {
        file: mediaRecord,
        message: 'File uploaded successfully'
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  /**
   * Get media files
   */
  async getMediaFiles(limit: number = 20, offset: number = 0): Promise<MediaFile[]> {
    try {
      if (!this.currentAdmin) {
        throw new Error('No admin user logged in');
      }

      const { data, error } = await supabase
        .from('admin_media')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to fetch media files: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching media files:', error);
      throw error;
    }
  }

  /**
   * Delete media file
   */
  async deleteMedia(mediaId: string): Promise<void> {
    try {
      if (!this.currentAdmin || !this.hasPermission('media', 'delete')) {
        throw new Error('Unauthorized to delete media');
      }

      // Get media record
      const { data: mediaData, error: fetchError } = await supabase
        .from('admin_media')
        .select('*')
        .eq('id', mediaId)
        .single();

      if (fetchError || !mediaData) {
        throw new Error('Media file not found');
      }

      // Get current auth user ID
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) {
        throw new Error('No authenticated user found');
      }

      // Check if user can delete (own file or has permission)
      if (mediaData.uploaded_by !== authUser.user.id && 
          !this.hasPermission('media', 'manage')) {
        throw new Error('Unauthorized to delete this media file');
      }

      // Delete from storage
      const fileName = mediaData.filename;
      if (fileName) {
        await supabase.storage.from('media').remove([fileName]);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('admin_media')
        .delete()
        .eq('id', mediaId);

      if (deleteError) {
        throw new Error(`Failed to delete media record: ${deleteError.message}`);
      }

      // Log activity (with error handling)
      try {
        await this.logActivity(
          this.currentAdmin.id,
          'delete',
          'media',
          mediaId,
          { filename: mediaData.filename }
        );
      } catch (activityError) {
        console.warn('Failed to log media delete activity:', activityError);
        // Don't fail delete if activity logging fails
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  }

  /**
   * Get all admin users (super admin only)
   */
  async getAdminUsers(): Promise<AdminUser[]> {
    try {
      if (!this.currentAdmin || !this.hasPermission('admin_users', 'read')) {
        throw new Error('Unauthorized to view admin users');
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch admin users: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching admin users:', error);
      throw error;
    }
  }

  /**
   * Update admin user
   */
  async updateAdminUser(userId: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    try {
      if (!this.currentAdmin) {
        throw new Error('No admin user logged in');
      }

      // Check permissions
      const isSelfUpdate = userId === this.currentAdmin.id;
      if (!isSelfUpdate && !this.hasPermission('admin_users', 'update')) {
        throw new Error('Unauthorized to update admin users');
      }

      // Prevent role changes unless super admin
      if (updates.role && this.currentAdmin.role !== 'super_admin') {
        throw new Error('Only super admins can change user roles');
      }

      const { data, error } = await supabase
        .from('admin_users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update admin user: ${error.message}`);
      }

      // Log activity (with error handling)
      try {
        await this.logActivity(
          this.currentAdmin.id,
          'update',
          'user',
          userId,
          updates
        );
      } catch (activityError) {
        console.warn('Failed to log user update activity:', activityError);
        // Don't fail update if activity logging fails
      }

      return data;
    } catch (error) {
      console.error('Error updating admin user:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();