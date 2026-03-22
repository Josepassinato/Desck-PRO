-- Fix infinite recursion in user_profiles RLS policies
-- Drop existing problematic policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Recreate safe policies without recursion
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can insert their profile during signup
CREATE POLICY "Users can insert their profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Service role (backend) can manage all profiles
CREATE POLICY "Service role can manage all profiles" 
ON public.user_profiles 
FOR ALL
USING (auth.role() = 'service_role');