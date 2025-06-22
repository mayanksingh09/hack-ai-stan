-- Create transcripts table
CREATE TABLE IF NOT EXISTS public.transcripts (
    id BIGSERIAL PRIMARY KEY,
    video_url TEXT NOT NULL,
    transcript TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index on video_url for faster lookups
CREATE INDEX IF NOT EXISTS idx_transcripts_video_url ON public.transcripts(video_url);

-- Enable Row Level Security (RLS)
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow all authenticated users to read transcripts
CREATE POLICY "Allow authenticated users to read transcripts" ON public.transcripts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all authenticated users to insert transcripts
CREATE POLICY "Allow authenticated users to insert transcripts" ON public.transcripts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow all authenticated users to update their own transcripts
CREATE POLICY "Allow authenticated users to update transcripts" ON public.transcripts
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow all authenticated users to delete transcripts
CREATE POLICY "Allow authenticated users to delete transcripts" ON public.transcripts
    FOR DELETE USING (auth.role() = 'authenticated');
