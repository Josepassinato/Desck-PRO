import { supabase } from "@/lib/supabase";
import { requireFirmId } from "@/lib/auth-guard";
import type {
  Pendencia,
  CreatePendenciaInput,
  UpdatePendenciaInput,
} from "@/types/pendencia";

export const pendenciaService = {
  async listByEmpresa(empresaId: string): Promise<Pendencia[]> {
    const firmId = await requireFirmId();

    const { data, error } = await supabase
      .from("pendencias")
      .select("*")
      .eq("empresa_id", empresaId)
      .eq("accounting_firm_id", firmId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Pendencia[];
  },

  async listAll(page = 0, pageSize = 50): Promise<{ data: Pendencia[]; count: number }> {
    const firmId = await requireFirmId();

    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("pendencias")
      .select("*", { count: "exact" })
      .eq("accounting_firm_id", firmId)
      .in("status", ["aberta", "em_andamento"])
      .order("prioridade", { ascending: true })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data as Pendencia[], count: count ?? 0 };
  },

  async create(input: CreatePendenciaInput): Promise<Pendencia> {
    const firmId = await requireFirmId();

    const { data, error } = await supabase
      .from("pendencias")
      .insert({
        ...input,
        accounting_firm_id: firmId,
        status: "aberta",
        prioridade: input.prioridade ?? "media",
      })
      .select()
      .single();

    if (error) throw error;
    return data as Pendencia;
  },

  async update(id: string, input: UpdatePendenciaInput): Promise<Pendencia> {
    const firmId = await requireFirmId();

    const updateData: Record<string, unknown> = { ...input };
    if (input.status === "resolvida") {
      updateData.resolvido_em = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("pendencias")
      .update(updateData)
      .eq("id", id)
      .eq("accounting_firm_id", firmId)
      .select()
      .single();

    if (error) throw error;
    return data as Pendencia;
  },

  async remove(id: string): Promise<void> {
    const firmId = await requireFirmId();

    const { error } = await supabase
      .from("pendencias")
      .delete()
      .eq("id", id)
      .eq("accounting_firm_id", firmId);
    if (error) throw error;
  },

  async countByStatus(): Promise<Record<string, number>> {
    const firmId = await requireFirmId();

    const { data, error } = await supabase
      .from("pendencias")
      .select("status")
      .eq("accounting_firm_id", firmId);

    if (error) throw error;

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.status] = (counts[row.status] ?? 0) + 1;
    }
    return counts;
  },
};
