-- Create Enums
CREATE TYPE user_role AS ENUM ('seeker', 'hirer', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'processing', 'accepted', 'rejected');

-- Create Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role DEFAULT 'seeker',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create Jobs Table
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  hirer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create Applications Table
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status application_status DEFAULT 'pending',
  cover_letter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create Portfolios Table
CREATE TABLE public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  bio TEXT,
  skills TEXT[],
  projects JSONB DEFAULT '[]'::JSONB,
  template_id TEXT DEFAULT 'modern',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Portfolios
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES --

-- Profiles: 
-- Public read access to profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

-- Update own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Jobs:
-- Viewable by everyone
CREATE POLICY "Jobs are viewable by everyone" 
ON public.jobs FOR SELECT USING (true);

-- Only Hirers can insert jobs
CREATE POLICY "Hirers can insert jobs" 
ON public.jobs FOR INSERT 
WITH CHECK (
  auth.uid() = hirer_id AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hirer')
);

-- Only Job Owner can update/delete
CREATE POLICY "Hirers can update own jobs" 
ON public.jobs FOR UPDATE USING (auth.uid() = hirer_id);

CREATE POLICY "Hirers can delete own jobs" 
ON public.jobs FOR DELETE USING (auth.uid() = hirer_id);

-- Applications:
-- Applicant can view their own applications
CREATE POLICY "Applicants can view own applications" 
ON public.applications FOR SELECT USING (auth.uid() = applicant_id);

-- Hirers can view applications for their jobs
CREATE POLICY "Hirers can view applications for their jobs" 
ON public.applications FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE public.jobs.id = public.applications.job_id 
    AND public.jobs.hirer_id = auth.uid()
  )
);

-- Seekers can insert applications
CREATE POLICY "Seekers can insert applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = applicant_id);

-- Hirers can update status of applications for their jobs
CREATE POLICY "Hirers can update application status" 
ON public.applications FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE public.jobs.id = public.applications.job_id 
    AND public.jobs.hirer_id = auth.uid()
  )
);

-- Portfolios:
-- Viewable by everyone
CREATE POLICY "Portfolios are viewable by everyone" 
ON public.portfolios FOR SELECT USING (true);

-- Users can insert/update own portfolio
CREATE POLICY "Users can insert own portfolio" 
ON public.portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio" 
ON public.portfolios FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', (new.raw_user_meta_data->>'role')::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
