/**
 * Motor de Diagnóstico de Migração — Tipos
 */

export interface DadosEmpresaDiagnostico {
  cnpj: string;
  cnae_principal: string | null;
  cnaes_secundarios: string[];
  regime_atual: string;
  faturamento_anual: number | null;

  // Dados para viabilidade econômica
  receita_bruta_12m: number | null;
  custos_dedutiveis_12m: number | null;
  folha_pagamento_12m: number | null;
  creditos_pis_cofins_estimados: number | null;

  // Dados para prontidão operacional
  tem_erp: boolean;
  erp_nome: string | null;
  tem_plano_contas: boolean;
  tem_centro_custos: boolean;
  tem_certificado_digital: boolean;
  certificado_valido: boolean;
  certificado_vencimento: string | null;

  // Dados para qualidade documental
  total_notas_12m: number | null;
  notas_com_xml: number | null;
  notas_sem_xml: number | null;
  meses_sem_movimentacao: number;
  tem_extratos_bancarios: boolean;

  // Dados para custos de pessoal
  total_funcionarios: number;
  custo_folha_mensal: number | null;
  tem_pro_labore: boolean;
  valor_pro_labore: number | null;
  tem_provisoes_trabalhistas: boolean;

  // Dados para readiness
  contador_experiencia_lucro_real: boolean;
  equipe_dedicada: boolean;
  prazo_desejado_migracao: number | null; // meses
  motivacao_migracao: string | null;
}

export interface ResultadoDimensao {
  score: number; // 0-100
  nivel: "critico" | "baixo" | "medio" | "bom" | "excelente";
  itens: ItemAvaliacao[];
  recomendacoes: string[];
}

export interface ItemAvaliacao {
  criterio: string;
  resultado: "aprovado" | "reprovado" | "alerta" | "info";
  detalhe: string;
  peso: number; // 0-1
}

export interface ResultadoDiagnostico {
  elegibilidade_legal: ResultadoDimensao;
  viabilidade_economica: ResultadoDimensao & {
    simulacao: SimulacaoComparativa;
  };
  prontidao_operacional: ResultadoDimensao;
  qualidade_documental: ResultadoDimensao;
  custos_pessoal: ResultadoDimensao;
  readiness: ResultadoDimensao;
  score_geral: number;
  recomendacao: "recomendado" | "viavel_com_ressalvas" | "nao_recomendado" | "inconclusivo";
  resumo: string;
}

export interface SimulacaoComparativa {
  regime_atual: {
    nome: string;
    tributos_estimados: number;
    aliquota_efetiva: number;
  };
  lucro_real: {
    tributos_estimados: number;
    aliquota_efetiva: number;
  };
  economia_estimada: number;
  economia_percentual: number;
  aviso: string;
}

export function getNivel(score: number): ResultadoDimensao["nivel"] {
  if (score >= 80) return "excelente";
  if (score >= 60) return "bom";
  if (score >= 40) return "medio";
  if (score >= 20) return "baixo";
  return "critico";
}
