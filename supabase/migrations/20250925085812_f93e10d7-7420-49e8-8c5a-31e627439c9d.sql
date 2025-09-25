-- Create admin users table to track user registrations and activity
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_login TIMESTAMP WITH TIME ZONE,
    total_searches INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    subscription_status TEXT DEFAULT 'free'
);

-- Create companies table to track all searched companies
CREATE TABLE public.admin_companies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    siren TEXT NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    siret TEXT,
    naf_code TEXT,
    activity TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    search_count INTEGER DEFAULT 1,
    last_searched TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_manually_edited BOOLEAN DEFAULT false,
    edited_by UUID REFERENCES auth.users(id),
    edited_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active'
);

-- Create search history table to track all searches
CREATE TABLE public.admin_search_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES public.admin_companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    search_type TEXT NOT NULL, -- 'siren', 'siret', 'company_name'
    search_query TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    results_found BOOLEAN DEFAULT true,
    session_id TEXT
);

-- Create analytics table for tracking usage
CREATE TABLE public.admin_analytics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    total_searches INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    registered_users INTEGER DEFAULT 0,
    anonymous_searches INTEGER DEFAULT 0,
    api_calls INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(date)
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, only allow authenticated access)
CREATE POLICY "Allow authenticated users to read admin_users" 
ON public.admin_users FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to read admin_companies" 
ON public.admin_companies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to update admin_companies" 
ON public.admin_companies FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to read admin_search_history" 
ON public.admin_search_history FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to read admin_analytics" 
ON public.admin_analytics FOR SELECT 
TO authenticated 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_admin_companies_siren ON public.admin_companies(siren);
CREATE INDEX idx_admin_companies_search_count ON public.admin_companies(search_count DESC);
CREATE INDEX idx_admin_companies_last_searched ON public.admin_companies(last_searched DESC);
CREATE INDEX idx_admin_search_history_company_id ON public.admin_search_history(company_id);
CREATE INDEX idx_admin_search_history_user_id ON public.admin_search_history(user_id);
CREATE INDEX idx_admin_search_history_created_at ON public.admin_search_history(created_at DESC);
CREATE INDEX idx_admin_analytics_date ON public.admin_analytics(date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_admin_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_companies_updated_at
    BEFORE UPDATE ON public.admin_companies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_admin_companies_updated_at();