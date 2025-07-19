-- Ensure Admin User Record Exists
-- Run this after creating the auth user in Supabase Dashboard

-- First, let's see what auth users exist
-- You can check in the Supabase Dashboard or run this query:
-- SELECT id, email FROM auth.users WHERE email = 'admin@sahamnesia.com';

-- Replace 'YOUR_AUTH_USER_ID_HERE' with the actual UUID from Supabase Auth
-- You can get this from: Supabase Dashboard → Authentication → Users → Copy the ID

-- Method 1: If you know the auth user ID, insert/update directly
DO $$
DECLARE
    auth_user_id UUID;
    auth_user_email TEXT := 'admin@sahamnesia.com';
BEGIN
    -- Get the auth user ID
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = auth_user_email 
    LIMIT 1;
    
    IF auth_user_id IS NOT NULL THEN
        -- Insert or update admin user record
        INSERT INTO admin_users (id, email, name, role, is_active)
        VALUES (
            auth_user_id,
            auth_user_email,
            'Super Admin',
            'super_admin',
            true
        )
        ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            is_active = EXCLUDED.is_active,
            updated_at = NOW();
        
        RAISE NOTICE 'Admin user record created/updated for: %', auth_user_email;
    ELSE
        RAISE NOTICE 'Auth user not found for email: %. Please create the auth user first in Supabase Dashboard.', auth_user_email;
    END IF;
END $$;

-- Method 2: Manual insert if you have the UUID
-- Uncomment and replace with your actual auth user UUID:
/*
INSERT INTO admin_users (id, email, name, role, is_active)
VALUES (
    'YOUR_AUTH_USER_UUID_HERE'::UUID,
    'admin@sahamnesia.com',
    'Super Admin',
    'super_admin',
    true
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
*/

-- Verify the admin user was created
SELECT 
    id,
    email,
    name,
    role,
    is_active,
    created_at
FROM admin_users 
WHERE email = 'admin@sahamnesia.com';