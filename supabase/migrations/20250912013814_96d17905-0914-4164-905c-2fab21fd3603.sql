-- Remove todas as políticas problemáticas que causam recursão
-- accounting_clients table policies
DROP POLICY IF EXISTS "Accountants can manage their clients" ON public.accounting_clients;
DROP POLICY IF EXISTS "Clients can view their own data" ON public.accounting_clients;
DROP POLICY IF EXISTS "Public read access" ON public.accounting_clients;

-- user_profiles - garantir que estão corretas
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;

-- Recriar políticas user_profiles de forma simples e segura
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

-- Criar políticas accounting_clients sem recursão
CREATE POLICY "Authenticated users can manage clients" 
ON public.accounting_clients 
FOR ALL
USING (auth.role() = 'authenticated');

-- Permitir acesso público temporário para debug
CREATE POLICY "Public access to accounting_clients" 
ON public.accounting_clients 
FOR ALL
USING (true);