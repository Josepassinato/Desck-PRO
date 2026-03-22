import { supabase } from "@/lib/supabase";
import type {
  Pendencia,
  CreatePendenciaInput,
  UpdatePendenciaInput,
} from "@/types/pendencia";

export const pendenciaService = {
  async listByEmpresa(empresaId: string): Promise<Pendencia[]> {
    const { data, error } = await supabase
      .from("pendencias")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Pendencia[];
  },

  async listAll(): Promise<Pendencia[]> {
    const { data, error } = await supabase
      .from("pendencias")
      .select("*")
      .in("status", ["aberta", "em_andamento"])
      .order("prioridade", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Pendencia[];
  },

  async create(input: CreatePendenciaInput): Promise<Pendencia> {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("accounting_firm_id")
      .single();

    if (!profile?.accounting_firm_id) {
      throw new Error("Usuario nao vinculado a um escritorio");
    }

    const { data, error } = await supabase
      .from("pendencias")
      .insert({
        ...input,
        accounting_firm_id: profile.accounting_firm_id,
        status: "aberta",
        prioridade: input.prioridade ?? "media",
      })
      .select()
      .single();

    if (error) throw error;
    return data as Pendencia;
  },

  async update(id: string, input: UpdatePendenciaInput): Promise<Pendencia> {
    const updateData: Record<string, unknown> = { ...input };
    if (input.status === "resolvida") {
      updateData.resolvido_em = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("pendencias")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Pendencia;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("pendencias").delete().eq("id", id);
    if (error) throw error;
  },

  async countByStatus(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("pendencias")
      .select("status");

    if (error) throw error;

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.status] = (counts[row.status] ?? 0) + 1;
    }
    return counts;
  },
};
