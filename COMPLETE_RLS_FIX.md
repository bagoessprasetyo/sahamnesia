# Complete RLS Policy Fix for Sahamnesia CMS

## Issue
Getting "new row violates row-level security policy" errors when:
1. Uploading images (`admin_media` table)
2. Creating/updating blog posts (`blog_posts` table)

## Root Cause
The main issue is that `admin_users.id` doesn't match `auth.users.id`, causing RLS policies to fail since they check `auth.uid()` against admin_users records.

## Complete Fix Instructions

### Step 1: Fix Admin User ID Sync
Run `fix_admin_user_sync.sql` in your Supabase SQL Editor:
```sql
-- This will:
-- 1. Update existing admin_users.id to match auth.users.id
-- 2. Create triggers to keep them in sync
-- 3. Update RLS policies to be more permissive
```

### Step 2: Fix Media Upload RLS
Run `fix_media_upload_rls.sql` in your Supabase SQL Editor:
```sql
-- This will:
-- 1. Fix admin_media table RLS policies
-- 2. Fix storage bucket policies
-- 3. Create proper permissions for media uploads
```

### Step 3: Fix Blog Posts RLS  
Run `fix_blog_posts_rls.sql` in your Supabase SQL Editor:
```sql
-- This will:
-- 1. Fix blog_posts table RLS policies
-- 2. Fix blog_categories and blog_authors RLS policies
-- 3. Allow both admin operations and public read access
```

## Execution Order
**IMPORTANT**: Run the SQL files in this exact order:

1. `fix_admin_user_sync.sql` (fixes the core ID mismatch issue)
2. `fix_media_upload_rls.sql` (fixes media upload policies)  
3. `fix_blog_posts_rls.sql` (fixes blog management policies)

## Verification

After running all fixes, test:

1. **Login to Admin Panel**: Go to `localhost:5173/admin`
2. **Create Blog Post**: Try creating a new blog post
3. **Upload Image**: Try uploading a featured image
4. **Media Library**: Check if media library loads at `/admin/media`

## What Each Fix Does

### fix_admin_user_sync.sql
- Syncs `admin_users.id` with `auth.users.id` for existing users
- Creates triggers to maintain sync for future users
- Updates RLS policies to use the synced IDs

### fix_media_upload_rls.sql  
- Fixes `admin_media` table RLS policies
- Fixes Supabase Storage bucket policies
- Updates AdminService to use correct auth user IDs

### fix_blog_posts_rls.sql
- Fixes `blog_posts` table RLS policies
- Fixes `blog_categories` and `blog_authors` RLS policies
- Allows admins full access, public read access to published content

## Common Issues

### Issue: "Admin user not found"
**Solution**: Make sure your admin user exists in both `auth.users` and `admin_users` tables with matching emails.

### Issue: Still getting RLS errors
**Solution**: 
1. Verify the SQL fixes ran successfully
2. Check if `auth.uid()` matches an entry in `admin_users` table
3. Logout and login again to refresh the session

### Issue: Upload works but blog save fails
**Solution**: Make sure you ran `fix_blog_posts_rls.sql` after the admin sync fix.

## Testing Commands

Run these in Supabase SQL Editor to verify the fix:

```sql
-- Check if admin user IDs match auth user IDs
SELECT 
  au.id as auth_id, 
  au.email as auth_email,
  adu.id as admin_id, 
  adu.email as admin_email,
  (au.id = adu.id) as ids_match
FROM auth.users au
LEFT JOIN admin_users adu ON au.email = adu.email
WHERE adu.id IS NOT NULL;

-- Check if current user is recognized as admin
SELECT 
  auth.uid() as current_auth_id,
  (SELECT email FROM auth.users WHERE id = auth.uid()) as current_email,
  (SELECT role FROM admin_users WHERE id = auth.uid()) as admin_role,
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  ) as is_admin;
```

After running these fixes, the CMS should work without RLS policy errors!