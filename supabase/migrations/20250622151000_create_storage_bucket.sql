-- Create storage bucket for hack-ai project
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hack-ai-storage',
  'hack-ai-storage',
  true,
  104857600, -- 100MB limit
  ARRAY['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/quicktime', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Allow anonymous users to upload videos to the videos folder
CREATE POLICY "Allow anon users to upload videos"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'hack-ai-storage' 
  AND (storage.foldername(name))[1] = 'videos'
);

-- Allow anonymous users to read videos from the videos folder
CREATE POLICY "Allow anon users to read videos"
ON storage.objects
FOR SELECT
TO anon
USING (
  bucket_id = 'hack-ai-storage' 
  AND (storage.foldername(name))[1] = 'videos'
);

-- Allow anonymous users to update videos (for metadata updates)
CREATE POLICY "Allow anon users to update videos"
ON storage.objects
FOR UPDATE
TO anon
USING (
  bucket_id = 'hack-ai-storage' 
  AND (storage.foldername(name))[1] = 'videos'
);

-- Allow anonymous users to delete videos (optional - remove if not needed)
CREATE POLICY "Allow anon users to delete videos"
ON storage.objects
FOR DELETE
TO anon
USING (
  bucket_id = 'hack-ai-storage' 
  AND (storage.foldername(name))[1] = 'videos'
);

-- Allow anonymous users to upload thumbnails to the thumbnails folder
CREATE POLICY "Allow anon users to upload thumbnails"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'hack-ai-storage' 
  AND (storage.foldername(name))[1] = 'thumbnails'
);

-- Allow anonymous users to read thumbnails from the thumbnails folder
CREATE POLICY "Allow anon users to read thumbnails"
ON storage.objects
FOR SELECT
TO anon
USING (
  bucket_id = 'hack-ai-storage' 
  AND (storage.foldername(name))[1] = 'thumbnails'
);

-- Allow anonymous users to update thumbnails
CREATE POLICY "Allow anon users to update thumbnails"
ON storage.objects
FOR UPDATE
TO anon
USING (
  bucket_id = 'hack-ai-storage' 
  AND (storage.foldername(name))[1] = 'thumbnails'
);

-- Allow anonymous users to delete thumbnails
CREATE POLICY "Allow anon users to delete thumbnails"
ON storage.objects
FOR DELETE
TO anon
USING (
  bucket_id = 'hack-ai-storage' 
  AND (storage.foldername(name))[1] = 'thumbnails'
); 