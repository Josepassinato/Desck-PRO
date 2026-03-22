-- Fix infinite recursion in user_profiles RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their profile" ON public.user_profiles;

-- Create or update security definer function without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Create a separate function to check if user is admin without recursion
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
    LIMIT 1
  );
$$;

-- Create new non-recursive policies
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create admin policy using separate check to avoid recursion
CREATE POLICY "Service role can manage all profiles" 
ON public.user_profiles 
FOR ALL
USING (auth.role() = 'service_role');

-- Log the security fix
INSERT INTO public.audit_logs (
  table_name,
  operation,
  new_values,
  metadata,
  severity,
  source
) VALUES (
  'user_profiles_rls_fix',
  'SECURITY_FIX',
  jsonb_build_object(
    'issue', 'infinite_recursion_in_rls_policies',
    'solution', 'removed_recursive_admin_policy_and_created_safe_functions'
  ),
  jsonb_build_object(
    'timestamp', now(),
    'affected_table', 'user_profiles',
    'security_level', 'critical'
  ),
  'critical',
  'security_fix'
);