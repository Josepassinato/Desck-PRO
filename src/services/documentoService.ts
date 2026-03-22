import { supabase } from "@/lib/supabase";
import { requireFirmId } from "@/lib/auth-guard";
import type { Documento, TipoDocumento } from "@/types/documento";

export const documentoService = {
  async listByEmpresa(
    empresaId: string,
    page = 0,
    pageSize = 50
  ): Promise<{ data: Documento[]; count: number }> {
    await requireFirmId();

    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("documentos")
      .select("*", { count: "exact" })
      .eq("empresa_id", empresaId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data as Documento[], count: count ?? 0 };
  },

  async upload(
    empresaId: string,
    file: File,
    tipo: TipoDocumento,
    competencia?: string
  ): Promise<Documento> {
    await requireFirmId();

    // Validação de tamanho (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Arquivo excede o limite de 50MB.");
    }

    // Validação de tipo de arquivo
    const ALLOWED_MIME_TYPES = [
      "application/pdf",
      "application/xml", "text/xml",
      "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv", "text/plain",
      "image/png", "image/jpeg", "image/webp",
      "application/x-ofx", "application/x-qfx",
      "application/x-pkcs12", "application/x-x509-ca-cert",
      "application/zip",
      "application/octet-stream", // fallback para .pfx, .ofx sem MIME correto
    ];
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const ALLOWED_EXTENSIONS = [
      "pdf", "xml", "xlsx", "xls", "csv", "txt",
      "png", "jpg", "jpeg", "webp",
      "ofx", "qfx", "ofc",
      "pfx", "p12", "cer", "crt",
      "zip",
    ];

    if (!ALLOWED_MIME_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(
        `Tipo de arquivo nao permitido: ${file.type || ext}. Use PDF, XML, Excel, OFX, imagens ou certificados.`
      );
    }

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

    // Rollback: se o insert no banco falhar, remove o arquivo do storage
    if (error) {
      await supabase.storage.from("documentos").remove([filePath]);
      throw error;
    }

    return data as Documento;
  },

  async remove(id: string): Promise<void> {
    await requireFirmId();

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
