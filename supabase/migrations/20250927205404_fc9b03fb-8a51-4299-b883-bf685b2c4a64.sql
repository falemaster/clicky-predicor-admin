-- Add INSERT policy for admin_companies table to allow upsert operations from the WYSIWYG editor
CREATE POLICY "Allow public to insert admin_companies"
ON public.admin_companies
FOR INSERT
TO public
WITH CHECK (true);