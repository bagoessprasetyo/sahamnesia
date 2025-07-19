-- Fix Media Upload RLS Issues
-- Run this in your Supabase SQL Editor

-- 1. First, let's check if the admin_media table has RLS enabled and fix policies
ALTER TABLE admin_media ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can insert media" ON admin_media;
DROP POLICY IF EXISTS "Admin users can view media" ON admin_media;
DROP POLICY IF EXISTS "Admin users can update media" ON admin_media;
DROP POLICY IF EXISTS "Admin users can delete media" ON admin_media;

-- 3. Create proper RLS policies for admin_media table

-- Allow admin users to insert media records
CREATE POLICY "Admin users can insert media" ON admin_media
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow admin users to view all media records
CREATE POLICY "Admin users can view media" ON admin_media
FOR SELECT USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow admin users to update media records (for alt text, etc.)
CREATE POLICY "Admin users can update media" ON admin_media
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow admin users to delete media records
CREATE POLICY "Admin users can delete media" ON admin_media
FOR DELETE USING (
  auth.uid() IS NOT NULL AND
  (
    -- Can delete own uploads
    uploaded_by = auth.uid() OR
    -- Or if they're super_admin/admin
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
      AND is_active = true
    )
  )
);

-- 4. Fix storage bucket policies
-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

-- Create new storage policies

-- Allow public read access to media files
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated admin users to upload files
CREATE POLICY "Admin Upload" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'media' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow admin users to update file metadata
CREATE POLICY "Admin Update" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'media' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow admin users to delete files
CREATE POLICY "Admin Delete" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'media' AND 
  auth.uid() IS NOT NULL AND
  (
    -- Can delete own uploads
    owner = auth.uid() OR
    -- Or if they're super_admin/admin
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
      AND is_active = true
    )
  )
);

-- 5. Ensure RLS is enabled on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 6. Create a helper function to check admin permissions (if not exists)
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

-- 7. Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- 8. Verify the media bucket exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'media',
      'media',
      true,
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    );
  END IF;
END $$;

-- 9. Test query to verify setup (run this to check if everything works)
-- SELECT is_admin_user(), auth.uid(), (SELECT email FROM auth.users WHERE id = auth.uid());