-- Setup Supabase Storage for Media Uploads
-- Run this in your Supabase SQL Editor

-- 1. Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Create RLS policies for storage bucket

-- Allow authenticated users to read all files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated admin users to upload files
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'media' AND 
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() 
    AND is_active = true
  )
);

-- Allow admin users to delete their own files or if they're super admin/admin
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'media' AND 
  auth.uid() IS NOT NULL AND
  (
    owner = auth.uid() OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() 
      AND role IN ('super_admin', 'admin')
      AND is_active = true
    )
  )
);

-- 3. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Create a function to clean up orphaned media files
CREATE OR REPLACE FUNCTION cleanup_orphaned_media()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    media_record RECORD;
BEGIN
    -- Find media records where the storage file no longer exists
    FOR media_record IN 
        SELECT id, url FROM admin_media
    LOOP
        -- Check if the file exists in storage
        IF NOT EXISTS (
            SELECT 1 FROM storage.objects 
            WHERE bucket_id = 'media' 
            AND name = substring(media_record.url from '/storage/v1/object/public/media/(.*)$')
        ) THEN
            -- Delete the orphaned media record
            DELETE FROM admin_media WHERE id = media_record.id;
            deleted_count := deleted_count + 1;
        END IF;
    END LOOP;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create a function to get storage usage stats
CREATE OR REPLACE FUNCTION get_storage_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_files', COUNT(*),
        'total_size_bytes', COALESCE(SUM(metadata->>'size')::bigint, 0),
        'total_size_mb', ROUND(COALESCE(SUM(metadata->>'size')::bigint, 0) / 1024.0 / 1024.0, 2),
        'image_files', COUNT(*) FILTER (WHERE metadata->>'mimetype' LIKE 'image/%'),
        'avg_file_size_kb', ROUND(AVG((metadata->>'size')::bigint) / 1024.0, 2)
    ) INTO result
    FROM storage.objects 
    WHERE bucket_id = 'media';
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Example usage (uncomment to test):
-- SELECT get_storage_stats();
-- SELECT cleanup_orphaned_media();