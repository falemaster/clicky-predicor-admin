-- Add INSERT policy for admin_search_history to allow logging searches
CREATE POLICY "Allow authenticated users to insert admin_search_history" 
ON admin_search_history 
FOR INSERT 
WITH CHECK (true);

-- Also add a function to help with search logging
CREATE OR REPLACE FUNCTION log_search_activity(
  p_search_type TEXT,
  p_search_query TEXT,
  p_results_found BOOLEAN DEFAULT true,
  p_company_id UUID DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  search_id UUID;
BEGIN
  INSERT INTO admin_search_history (
    search_type,
    search_query,
    results_found,
    company_id,
    user_agent,
    ip_address,
    session_id
  ) VALUES (
    p_search_type,
    p_search_query,
    p_results_found,
    p_company_id,
    p_user_agent,
    p_ip_address,
    gen_random_uuid()::TEXT
  ) RETURNING id INTO search_id;
  
  RETURN search_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;