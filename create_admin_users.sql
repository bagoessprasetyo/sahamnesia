-- Script to create admin users programmatically
-- Run this in Supabase SQL Editor AFTER setting up the admin schema

-- This function creates both auth and admin users
CREATE OR REPLACE FUNCTION create_admin_user(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT,
  user_role TEXT DEFAULT 'admin'
)
RETURNS UUID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Create auth user (this requires admin privileges)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO user_id;

  -- Create admin user record
  INSERT INTO admin_users (
    id,
    email,
    name,
    role,
    is_active
  ) VALUES (
    user_id,
    user_email,
    user_name,
    user_role,
    true
  );

  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin users
SELECT create_admin_user(
  'admin@sahamnesia.com',
  'Admin123!',
  'Super Admin',
  'super_admin'
);

SELECT create_admin_user(
  'editor@sahamnesia.com',
  'Editor123!',
  'Editor User',
  'editor'
);

-- Clean up the function
DROP FUNCTION create_admin_user;