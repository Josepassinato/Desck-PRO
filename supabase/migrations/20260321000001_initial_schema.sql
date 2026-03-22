-- DesckPRO - Schema Inicial
-- Produto: SaaS para escritorios contabeis
-- Pilares: Diagnostico de migracao fiscal + Camada operacional -> ContaFlux

-- =============================================================================
-- 1. ESCRITORIOS CONTABEIS (multi-tenant root)
-- =============================================================================

CREATE TABLE accounting_firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  endereco JSONB,
  logo_url TEXT,
  plano VARCHAR(50) NOT NULL DEFAULT 'trial',
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'suspended', 'trial')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 2. PERFIS DE USUARIO (vinculados ao auth.users do Supabase)
-- =============================================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'accountant'
    CHECK (role IN ('admin', 'accountant', 'client')),
  accounting_firm_id UUID REFERENCES accounting_firms(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_firm ON user_profiles(accounting_firm_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- =============================================================================
-- 3. EMPRESAS CLIENTES
-- =============================================================================

CREATE TABLE empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accounting_firm_id UUID NOT NULL REFERENCES accounting_firms(id) ON DELETE CASCADE,
  cnpj VARCHAR(18) NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  inscricao_estadual VARCHAR(30),
  inscricao_municipal VARCHAR(30),
  cnae_principal VARCHAR(10),
  cnaes_secundarios TEXT[],
  regime_atual VARCHAR(30) NOT NULL DEFAULT 'simples_nacional'
    CHECK (regime_atual IN ('simples_nacional', 'presumido', 'real', 'mei', 'outro')),
  faturamento_anual NUMERIC(15,2),
  email VARCHAR(255),
  telefone VARCHAR(20),
  endereco JSONB,
  responsavel_nome VARCHAR(255),
  responsavel_cpf VARCHAR(14),
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'prospecting', 'migrating')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(accounting_firm_id, cnpj)
);

CREATE INDEX idx_empresas_firm ON empresas(accounting_firm_id);
CREATE INDEX idx_empresas_cnpj ON empresas(cnpj);
CREATE INDEX idx_empresas_status ON empresas(status);

-- =============================================================================
-- 4. DIAGNOSTICO DE MIGRACAO (6 dimensoes)
-- =============================================================================

CREATE TABLE diagnosticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),

  -- Scores por dimensao (0-100)
  score_elegibilidade_legal SMALLINT CHECK (score_elegibilidade_legal BETWEEN 0 AND 100),
  score_viabilidade_economica SMALLINT CHECK (score_viabilidade_economica BETWEEN 0 AND 100),
  score_prontidao_operacional SMALLINT CHECK (score_prontidao_operacional BETWEEN 0 AND 100),
  score_qualidade_documental SMALLINT CHECK (score_qualidade_documental BETWEEN 0 AND 100),
  score_custos_pessoal SMALLINT CHECK (score_custos_pessoal BETWEEN 0 AND 100),
  score_readiness SMALLINT CHECK (score_readiness BETWEEN 0 AND 100),

  -- Score consolidado
  score_geral SMALLINT CHECK (score_geral BETWEEN 0 AND 100),
  recomendacao VARCHAR(30)
    CHECK (recomendacao IN ('recomendado', 'viavel_com_ressalvas', 'nao_recomendado', 'inconclusivo')),

  -- Dados detalhados por dimensao
  dados_elegibilidade JSONB DEFAULT '{}',
  dados_viabilidade JSONB DEFAULT '{}',
  dados_operacional JSONB DEFAULT '{}',
  dados_documental JSONB DEFAULT '{}',
  dados_pessoal JSONB DEFAULT '{}',
  dados_readiness JSONB DEFAULT '{}',

  -- Simulacao comparativa (ESTIMATIVA, nao apuracao)
  simulacao_comparativa JSONB DEFAULT '{}',

  -- Plano de implantacao
  plano_implantacao JSONB DEFAULT '{}',

  observacoes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_diagnosticos_empresa ON diagnosticos(empresa_id);
CREATE INDEX idx_diagnosticos_status ON diagnosticos(status);

-- =============================================================================
-- 5. DOCUMENTOS
-- =============================================================================

CREATE TABLE documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES user_profiles(id),
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL
    CHECK (tipo IN ('nfe', 'nfse', 'cte', 'extrato_bancario', 'folha_pagamento',
                    'balancete', 'darf', 'das', 'contrato', 'procuracao', 'certificado_digital', 'outro')),
  categoria VARCHAR(50),
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  competencia DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'classified', 'validated', 'error', 'sent_to_contaflux')),
  classificacao_auto JSONB,
  ocr_resultado JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_documentos_empresa ON documentos(empresa_id);
