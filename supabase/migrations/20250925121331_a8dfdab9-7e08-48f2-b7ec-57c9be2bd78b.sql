-- Add enriched_data column to store complete company data modified by admin
ALTER TABLE public.admin_companies 
ADD COLUMN enriched_data JSONB;

-- Add index for better performance on enriched_data queries
CREATE INDEX idx_admin_companies_enriched_data ON public.admin_companies USING GIN(enriched_data);

-- Add comment to explain the column purpose
COMMENT ON COLUMN public.admin_companies.enriched_data IS 'Complete CompanyFullData structure with admin modifications that override API data';