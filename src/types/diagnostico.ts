export interface Diagnostico {
  id: string;
  empresa_id: string;
  created_by: string;
  status: DiagnosticoStatus;
  score_elegibilidade_legal: number | null;
  score_viabilidade_economica: number | null;
  score_prontidao_operacional: number | null;
  score_qualidade_documental: number | null;
  score_custos_pessoal: number | null;
  score_readiness: number | null;
  score_geral: number | null;
  recomendacao: Recomendacao | null;
  dados_elegibilidade: Record<string, unknown>;
  dados_viabilidade: Record<string, unknown>;
  dados_operacional: Record<string, unknown>;
  dados_documental: Record<string, unknown>;
  dados_pessoal: Record<string, unknown>;
  dados_readiness: Record<string, unknown>;
  simulacao_comparativa: Record<string, unknown>;
  plano_implantacao: Record<string, unknown>;
  observacoes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type DiagnosticoStatus =
  | "draft"
  | "in_progress"
  | "completed"
  | "archived";

export type Recomendacao =
  | "recomendado"
  | "viavel_com_ressalvas"
  | "nao_recomendado"
  | "inconclusivo";

export interface DiagnosticoDimensao {
  nome: string;
  key: keyof Pick<
    Diagnostico,
    | "score_elegibilidade_legal"
    | "score_viabilidade_economica"
    | "score_prontidao_operacional"
    | "score_qualidade_documental"
    | "score_custos_pessoal"
    | "score_readiness"
  >;
  dadosKey: keyof Pick<
    Diagnostico,
    | "dados_elegibilidade"
    | "dados_viabilidade"
    | "dados_operacional"
    | "dados_documental"
    | "dados_pessoal"
    | "dados_readiness"
  >;
  descricao: string;
}

export const DIMENSOES: DiagnosticoDimensao[] = [
  {
    nome: "Elegibilidade Legal",
    key: "score_elegibilidade_legal",
    dadosKey: "dados_elegibilidade",
    descricao: "CNAE, vedacoes, obrigatoriedade, faturamento",
  },
  {
    nome: "Viabilidade Economica",
    key: "score_viabilidade_economica",
    dadosKey: "dados_viabilidade",
    descricao: "Simulacao comparativa estimativa entre regimes",
  },
  {
    nome: "Prontidao Operacional",
    key: "score_prontidao_operacional",
    dadosKey: "dados_operacional",
    descricao: "ERP, plano de contas, centro de custos, certificado",
  },
  {
    nome: "Qualidade Documental",
    key: "score_qualidade_documental",
    dadosKey: "dados_documental",
    descricao: "Completude de notas, gaps, organizacao",
  },
  {
    nome: "Custos de Pessoal",
    key: "score_custos_pessoal",
    dadosKey: "dados_pessoal",
    descricao: "Folha, encargos, provisoes trabalhistas",
  },
  {
    nome: "Readiness",
    key: "score_readiness",
    dadosKey: "dados_readiness",
    descricao: "Capacidade de sustentar o regime Lucro Real",
  },
];
