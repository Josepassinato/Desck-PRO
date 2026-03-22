import { supabase } from "@/lib/supabase";
import type {
  IntegracaoERP,
  ERPProvider,
} from "@/types/integracao";

export const integracaoService = {
  async listByEmpresa(empresaId: string): Promise<IntegracaoERP[]> {
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
    const { data, error } = await supabase
      .from("integracoes_erp")
      .insert({
        empresa_id: empresaId,
        provider,
        credentials_encrypted: credentials,
        config: config ?? {},
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;
    return data as IntegracaoERP;
  },

  async updateStatus(
    id: string,
    status: IntegracaoERP["status"],
    error?: string
  ): Promise<IntegracaoERP> {
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
    const { error } = await supabase
      .from("integracoes_erp")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
