-- Fix Blog Posts RLS Issues
-- Run this in your Supabase SQL Editor

-- 1. First, let's check if the blog_posts table has RLS enabled and fix policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin users can view blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin users can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin users can delete blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;

-- 3. Create proper RLS policies for blog_posts table

-- Allow admin users to insert blog posts
CREATE POLICY "Admin users can insert blog posts" ON blog_posts
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow admin users to view all blog posts
CREATE POLICY "Admin users can view blog posts" ON blog_posts
FOR SELECT USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow admin users to update blog posts
CREATE POLICY "Admin users can update blog posts" ON blog_posts
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow admin users to delete blog posts
CREATE POLICY "Admin users can delete blog posts" ON blog_posts
FOR DELETE USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow public to view published blog posts (for frontend)
CREATE POLICY "Public can view published blog posts" ON blog_posts
FOR SELECT USING (status = 'published');

-- 4. Fix blog_categories table RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can manage categories" ON blog_categories;
DROP POLICY IF EXISTS "Public can view categories" ON blog_categories;

-- Allow admin users to manage categories
CREATE POLICY "Admin users can manage categories" ON blog_categories
FOR ALL USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow public to view categories
CREATE POLICY "Public can view categories" ON blog_categories
FOR SELECT USING (true);

-- 5. Fix blog_authors table RLS
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can manage authors" ON blog_authors;
DROP POLICY IF EXISTS "Public can view authors" ON blog_authors;

-- Allow admin users to manage authors
CREATE POLICY "Admin users can manage authors" ON blog_authors
FOR ALL USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow public to view authors
CREATE POLICY "Public can view authors" ON blog_authors
FOR SELECT USING (true);

-- 6. Ensure the helper function exists
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = user_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON blog_posts TO authenticated;
GRANT ALL ON blog_categories TO authenticated;
GRANT ALL ON blog_authors TO authenticated;

-- 8. Test query to verify admin user setup
-- SELECT 
--   auth.uid() as auth_user_id,
--   is_admin_user() as is_admin,
--   (SELECT email FROM auth.users WHERE id = auth.uid()) as auth_email,
--   (SELECT id, email, role FROM admin_users WHERE id = auth.uid()) as admin_data;