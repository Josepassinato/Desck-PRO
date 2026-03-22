-- DesckPRO - Audit Logging Trigger
-- Registra automaticamente INSERT/UPDATE/DELETE nas tabelas críticas

CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
DECLARE
  _user_id UUID;
  _old JSONB;
  _new JSONB;
BEGIN
  -- Tenta obter o user_id da sessão do Supabase
  _user_id := NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'sub', '')::UUID;

  IF TG_OP = 'DELETE' THEN
    _old := to_jsonb(OLD);
    _new := NULL;
  ELSIF TG_OP = 'INSERT' THEN
    _old := NULL;
    _new := to_jsonb(NEW);
  ELSE -- UPDATE
    _old := to_jsonb(OLD);
    _new := to_jsonb(NEW);
  END IF;

  INSERT INTO audit_logs (user_id, table_name, operation, record_id, old_values, new_values)
  VALUES (
    _user_id,
    TG_TABLE_NAME,
    TG_OP,
    CASE
      WHEN TG_OP = 'DELETE' THEN (OLD.id)::UUID
      ELSE (NEW.id)::UUID
    END,
    _old,
    _new
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tabelas auditadas: as que contêm dados sensíveis ou ações administrativas

CREATE TRIGGER audit_empresas
  AFTER INSERT OR UPDATE OR DELETE ON empresas
  FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_user_profiles
  AFTER INSERT OR UPDATE OR DELETE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_integracoes_erp
  AFTER INSERT OR UPDATE OR DELETE ON integracoes_erp
  FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_diagnosticos
  AFTER INSERT OR UPDATE OR DELETE ON diagnosticos
  FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_pendencias
  AFTER INSERT OR UPDATE OR DELETE ON pendencias
  FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_contaflux_envios
  AFTER INSERT OR UPDATE OR DELETE ON contaflux_envios
  FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

-- Índice para limpeza periódica (manter últimos 90 dias)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
