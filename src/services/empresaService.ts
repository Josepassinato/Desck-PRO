import { supabase } from "@/lib/supabase";
import { requireFirmId } from "@/lib/auth-guard";
import type {
  Empresa,
  CreateEmpresaInput,
  UpdateEmpresaInput,
} from "@/types/empresa";

export const empresaService = {
  async list(): Promise<Empresa[]> {
    const firmId = await requireFirmId();

    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("accounting_firm_id", firmId)
      .order("razao_social");

    if (error) throw error;
    return data as Empresa[];
  },

  async getById(id: string): Promise<Empresa> {
    const firmId = await requireFirmId();

    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("id", id)
      .eq("accounting_firm_id", firmId)
      .single();

    if (error) throw error;
    return data as Empresa;
  },

  async create(input: CreateEmpresaInput): Promise<Empresa> {
    const firmId = await requireFirmId();

    const { data, error } = await supabase
      .from("empresas")
      .insert({
        ...input,
        accounting_firm_id: firmId,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Empresa;
  },

  async update(id: string, input: UpdateEmpresaInput): Promise<Empresa> {
    const firmId = await requireFirmId();

    const { data, error } = await supabase
      .from("empresas")
      .update(input)
      .eq("id", id)
      .eq("accounting_firm_id", firmId)
      .select()
      .single();

    if (error) throw error;
    return data as Empresa;
  },

  async remove(id: string): Promise<void> {
    const firmId = await requireFirmId();

    const { error } = await supabase
      .from("empresas")
      .delete()
      .eq("id", id)
      .eq("accounting_firm_id", firmId);
    if (error) throw error;
  },

  async search(query: string): Promise<Empresa[]> {
    const firmId = await requireFirmId();

    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("accounting_firm_id", firmId)
      .or(
        `razao_social.ilike.%${query}%,nome_fantasia.ilike.%${query}%,cnpj.ilike.%${query}%`
      )
      .order("razao_social")
      .limit(20);

    if (error) throw error;
    return data as Empresa[];
  },
};
