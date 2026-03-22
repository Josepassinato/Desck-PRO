export interface Pendencia {
  id: string;
  empresa_id: string;
  accounting_firm_id: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoPendencia;
  prioridade: Prioridade;
  status: PendenciaStatus;
  responsavel_id: string | null;
  data_limite: string | null;
  resolvido_em: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type TipoPendencia =
  | "documento_faltante"
  | "documento_invalido"
  | "informacao_pendente"
  | "assinatura_pendente"
  | "pagamento_pendente"
  | "revisao_necessaria"
  | "outro";

export type Prioridade = "baixa" | "media" | "alta" | "urgente";

export type PendenciaStatus = "aberta" | "em_andamento" | "resolvida" | "cancelada";

export interface CreatePendenciaInput {
  empresa_id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoPendencia;
  prioridade?: Prioridade;
  responsavel_id?: string;
  data_limite?: string;
}

export interface UpdatePendenciaInput {
  titulo?: string;
  descricao?: string;
  tipo?: TipoPendencia;
  prioridade?: Prioridade;
  status?: PendenciaStatus;
  responsavel_id?: string | null;
  data_limite?: string | null;
}

export const TIPO_PENDENCIA_LABELS: Record<TipoPendencia, string> = {
  documento_faltante: "Documento Faltante",
  documento_invalido: "Documento Invalido",
  informacao_pendente: "Informacao Pendente",
  assinatura_pendente: "Assinatura Pendente",
  pagamento_pendente: "Pagamento Pendente",
  revisao_necessaria: "Revisao Necessaria",
  outro: "Outro",
};

export const PRIORIDADE_LABELS: Record<Prioridade, string> = {
  baixa: "Baixa",
  media: "Media",
  alta: "Alta",
  urgente: "Urgente",
};

export const PRIORIDADE_COLORS: Record<Prioridade, string> = {
  baixa: "bg-slate-100 text-slate-700",
  media: "bg-blue-100 text-blue-700",
  alta: "bg-orange-100 text-orange-700",
  urgente: "bg-red-100 text-red-700",
};

export const STATUS_LABELS: Record<PendenciaStatus, string> = {
  aberta: "Aberta",
  em_andamento: "Em Andamento",
  resolvida: "Resolvida",
  cancelada: "Cancelada",
};

export const STATUS_COLORS: Record<PendenciaStatus, string> = {
  aberta: "bg-yellow-100 text-yellow-800",
  em_andamento: "bg-blue-100 text-blue-800",
  resolvida: "bg-green-100 text-green-800",
  cancelada: "bg-gray-100 text-gray-800",
};
