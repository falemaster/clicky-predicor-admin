-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Update admin_companies policies to check for admin role
DROP POLICY IF EXISTS "Allow authenticated users to insert admin_companies" ON public.admin_companies;
DROP POLICY IF EXISTS "Allow authenticated users to update admin_companies" ON public.admin_companies;
DROP POLICY IF EXISTS "Allow authenticated users to upsert admin_companies" ON public.admin_companies;

CREATE POLICY "Admins can insert admin_companies"
ON public.admin_companies
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update admin_companies"
ON public.admin_companies
FOR UPDATE
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete admin_companies"
ON public.admin_companies
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Update admin_edit_logs policies
DROP POLICY IF EXISTS "Allow authenticated users to insert edit logs" ON public.admin_edit_logs;

CREATE POLICY "Admins can insert edit logs"
ON public.admin_edit_logs
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Update admin_search_history policies
DROP POLICY IF EXISTS "Allow authenticated users to insert admin_search_history" ON public.admin_search_history;

CREATE POLICY "Admins can insert search history"
ON public.admin_search_history
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());