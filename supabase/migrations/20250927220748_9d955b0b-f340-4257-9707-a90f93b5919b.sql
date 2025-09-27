-- Mise à jour des politiques RLS pour la table admin_companies
-- pour permettre aux utilisateurs authentifiés de faire des insertions et des upserts

-- Supprimer l'ancienne politique d'insertion publique
DROP POLICY IF EXISTS "Allow public to insert admin_companies" ON admin_companies;

-- Créer une nouvelle politique pour permettre aux utilisateurs authentifiés d'insérer
CREATE POLICY "Allow authenticated users to insert admin_companies" 
ON admin_companies 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Créer une politique pour permettre l'upsert (combinaison INSERT/UPDATE)
CREATE POLICY "Allow authenticated users to upsert admin_companies" 
ON admin_companies 
FOR ALL
TO authenticated
USING (true) 
WITH CHECK (true);