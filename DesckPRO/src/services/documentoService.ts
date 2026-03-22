import { supabase } from "@/lib/supabase";
import type { Documento, TipoDocumento } from "@/types/documento";

export const documentoService = {
  async listByEmpresa(empresaId: string): Promise<Documento[]> {
    const { data, error } = await supabase
      .from("documentos")
      .select("*")
      .eq("empresa_id", empresaId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Documento[];
  },

  async upload(
    empresaId: string,
    file: File,
    tipo: TipoDocumento,
    competencia?: string
  ): Promise<Documento> {
    const filePath = `${empresaId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("documentos")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data, error } = await supabase
      .from("documentos")
      .insert({
        empresa_id: empresaId,
        nome: file.name,
        tipo,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        competencia,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Documento;
  },

  async remove(id: string): Promise<void> {
    const { data: doc } = await supabase
      .from("documentos")
      .select("file_path")
      .eq("id", id)
      .single();

    if (doc?.file_path) {
      await supabase.storage.from("documentos").remove([doc.file_path]);
    }

    const { error } = await supabase.from("documentos").delete().eq("id", id);
    if (error) throw error;
  },

  async getDownloadUrl(filePath: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from("documentos")
      .createSignedUrl(filePath, 3600);

    if (error) throw error;
    return data.signedUrl;
  },
};
