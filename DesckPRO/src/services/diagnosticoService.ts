import { supabase } from "@/lib/supabase";
import type { Diagnostico } from "@/types/diagnostico";

export const diagnosticoService = {
  async listByEmpresa(empresaId: string): Promise<Diagnostico[]> {
    const { data, error } = await supabase
      .from("diagnosticos")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Diagnostico[];
  },

  async getById(id: string): Promise<Diagnostico> {
    const { data, error } = await supabase
      .from("diagnosticos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Diagnostico;
  },

  async create(empresaId: string, createdBy: string): Promise<Diagnostico> {
    const { data, error } = await supabase
      .from("diagnosticos")
      .insert({
        empresa_id: empresaId,
        created_by: createdBy,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;
    return data as Diagnostico;
  },

  async updateScores(
    id: string,
    scores: Partial<
      Pick<
        Diagnostico,
        | "score_elegibilidade_legal"
        | "score_viabilidade_economica"
        | "score_prontidao_operacional"
        | "score_qualidade_documental"
        | "score_custos_pessoal"
        | "score_readiness"
        | "score_geral"
        | "recomendacao"
      >
    >
  ): Promise<Diagnostico> {
    const { data, error } = await supabase
      .from("diagnosticos")
      .update(scores)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Diagnostico;
  },

  async complete(id: string): Promise<Diagnostico> {
    const { data, error } = await supabase
      .from("diagnosticos")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Diagnostico;
  },
};
