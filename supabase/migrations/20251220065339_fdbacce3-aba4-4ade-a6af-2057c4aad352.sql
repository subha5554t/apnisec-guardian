-- Create storage bucket for issue attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('issue-attachments', 'issue-attachments', false);

-- Create RLS policies for the bucket
CREATE POLICY "Users can upload their own issue attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own issue attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own issue attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'issue-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add attachments column to issues table
ALTER TABLE public.issues 
ADD COLUMN attachments text[] DEFAULT '{}';