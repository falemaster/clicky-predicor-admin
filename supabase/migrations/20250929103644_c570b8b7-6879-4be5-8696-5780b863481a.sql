-- Create table for detailed edit tracking
CREATE TABLE IF NOT EXISTS public.admin_edit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.admin_companies(id),
  siren TEXT NOT NULL,
  editor_id UUID,
  field_changed TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  change_type TEXT NOT NULL DEFAULT 'update', -- 'update', 'create', 'delete'
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_edit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read edit logs" 
ON public.admin_edit_logs 
FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to insert edit logs" 
ON public.admin_edit_logs 
FOR INSERT 
WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_admin_edit_logs_siren ON public.admin_edit_logs(siren);
CREATE INDEX IF NOT EXISTS idx_admin_edit_logs_created_at ON public.admin_edit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_edit_logs_field ON public.admin_edit_logs(field_changed);

-- Create function to log edits
CREATE OR REPLACE FUNCTION public.log_admin_edit(
  p_siren TEXT,
  p_field_changed TEXT,
  p_old_value JSONB DEFAULT NULL,
  p_new_value JSONB DEFAULT NULL,
  p_change_type TEXT DEFAULT 'update',
  p_editor_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
  company_id_ref UUID;
BEGIN
  -- Get company_id from siren
  SELECT id INTO company_id_ref
  FROM public.admin_companies
  WHERE siren = p_siren
  LIMIT 1;

  INSERT INTO public.admin_edit_logs (
    company_id,
    siren,
    editor_id,
    field_changed,
    old_value,
    new_value,
    change_type,
    session_id,
    ip_address,
    user_agent
  ) VALUES (
    company_id_ref,
    p_siren,
    p_editor_id,
    p_field_changed,
    p_old_value,
    p_new_value,
    p_change_type,
    p_session_id,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;