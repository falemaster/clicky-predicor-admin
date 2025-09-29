-- Create Infogreffe cache table
CREATE TABLE public.infogreffe_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  siren TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  millesime INTEGER NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 1,
  UNIQUE(siren, endpoint, millesime)
);

-- Create index for efficient lookups
CREATE INDEX idx_infogreffe_cache_lookup ON public.infogreffe_cache(siren, endpoint, millesime);
CREATE INDEX idx_infogreffe_cache_expiry ON public.infogreffe_cache(expires_at);

-- Create cost tracking table
CREATE TABLE public.infogreffe_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  siren TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 1,
  cost_euros DECIMAL(10,4) NOT NULL DEFAULT 0,
  user_agent TEXT NULL,
  ip_address INET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for cost tracking
CREATE INDEX idx_infogreffe_costs_session ON public.infogreffe_costs(session_id);
CREATE INDEX idx_infogreffe_costs_date ON public.infogreffe_costs(created_at);

-- Enable Row Level Security
ALTER TABLE public.infogreffe_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infogreffe_costs ENABLE ROW LEVEL SECURITY;

-- Cache policies (read-only for authenticated users, no inserts for security)
CREATE POLICY "Allow authenticated users to read cache" 
ON public.infogreffe_cache 
FOR SELECT 
USING (true);

-- Cost tracking policies (insert and read for authenticated users)
CREATE POLICY "Allow authenticated users to read costs" 
ON public.infogreffe_costs 
FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to insert costs" 
ON public.infogreffe_costs 
FOR INSERT 
WITH CHECK (true);

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION public.clean_expired_infogreffe_cache()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.infogreffe_cache 
  WHERE expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Function to get cache entry
CREATE OR REPLACE FUNCTION public.get_infogreffe_cache(
  p_siren TEXT,
  p_endpoint TEXT,
  p_millesime INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cached_data JSONB;
BEGIN
  SELECT data INTO cached_data
  FROM public.infogreffe_cache
  WHERE siren = p_siren 
    AND endpoint = p_endpoint 
    AND (millesime = p_millesime OR (millesime IS NULL AND p_millesime IS NULL))
    AND expires_at > now();
    
  RETURN cached_data;
END;
$$;

-- Function to set cache entry
CREATE OR REPLACE FUNCTION public.set_infogreffe_cache(
  p_siren TEXT,
  p_endpoint TEXT,
  p_data JSONB,
  p_millesime INTEGER DEFAULT NULL,
  p_ttl_hours INTEGER DEFAULT 24,
  p_credits_used INTEGER DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.infogreffe_cache (
    siren, endpoint, millesime, data, expires_at, credits_used
  ) VALUES (
    p_siren, p_endpoint, p_millesime, p_data,
    now() + (p_ttl_hours || ' hours')::interval,
    p_credits_used
  )
  ON CONFLICT (siren, endpoint, millesime) 
  DO UPDATE SET 
    data = EXCLUDED.data,
    expires_at = EXCLUDED.expires_at,
    credits_used = EXCLUDED.credits_used,
    created_at = now();
END;
$$;