CREATE INDEX idx_documentos_tipo ON documentos(tipo);
CREATE INDEX idx_documentos_status ON documentos(status);
CREATE INDEX idx_documentos_competencia ON documentos(competencia);

-- =============================================================================
-- 6. INTEGRACOES ERP
-- =============================================================================

CREATE TABLE integracoes_erp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  provider VARCHAR(30) NOT NULL
    CHECK (provider IN ('bling', 'omie', 'contaazul', 'tiny', 'nuvemshop', 'manual')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'error', 'disabled', 'expired')),
  credentials_encrypted JSONB,
  config JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  last_sync_status VARCHAR(20),
  last_sync_error TEXT,
  sync_interval_minutes INT DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, provider)
);

CREATE INDEX idx_integracoes_erp_empresa ON integracoes_erp(empresa_id);

-- =============================================================================
-- 7. MOVIMENTACOES BANCARIAS (pre-ContaFlux)
-- =============================================================================

CREATE TABLE movimentacoes_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  banco_codigo VARCHAR(10),
  banco_nome VARCHAR(100),
  agencia VARCHAR(20),
  conta VARCHAR(30),
  data_movimento DATE NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(15,2) NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('credito', 'debito')),
  categoria VARCHAR(50),
  categoria_auto JSONB,
  documento_vinculado_id UUID REFERENCES documentos(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'categorized', 'reconciled', 'sent_to_contaflux')),
  origem VARCHAR(20) DEFAULT 'import'
    CHECK (origem IN ('import', 'ofx', 'ofc', 'api', 'manual')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mov_bancarias_empresa ON movimentacoes_bancarias(empresa_id);
CREATE INDEX idx_mov_bancarias_data ON movimentacoes_bancarias(data_movimento);
CREATE INDEX idx_mov_bancarias_status ON movimentacoes_bancarias(status);

-- =============================================================================
-- 8. CERTIFICADOS DIGITAIS
-- =============================================================================

CREATE TABLE certificados_digitais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo VARCHAR(5) NOT NULL CHECK (tipo IN ('A1', 'A3')),
  cnpj VARCHAR(18) NOT NULL,
  razao_social VARCHAR(255),
  thumbprint VARCHAR(100),
  data_validade DATE NOT NULL,
  file_path TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_certificados_empresa ON certificados_digitais(empresa_id);

-- =============================================================================
-- 9. CONTAFLUX BRIDGE (envios para a ContaFlux)
-- =============================================================================

CREATE TABLE contaflux_envios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo_pacote VARCHAR(50) NOT NULL
    CHECK (tipo_pacote IN ('notas_fiscais', 'movimentacoes_bancarias', 'folha_pagamento',
                           'documentos', 'diagnostico', 'certificado')),
  competencia DATE,
  payload_hash VARCHAR(64),
  payload_size BIGINT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'sending', 'sent', 'accepted', 'rejected', 'error')),
  contaflux_ref VARCHAR(100),
  retry_count SMALLINT DEFAULT 0,
  last_error TEXT,
  sent_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contaflux_envios_empresa ON contaflux_envios(empresa_id);
CREATE INDEX idx_contaflux_envios_status ON contaflux_envios(status);
CREATE INDEX idx_contaflux_envios_competencia ON contaflux_envios(competencia);

-- =============================================================================
-- 10. PENDENCIAS / WORKFLOW
-- =============================================================================

CREATE TABLE pendencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES user_profiles(id),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(30) NOT NULL
    CHECK (tipo IN ('documento_faltante', 'dado_inconsistente', 'integracao_erro',
                    'certificado_vencendo', 'envio_contaflux', 'outro')),
  prioridade VARCHAR(10) NOT NULL DEFAULT 'media'
    CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')),
  status VARCHAR(20) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'waiting_client', 'resolved', 'cancelled')),
  due_date DATE,
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pendencias_empresa ON pendencias(empresa_id);
CREATE INDEX idx_pendencias_status ON pendencias(status);
CREATE INDEX idx_pendencias_assigned ON pendencias(assigned_to);

-- =============================================================================
-- 11. AUDIT LOG
-- =============================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  table_name VARCHAR(100) NOT NULL,
  operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- =============================================================================
-- 12. TRIGGERS para updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_accounting_firms_updated
  BEFORE UPDATE ON accounting_firms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_user_profiles_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_empresas_updated
  BEFORE UPDATE ON empresas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_diagnosticos_updated
  BEFORE UPDATE ON diagnosticos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_documentos_updated
  BEFORE UPDATE ON documentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_integracoes_erp_updated
  BEFORE UPDATE ON integracoes_erp
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_certificados_updated
  BEFORE UPDATE ON certificados_digitais
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_contaflux_envios_updated
  BEFORE UPDATE ON contaflux_envios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_pendencias_updated
  BEFORE UPDATE ON pendencias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
