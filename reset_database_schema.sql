-- WARNING: This script will DROP your existing tables and recreate them.
-- Use this if you are stuck with "Database error saving new user" or "column does not exist" errors.

BEGIN;

-- 1. Clean up existing objects (Order matters significantly!)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP POLICY IF EXISTS "Seekers can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Hirers can view applications for their jobs" ON public.applications;
DROP POLICY IF EXISTS "Seekers can insert applications" ON public.applications;

DROP POLICY IF EXISTS "Jobs viewable by everyone" ON public.jobs;
DROP POLICY IF EXISTS "Hirers can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Hirers can update own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Hirers can delete own jobs" ON public.jobs;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.portfolios CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;


-- 2. Create Tables

-- PROFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'seeker',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- JOBS
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hirer_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT,
  type TEXT,
  salary TEXT,
  description TEXT,
  requirements TEXT,
  company_logo TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- APPLICATIONS
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs NOT NULL,
  seeker_id UUID REFERENCES auth.users NOT NULL,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, accepted, rejected
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- PORTFOLIOS
CREATE TABLE public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  title TEXT,
  bio TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  linkedin TEXT,
  github TEXT,
  skills TEXT[],
  projects JSONB[], -- Array of objects: { title, description, link... }
  experience JSONB[], -- Array of objects: { company, position, duration... }
  template TEXT DEFAULT 'modern',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;


-- 3. Create RLS Policies

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- JOBS
CREATE POLICY "Jobs viewable by everyone" ON public.jobs FOR SELECT USING (TRUE);
CREATE POLICY "Hirers can insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = hirer_id);
CREATE POLICY "Hirers can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = hirer_id);
CREATE POLICY "Hirers can delete own jobs" ON public.jobs FOR DELETE USING (auth.uid() = hirer_id);

-- APPLICATIONS
CREATE POLICY "Seekers can view own applications" ON public.applications FOR SELECT USING (auth.uid() = seeker_id);
CREATE POLICY "Hirers can view applications for their jobs" ON public.applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE id = public.applications.job_id AND hirer_id = auth.uid())
);
CREATE POLICY "Seekers can insert applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = seeker_id);

-- PORTFOLIOS
CREATE POLICY "Portfolios are viewable by everyone" ON public.portfolios FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert/update own portfolio" ON public.portfolios FOR ALL USING (auth.uid() = user_id);


-- 4. Create Trigger for New Users
-- This function runs automatically when a new user signs up in Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'seeker'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

COMMIT;
