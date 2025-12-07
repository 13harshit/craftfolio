-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'seeker',
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles add column if not exists role text default 'seeker';
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles enable row level security;

-- 2. JOBS
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  hirer_id uuid references auth.users not null,
  title text not null,
  company_name text not null,
  location text,
  type text,
  salary text,
  description text,
  requirements text,
  company_logo text,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table public.jobs add column if not exists hirer_id uuid references auth.users;
alter table public.jobs enable row level security;

-- 3. APPLICATIONS
-- The error "column seeker_id does not exist" happened here because table existed without this column
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs not null,
  seeker_id uuid references auth.users not null,
  cover_letter text,
  status text default 'pending',
  created_at timestamptz default now()
);
alter table public.applications add column if not exists seeker_id uuid references auth.users;
alter table public.applications add column if not exists job_id uuid references public.jobs;
alter table public.applications add column if not exists status text default 'pending';
alter table public.applications enable row level security;

-- 4. PORTFOLIOS
create table if not exists public.portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  title text,
  bio text,
  location text,
  email text,
  phone text,
  website text,
  linkedin text,
  github text,
  skills text[],
  projects jsonb[],
  experience jsonb[],
  template text default 'modern',
  created_at timestamptz default now()
);
alter table public.portfolios add column if not exists user_id uuid references auth.users unique;
alter table public.portfolios add column if not exists template text default 'modern';
alter table public.portfolios enable row level security;


-- 5. POLICIES (Drop existing to avoid conflicts, then recreate)

-- PROFILES Policies
drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- JOBS Policies
drop policy if exists "Jobs viewable by everyone" on jobs;
create policy "Jobs viewable by everyone" on jobs for select using (true);

drop policy if exists "Hirers can insert jobs" on jobs;
create policy "Hirers can insert jobs" on jobs for insert with check (auth.uid() = hirer_id);

drop policy if exists "Hirers can update own jobs" on jobs;
create policy "Hirers can update own jobs" on jobs for update using (auth.uid() = hirer_id);

drop policy if exists "Hirers can delete own jobs" on jobs;
create policy "Hirers can delete own jobs" on jobs for delete using (auth.uid() = hirer_id);

-- APPLICATIONS Policies
drop policy if exists "Seekers can view own applications" on applications;
create policy "Seekers can view own applications" on applications for select using (auth.uid() = seeker_id);

drop policy if exists "Hirers can view applications for their jobs" on applications;
create policy "Hirers can view applications for their jobs" on applications for select using (
  exists (select 1 from public.jobs where id = applications.job_id and hirer_id = auth.uid())
);

drop policy if exists "Seekers can insert applications" on applications;
create policy "Seekers can insert applications" on applications for insert with check (auth.uid() = seeker_id);

-- PORTFOLIOS Policies
drop policy if exists "Portfolios are viewable by everyone" on portfolios;
create policy "Portfolios are viewable by everyone" on portfolios for select using (true);

drop policy if exists "Users can insert/update own portfolio" on portfolios;
create policy "Users can insert/update own portfolio" on portfolios for all using (auth.uid() = user_id);


-- 6. TRIGGERS
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'seeker'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
