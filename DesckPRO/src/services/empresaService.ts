import { supabase } from "@/lib/supabase";
import type {
  Empresa,
  CreateEmpresaInput,
  UpdateEmpresaInput,
} from "@/types/empresa";

export const empresaService = {
  async list(): Promise<Empresa[]> {
    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .order("razao_social");

    if (error) throw error;
    return data as Empresa[];
  },

  async getById(id: string): Promise<Empresa> {
    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Empresa;
  },

  async create(input: CreateEmpresaInput): Promise<Empresa> {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("accounting_firm_id")
      .single();

    if (!profile?.accounting_firm_id) {
      throw new Error("Usuario nao vinculado a um escritorio");
    }

    const { data, error } = await supabase
      .from("empresas")
      .insert({
        ...input,
        accounting_firm_id: profile.accounting_firm_id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Empresa;
  },

  async update(id: string, input: UpdateEmpresaInput): Promise<Empresa> {
    const { data, error } = await supabase
      .from("empresas")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Empresa;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("empresas").delete().eq("id", id);
    if (error) throw error;
  },

  async search(query: string): Promise<Empresa[]> {
    const { data, error } = await supabase
      .from("empresas")
      .select("*")
      .or(
        `razao_social.ilike.%${query}%,nome_fantasia.ilike.%${query}%,cnpj.ilike.%${query}%`
      )
      .order("razao_social")
      .limit(20);

    if (error) throw error;
    return data as Empresa[];
  },
};
