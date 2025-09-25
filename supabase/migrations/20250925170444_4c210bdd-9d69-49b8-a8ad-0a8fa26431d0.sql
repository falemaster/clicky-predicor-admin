-- Add show_data_quality_dashboard column to admin_companies table
ALTER TABLE public.admin_companies 
ADD COLUMN show_data_quality_dashboard BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.admin_companies.show_data_quality_dashboard IS 'Controls whether the data quality dashboard section is visible for this company (default: false)';