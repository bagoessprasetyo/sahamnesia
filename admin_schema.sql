-- Admin Database Schema for Sahamnesia CMS
-- Run these SQL commands in your Supabase SQL editor

-- 1. Admin Users Table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Admin Sessions Table  
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Admin Activities Table (Audit Log)
CREATE TABLE admin_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('blog_post', 'category', 'author', 'user', 'system', 'media')),
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Admin Notifications Table
CREATE TABLE admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  action_text TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Media Files Table
CREATE TABLE admin_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  description TEXT,
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for performance
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

CREATE INDEX idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_is_revoked ON admin_sessions(is_revoked);

CREATE INDEX idx_admin_activities_admin_id ON admin_activities(admin_id);
CREATE INDEX idx_admin_activities_resource_type ON admin_activities(resource_type);
CREATE INDEX idx_admin_activities_created_at ON admin_activities(created_at);

CREATE INDEX idx_admin_notifications_admin_id ON admin_notifications(admin_id);
CREATE INDEX idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at);

CREATE INDEX idx_admin_media_uploaded_by ON admin_media(uploaded_by);
CREATE INDEX idx_admin_media_mime_type ON admin_media(mime_type);
CREATE INDEX idx_admin_media_created_at ON admin_media(created_at);

-- 7. Create updated_at trigger function (reuse existing one if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Activity logging trigger function
CREATE OR REPLACE FUNCTION log_admin_activity()
RETURNS TRIGGER AS $$
DECLARE
    action_name TEXT;
    admin_id_val UUID;
BEGIN
    -- Determine action based on operation
    IF TG_OP = 'INSERT' THEN
        action_name := 'created';
    ELSIF TG_OP = 'UPDATE' THEN
        action_name := 'updated';
    ELSIF TG_OP = 'DELETE' THEN
        action_name := 'deleted';
    END IF;
    
    -- Get admin_id from current session (you'll need to set this in your app)
    admin_id_val := current_setting('sahamnesia.current_admin_id', true)::UUID;
    
    -- Only log if admin_id is set
    IF admin_id_val IS NOT NULL THEN
        INSERT INTO admin_activities (
            admin_id,
            action,
            resource_type,
            resource_id,
            details,
            ip_address,
            user_agent
        ) VALUES (
            admin_id_val,
            action_name || '_' || TG_TABLE_NAME,
            CASE 
                WHEN TG_TABLE_NAME = 'blog_posts' THEN 'blog_post'
                WHEN TG_TABLE_NAME = 'blog_categories' THEN 'category'
                WHEN TG_TABLE_NAME = 'blog_authors' THEN 'author'
                WHEN TG_TABLE_NAME = 'admin_users' THEN 'user'
                WHEN TG_TABLE_NAME = 'admin_media' THEN 'media'
                ELSE 'system'
            END,
            COALESCE(NEW.id::TEXT, OLD.id::TEXT),
            jsonb_build_object(
                'old', to_jsonb(OLD),
                'new', to_jsonb(NEW)
            ),
            inet_client_addr(),
            current_setting('sahamnesia.current_user_agent', true)
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- 10. Create activity logging triggers for important tables
CREATE TRIGGER log_blog_posts_activity 
    AFTER INSERT OR UPDATE OR DELETE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER log_blog_categories_activity 
    AFTER INSERT OR UPDATE OR DELETE ON blog_categories 
    FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER log_blog_authors_activity 
    AFTER INSERT OR UPDATE OR DELETE ON blog_authors 
    FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER log_admin_users_activity 
    AFTER INSERT OR UPDATE OR DELETE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

CREATE TRIGGER log_admin_media_activity 
    AFTER INSERT OR UPDATE OR DELETE ON admin_media 
    FOR EACH ROW EXECUTE FUNCTION log_admin_activity();

-- 11. Enable Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_media ENABLE ROW LEVEL SECURITY;

-- 12. Create RLS policies

-- Admin Users Policies
CREATE POLICY "Super admins can manage all users" ON admin_users 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'super_admin' 
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins can read all users" ON admin_users 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role IN ('super_admin', 'admin') 
            AND au.is_active = true
        )
    );

CREATE POLICY "Users can read their own profile" ON admin_users 
    FOR SELECT USING (id = auth.uid()::UUID);

CREATE POLICY "Users can update their own profile" ON admin_users 
    FOR UPDATE USING (id = auth.uid()::UUID)
    WITH CHECK (id = auth.uid()::UUID AND role = (SELECT role FROM admin_users WHERE id = auth.uid()::UUID));

-- Admin Sessions Policies
CREATE POLICY "Users can manage their own sessions" ON admin_sessions 
    FOR ALL USING (admin_id = auth.uid()::UUID);

CREATE POLICY "Super admins can view all sessions" ON admin_sessions 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'super_admin' 
            AND au.is_active = true
        )
    );

-- Admin Activities Policies  
CREATE POLICY "Admins can read activities" ON admin_activities 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role IN ('super_admin', 'admin') 
            AND au.is_active = true
        )
    );

CREATE POLICY "Users can read their own activities" ON admin_activities 
    FOR SELECT USING (admin_id = auth.uid()::UUID);

-- Admin Notifications Policies
CREATE POLICY "Users can manage their own notifications" ON admin_notifications 
    FOR ALL USING (admin_id = auth.uid()::UUID);

-- Admin Media Policies
CREATE POLICY "All admins can read media" ON admin_media 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins can upload media" ON admin_media 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role IN ('super_admin', 'admin', 'editor') 
            AND au.is_active = true
        )
    );

