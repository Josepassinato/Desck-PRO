export interface Documento {
  id: string;
  empresa_id: string;
  uploaded_by: string | null;
  nome: string;
  tipo: TipoDocumento;
  categoria: string | null;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  competencia: string | null;
  status: DocumentoStatus;
  classificacao_auto: Record<string, unknown> | null;
  ocr_resultado: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type TipoDocumento =
  | "nfe"
  | "nfse"
  | "cte"
  | "extrato_bancario"
  | "folha_pagamento"
  | "balancete"
  | "darf"
  | "das"
  | "contrato"
  | "procuracao"
  | "certificado_digital"
  | "outro";

export type DocumentoStatus =
  | "pending"
  | "processing"
  | "classified"
  | "validated"
  | "error"
  | "sent_to_contaflux";
