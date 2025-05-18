-- Allow authenticated users to upload to documents bucket
DROP POLICY IF EXISTS "auth uploads documents" ON storage.objects;
CREATE POLICY "auth uploads documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents');

-- Allow authenticated users to upload to tutoring-files bucket
DROP POLICY IF EXISTS "auth uploads tutoring-files" ON storage.objects;
CREATE POLICY "auth uploads tutoring-files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'tutoring-files'); 