CREATE POLICY "Super admins and admins can delete media" ON admin_media 
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role IN ('super_admin', 'admin') 
            AND au.is_active = true
        )
    );

CREATE POLICY "Uploaders can delete their own media" ON admin_media 
    FOR DELETE USING (uploaded_by = auth.uid()::UUID);

-- 13. Update existing blog table policies for admin access

-- Blog Posts Admin Policies
CREATE POLICY "Super admins can manage all blog posts" ON blog_posts 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'super_admin' 
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins can manage all blog posts" ON blog_posts 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'admin' 
            AND au.is_active = true
        )
    );

CREATE POLICY "Editors can create and update blog posts" ON blog_posts 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'editor' 
            AND au.is_active = true
        )
    );

CREATE POLICY "Editors can update draft blog posts" ON blog_posts 
    FOR UPDATE USING (
        status = 'draft' AND EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'editor' 
            AND au.is_active = true
        )
    ) WITH CHECK (
        status IN ('draft', 'published') AND EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'editor' 
            AND au.is_active = true
        )
    );

-- Blog Categories Admin Policies
CREATE POLICY "Super admins can manage all categories" ON blog_categories 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'super_admin' 
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins can manage categories" ON blog_categories 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'admin' 
            AND au.is_active = true
        )
    );

-- Blog Authors Admin Policies  
CREATE POLICY "Super admins can manage all authors" ON blog_authors 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'super_admin' 
            AND au.is_active = true
        )
    );

CREATE POLICY "Admins can manage authors" ON blog_authors 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users au 
            WHERE au.id = auth.uid()::UUID 
            AND au.role = 'admin' 
            AND au.is_active = true
        )
    );

-- 14. Insert default admin user (change email and create proper auth user first)
INSERT INTO admin_users (email, name, role) VALUES
  ('admin@sahamnesia.com', 'Super Admin', 'super_admin'),
  ('editor@sahamnesia.com', 'Editor User', 'editor');

-- 15. Create function to check admin permissions
CREATE OR REPLACE FUNCTION check_admin_permission(
    p_admin_id UUID,
    p_resource TEXT,
    p_action TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    admin_role TEXT;
BEGIN
    -- Get admin role
    SELECT role INTO admin_role 
    FROM admin_users 
    WHERE id = p_admin_id AND is_active = true;
    
    IF admin_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Super admin has all permissions
    IF admin_role = 'super_admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Check role-based permissions
    CASE p_resource
        WHEN 'blog_posts' THEN
            CASE p_action
                WHEN 'create', 'read', 'update' THEN
                    RETURN admin_role IN ('admin', 'editor');
                WHEN 'delete', 'publish' THEN
                    RETURN admin_role = 'admin';
                ELSE
                    RETURN FALSE;
            END CASE;
        WHEN 'blog_categories', 'blog_authors' THEN
            CASE p_action
                WHEN 'read' THEN
                    RETURN TRUE;
                WHEN 'create', 'update' THEN
                    RETURN admin_role = 'admin';
                WHEN 'delete' THEN
                    RETURN FALSE; -- Only super_admin
                ELSE
                    RETURN FALSE;
            END CASE;
        WHEN 'admin_users' THEN
            CASE p_action
                WHEN 'read' THEN
                    RETURN admin_role = 'admin';
                ELSE
                    RETURN FALSE; -- Only super_admin
            END CASE;
        WHEN 'media' THEN
            CASE p_action
                WHEN 'upload' THEN
                    RETURN TRUE; -- All roles
                WHEN 'delete', 'manage' THEN
                    RETURN admin_role = 'admin';
                ELSE
                    RETURN FALSE;
            END CASE;
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Create function to get admin stats
CREATE OR REPLACE FUNCTION get_admin_stats(p_admin_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = p_admin_id 
        AND role IN ('super_admin', 'admin') 
        AND is_active = true
    ) THEN
        RETURN json_build_object('error', 'Unauthorized');
    END IF;
    
    SELECT json_build_object(
        'blog_posts', json_build_object(
            'total', (SELECT COUNT(*) FROM blog_posts),
            'published', (SELECT COUNT(*) FROM blog_posts WHERE status = 'published'),
            'drafts', (SELECT COUNT(*) FROM blog_posts WHERE status = 'draft'),
            'scheduled', (SELECT COUNT(*) FROM blog_posts WHERE status = 'published' AND published_at > NOW())
        ),
        'news_articles', json_build_object(
            'total', (SELECT COUNT(*) FROM articles),
            'today', (SELECT COUNT(*) FROM articles WHERE DATE(created_at) = CURRENT_DATE),
            'this_week', (SELECT COUNT(*) FROM articles WHERE created_at >= CURRENT_DATE - INTERVAL '7 days')
        ),
        'analytics', json_build_object(
            'total_views', (SELECT COALESCE(SUM(view_count), 0) FROM blog_posts),
            'today_views', 0, -- Would need to implement daily view tracking
            'trending_posts', (SELECT COUNT(*) FROM blog_posts WHERE is_featured = true)
        ),
        'system', json_build_object(
            'storage_used', '0 MB', -- Would need to calculate actual storage
            'active_users', (SELECT COUNT(*) FROM admin_users WHERE is_active = true),
            'last_backup', NOW()::TEXT
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM admin_sessions 
    WHERE expires_at < NOW() OR is_revoked = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 18. Create scheduled job to clean up sessions (if pg_cron is available)
-- SELECT cron.schedule('cleanup-admin-sessions', '0 2 * * *', 'SELECT cleanup_expired_sessions();');