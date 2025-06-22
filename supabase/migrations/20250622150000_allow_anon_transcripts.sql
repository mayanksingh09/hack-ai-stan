-- Allow anonymous users to read transcripts
CREATE POLICY "Allow anonymous users to read transcripts" ON public.transcripts
    FOR SELECT USING (true);

-- Allow anonymous users to insert transcripts  
CREATE POLICY "Allow anonymous users to insert transcripts" ON public.transcripts
    FOR INSERT WITH CHECK (true);

-- Allow anonymous users to update transcripts
CREATE POLICY "Allow anonymous users to update transcripts" ON public.transcripts
    FOR UPDATE USING (true);

-- Allow anonymous users to delete transcripts
CREATE POLICY "Allow anonymous users to delete transcripts" ON public.transcripts
    FOR DELETE USING (true); 