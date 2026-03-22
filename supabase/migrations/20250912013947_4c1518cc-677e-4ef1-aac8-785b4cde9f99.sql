-- Remove todas as políticas RLS de user_profiles sem criar novas
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Remove também de accounting_clients por precaução
DROP POLICY IF EXISTS "Authenticated users can manage clients" ON public.accounting_clients;
DROP POLICY IF EXISTS "Public access to accounting_clients" ON public.accounting_clients;

-- Desabilitar RLS temporariamente nestas tabelas para permitir funcionamento
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounting_clients DISABLE ROW LEVEL SECURITY;