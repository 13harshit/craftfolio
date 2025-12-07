-- Enable pgcrypto for password hashing (Supabase usually has this enabled by default)
create extension if not exists pgcrypto;

-- Create a secure function to update user details
create or replace function admin_update_user(
  target_user_id uuid,
  new_email text,
  new_password text,
  new_full_name text,
  new_role text
)
returns void
language plpgsql
security definer -- CRITICAL: Runs with the privileges of the creator (superuser/admin)
as $$
begin
  -- 1. Authorization Check: Ensure the caller is actually an admin
  -- We check the 'profiles' table for the current user's role
  if not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Unauthorized: Only admins can perform this action.';
  end if;

  -- 2. Update Public Profile (Name, Role, Email display)
  update public.profiles
  set 
    full_name = new_full_name,
    role = new_role,
    email = new_email
  where id = target_user_id;

  -- 3. Update Auth User (Email)
  -- Only update if email is provided and different
  if new_email is not null and new_email != '' then
    update auth.users
    set 
      email = new_email,
      email_confirmed_at = now() -- Auto-confirm the new email
    where id = target_user_id;
  end if;

  -- 4. Update Auth User (Password)
  -- Only update if a new password is provided
  if new_password is not null and new_password != '' then
    update auth.users
    set encrypted_password = crypt(new_password, gen_salt('bf'))
    where id = target_user_id;
  end if;

end;
$$;
