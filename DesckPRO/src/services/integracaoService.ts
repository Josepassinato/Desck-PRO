import { supabase } from "@/lib/supabase";
import { requireFirmId } from "@/lib/auth-guard";
import { encryptCredentials, decryptCredentials } from "@/lib/crypto";
import type {
  IntegracaoERP,
  ERPProvider,
} from "@/types/integracao";

export const integracaoService = {
  async listByEmpresa(empresaId: string): Promise<IntegracaoERP[]> {
    await requireFirmId();

    const { data, error } = await supabase
      .from("integracoes_erp")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("created_at");

    if (error) throw error;
    return data as IntegracaoERP[];
  },

  async create(
    empresaId: string,
    provider: ERPProvider,
    credentials: Record<string, string>,
    config?: Record<string, unknown>
  ): Promise<IntegracaoERP> {
    await requireFirmId();

    // Criptografa credenciais antes de salvar
    const encrypted = await encryptCredentials(credentials);

    const { data, error } = await supabase
      .from("integracoes_erp")
      .insert({
        empresa_id: empresaId,
        provider,
        credentials_encrypted: encrypted,
        config: config ?? {},
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data as IntegracaoERP;
  },

  /**
   * Descriptografa e retorna as credenciais de uma integração.
   * Usar apenas quando necessário (ex: testar conexão).
   */
  async getCredentials(integracaoId: string): Promise<Record<string, string>> {
    await requireFirmId();

    const { data, error } = await supabase
      .from("integracoes_erp")
      .select("credentials_encrypted")
      .eq("id", integracaoId)
      .single();

    if (error) throw error;

    // Se já é um objeto (dados antigos não criptografados), retorna direto
    if (typeof data.credentials_encrypted === "object") {
      return data.credentials_encrypted as Record<string, string>;
    }

    return decryptCredentials(data.credentials_encrypted);
  },

  async updateStatus(
    id: string,
    status: IntegracaoERP["status"],
    error?: string
  ): Promise<IntegracaoERP> {
    await requireFirmId();

    const update: Record<string, unknown> = { status };
    if (status === "active") {
      update.last_sync_at = new Date().toISOString();
      update.last_sync_status = "success";
    }
    if (error) {
      update.last_sync_error = error;
      update.last_sync_status = "error";
    }

    const { data, error: dbError } = await supabase
      .from("integracoes_erp")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (dbError) throw dbError;
    return data as IntegracaoERP;
  },

  async remove(id: string): Promise<void> {
    await requireFirmId();

    const { error } = await supabase
      .from("integracoes_erp")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
