-- Add missing 'education' column to portfolios table
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS education JSONB[];

-- Add missing 'updated_at' column to portfolios table
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing 'views' column to portfolios table
ALTER TABLE public.portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Ensure RLS is enabled (just as a safety check, though previously set)
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
