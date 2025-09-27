-- Autoriser aussi les requêtes depuis les clients non authentifiés (role anon)
-- pour permettre l'upsert réalisé par l'éditeur WYSIWYG

-- Politique INSERT pour anon
CREATE POLICY "Allow anon to insert admin_companies"
ON admin_companies
FOR INSERT
TO anon
WITH CHECK (true);

-- Politique UPDATE pour anon (requise pour on_conflict/upsert)
CREATE POLICY "Allow anon to update admin_companies"
ON admin_companies
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);