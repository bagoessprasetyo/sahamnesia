-- Fix Admin RLS Policies - Remove Infinite Recursion
-- Run this in your Supabase SQL Editor

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "Super admins can manage all users" ON admin_users;
DROP POLICY IF EXISTS "Admins can read all users" ON admin_users;
DROP POLICY IF EXISTS "Users can read their own profile" ON admin_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON admin_users;

DROP POLICY IF EXISTS "Users can manage their own sessions" ON admin_sessions;
DROP POLICY IF EXISTS "Super admins can view all sessions" ON admin_sessions;

DROP POLICY IF EXISTS "Admins can read activities" ON admin_activities;
DROP POLICY IF EXISTS "Users can read their own activities" ON admin_activities;

-- 2. Create fixed policies that don't cause recursion

-- Admin Users Policies - Use auth.uid() directly without checking admin_users table
CREATE POLICY "Admin users can read all profiles" ON admin_users 
    FOR SELECT USING (true);

CREATE POLICY "Admin users can update their own profile" ON admin_users 
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admin users can insert new profiles" ON admin_users 
    FOR INSERT WITH CHECK (true);

-- Admin Sessions Policies
CREATE POLICY "Users can manage their own sessions" ON admin_sessions 
    FOR ALL USING (admin_id = auth.uid());

-- Admin Activities Policies  
CREATE POLICY "All authenticated users can read activities" ON admin_activities 
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Admin Notifications Policies
CREATE POLICY "Users can manage their own notifications" ON admin_notifications 
    FOR ALL USING (admin_id = auth.uid());

-- Admin Media Policies
CREATE POLICY "All authenticated users can read media" ON admin_media 
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can upload media" ON admin_media 
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own media" ON admin_media 
    FOR DELETE USING (uploaded_by = auth.uid());

-- 3. Create a simple function to check if user is admin (without RLS)
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Simple existence check without triggering RLS
    RETURN EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = user_id 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a function to get admin role (without RLS)
CREATE OR REPLACE FUNCTION get_admin_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role 
    FROM admin_users 
    WHERE id = user_id 
    AND is_active = true;
    
    RETURN COALESCE(user_role, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create function to get admin user by email (for login)
CREATE OR REPLACE FUNCTION get_admin_user_by_email(user_email TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    name TEXT,
    role TEXT,
    avatar_url TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id,
        au.email,
        au.name,
        au.role,
        au.avatar_url,
        au.is_active,
        au.created_at,
        au.updated_at,
        au.last_login
    FROM admin_users au
    WHERE au.email = user_email 
    AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update blog table policies to use the new function
DROP POLICY IF EXISTS "Super admins can manage all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Editors can create and update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Editors can update draft blog posts" ON blog_posts;

-- New blog policies using the helper function
CREATE POLICY "Admin users can manage blog posts" ON blog_posts 
    FOR ALL USING (
        auth.uid() IS NOT NULL AND is_admin_user(auth.uid())
    );

-- Blog Categories Policies
DROP POLICY IF EXISTS "Super admins can manage all categories" ON blog_categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON blog_categories;

CREATE POLICY "Admin users can manage categories" ON blog_categories 
    FOR ALL USING (
        auth.uid() IS NOT NULL AND is_admin_user(auth.uid())
    );

-- Blog Authors Policies
DROP POLICY IF EXISTS "Super admins can manage all authors" ON blog_authors;
DROP POLICY IF EXISTS "Admins can manage authors" ON blog_authors;

CREATE POLICY "Admin users can manage authors" ON blog_authors 
    FOR ALL USING (
        auth.uid() IS NOT NULL AND is_admin_user(auth.uid())
    );

-- 7. Disable RLS temporarily for initial setup (optional - re-enable after testing)
-- ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_activities DISABLE ROW LEVEL SECURITY;

-- If you want to keep RLS enabled, the above policies should work without recursion