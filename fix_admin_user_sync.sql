-- Fix Admin User ID Sync Issues
-- This ensures admin_users.id matches auth.users.id
-- Run this in your Supabase SQL Editor

-- 1. First, let's see the current state (uncomment to check)
SELECT 
  au.id as auth_id, 
  au.email as auth_email,
  adu.id as admin_id, 
  adu.email as admin_email,
  adu.role
FROM auth.users au
LEFT JOIN admin_users adu ON au.email = adu.email;

-- 2. Update admin_users table to use auth.users.id
-- IMPORTANT: This will update existing admin user IDs to match auth user IDs

DO $$
DECLARE
    auth_record RECORD;
    admin_record RECORD;
BEGIN
    -- Loop through all auth users that have corresponding admin users
    FOR auth_record IN 
        SELECT au.id as auth_id, au.email as auth_email
        FROM auth.users au
        WHERE EXISTS (
            SELECT 1 FROM admin_users adu 
            WHERE adu.email = au.email
        )
    LOOP
        -- Get the admin user record
        SELECT * INTO admin_record 
        FROM admin_users 
        WHERE email = auth_record.auth_email;
        
        -- Only update if IDs don't match
        IF admin_record.id != auth_record.auth_id THEN
            -- Update the admin user ID to match auth user ID
            UPDATE admin_users 
            SET id = auth_record.auth_id 
            WHERE email = auth_record.auth_email;
            
            RAISE NOTICE 'Updated admin user % from ID % to %', 
                auth_record.auth_email, admin_record.id, auth_record.auth_id;
        END IF;
    END LOOP;
END $$;

-- 3. Create a trigger to keep admin_users.id in sync with auth.users.id
-- This ensures future admin users have matching IDs

CREATE OR REPLACE FUNCTION sync_admin_user_id()
RETURNS TRIGGER AS $$
BEGIN
    -- If admin user is being inserted, ensure ID matches auth user
    IF TG_OP = 'INSERT' THEN
        -- Get the auth user ID for this email
        SELECT id INTO NEW.id 
        FROM auth.users 
        WHERE email = NEW.email;
        
        -- If no auth user found, keep the provided ID
        IF NEW.id IS NULL THEN
            NEW.id = COALESCE(NEW.id, gen_random_uuid());
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS sync_admin_user_id_trigger ON admin_users;
CREATE TRIGGER sync_admin_user_id_trigger
    BEFORE INSERT ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION sync_admin_user_id();

-- 4. Create function to create admin user with matching auth ID
CREATE OR REPLACE FUNCTION create_admin_user_with_auth(
    p_email TEXT,
    p_name TEXT,
    p_role TEXT DEFAULT 'editor'
)
RETURNS UUID AS $$
DECLARE
    auth_user_id UUID;
    admin_user_id UUID;
BEGIN
    -- Get the auth user ID
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = p_email;
    
    IF auth_user_id IS NULL THEN
        RAISE EXCEPTION 'No auth user found for email: %', p_email;
    END IF;
    
    -- Insert admin user with matching ID
    INSERT INTO admin_users (id, email, name, role, is_active)
    VALUES (auth_user_id, p_email, p_name, p_role, true)
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active
    RETURNING id INTO admin_user_id;
    
    RETURN admin_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update RLS policies to be more permissive for testing
-- (You can make these stricter later)

-- Allow admin users to do everything on blog_posts
DROP POLICY IF EXISTS "Admin full access to blog_posts" ON blog_posts;
CREATE POLICY "Admin full access to blog_posts" ON blog_posts
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() 
        AND is_active = true
    )
);

-- Allow admin users to do everything on blog_categories
DROP POLICY IF EXISTS "Admin full access to blog_categories" ON blog_categories;
CREATE POLICY "Admin full access to blog_categories" ON blog_categories
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() 
        AND is_active = true
    )
);

-- Allow admin users to do everything on blog_authors
DROP POLICY IF EXISTS "Admin full access to blog_authors" ON blog_authors;
CREATE POLICY "Admin full access to blog_authors" ON blog_authors
FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() 
        AND is_active = true
    )
);

-- 6. Verify the sync worked (uncomment to check)
SELECT 
  'After sync:' as status,
  au.id as auth_id, 
  au.email as auth_email,
  adu.id as admin_id, 
  adu.email as admin_email,
  adu.role,
  (au.id = adu.id) as ids_match
FROM auth.users au
LEFT JOIN admin_users adu ON au.email = adu.email
WHERE adu.id IS NOT NULL;