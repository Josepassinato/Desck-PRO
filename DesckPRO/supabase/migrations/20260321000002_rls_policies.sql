-- DesckPRO - Row Level Security Policies
-- Multi-tenant: isolamento por accounting_firm_id

-- =============================================================================
-- Enable RLS on all tables
-- =============================================================================

ALTER TABLE accounting_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE integracoes_erp ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificados_digitais ENABLE ROW LEVEL SECURITY;
ALTER TABLE contaflux_envios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Helper: get current user's firm
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_firm_id()
RETURNS UUID AS $$
  SELECT accounting_firm_id
  FROM user_profiles
  WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role
  FROM user_profiles
  WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================================================
-- ACCOUNTING_FIRMS: users can only see their own firm
-- =============================================================================

CREATE POLICY "firms_select" ON accounting_firms
  FOR SELECT USING (id = get_user_firm_id());

CREATE POLICY "firms_update" ON accounting_firms
  FOR UPDATE USING (id = get_user_firm_id() AND get_user_role() = 'admin');

-- =============================================================================
-- USER_PROFILES: users can see profiles in their firm
-- =============================================================================

CREATE POLICY "profiles_select" ON user_profiles
  FOR SELECT USING (accounting_firm_id = get_user_firm_id() OR id = auth.uid());

CREATE POLICY "profiles_insert" ON user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update" ON user_profiles
  FOR UPDATE USING (id = auth.uid() OR get_user_role() = 'admin');

-- =============================================================================
-- EMPRESAS: isolated by firm
-- =============================================================================

CREATE POLICY "empresas_select" ON empresas
  FOR SELECT USING (accounting_firm_id = get_user_firm_id());

CREATE POLICY "empresas_insert" ON empresas
  FOR INSERT WITH CHECK (accounting_firm_id = get_user_firm_id());

CREATE POLICY "empresas_update" ON empresas
  FOR UPDATE USING (accounting_firm_id = get_user_firm_id());

CREATE POLICY "empresas_delete" ON empresas
  FOR DELETE USING (accounting_firm_id = get_user_firm_id() AND get_user_role() = 'admin');

-- =============================================================================
-- DIAGNOSTICOS: via empresa -> firm
-- =============================================================================

CREATE POLICY "diagnosticos_select" ON diagnosticos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = diagnosticos.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

CREATE POLICY "diagnosticos_insert" ON diagnosticos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = diagnosticos.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

CREATE POLICY "diagnosticos_update" ON diagnosticos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = diagnosticos.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

-- =============================================================================
-- DOCUMENTOS: via empresa -> firm
-- =============================================================================

CREATE POLICY "documentos_select" ON documentos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = documentos.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

CREATE POLICY "documentos_insert" ON documentos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = documentos.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

CREATE POLICY "documentos_update" ON documentos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = documentos.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

-- =============================================================================
-- INTEGRACOES_ERP: via empresa -> firm
-- =============================================================================

CREATE POLICY "integracoes_select" ON integracoes_erp
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = integracoes_erp.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

CREATE POLICY "integracoes_manage" ON integracoes_erp
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = integracoes_erp.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

-- =============================================================================
-- MOVIMENTACOES_BANCARIAS: via empresa -> firm
-- =============================================================================

CREATE POLICY "mov_bancarias_select" ON movimentacoes_bancarias
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = movimentacoes_bancarias.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

CREATE POLICY "mov_bancarias_manage" ON movimentacoes_bancarias
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = movimentacoes_bancarias.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

-- =============================================================================
-- CERTIFICADOS_DIGITAIS: via empresa -> firm
-- =============================================================================

CREATE POLICY "certificados_select" ON certificados_digitais
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = certificados_digitais.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

CREATE POLICY "certificados_manage" ON certificados_digitais
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = certificados_digitais.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

-- =============================================================================
-- CONTAFLUX_ENVIOS: via empresa -> firm
-- =============================================================================

CREATE POLICY "contaflux_select" ON contaflux_envios
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = contaflux_envios.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

CREATE POLICY "contaflux_manage" ON contaflux_envios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = contaflux_envios.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

-- =============================================================================
-- PENDENCIAS: via empresa -> firm
-- =============================================================================

CREATE POLICY "pendencias_select" ON pendencias
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = pendencias.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

CREATE POLICY "pendencias_manage" ON pendencias
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM empresas
      WHERE empresas.id = pendencias.empresa_id
      AND empresas.accounting_firm_id = get_user_firm_id()
    )
  );

-- =============================================================================
-- AUDIT_LOGS: admins only
-- =============================================================================

CREATE POLICY "audit_select" ON audit_logs
  FOR SELECT USING (get_user_role() = 'admin');

CREATE POLICY "audit_insert" ON audit_logs
  FOR INSERT WITH CHECK (true);
