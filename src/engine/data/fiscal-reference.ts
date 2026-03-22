/**
 * Dados de referência fiscal para o motor de diagnóstico.
 * Fonte: legislação federal vigente (LC 123/2006, Lei 9.718/98, Lei 9.430/96).
 * NOTA: Estes dados são para ESTIMATIVA no diagnóstico, não para apuração real.
 */

/** CNAEs vedados ao Simples Nacional (amostra — lista completa deve vir de API) */
export const CNAES_VEDADOS_SIMPLES: string[] = [
  "6462-0/00", // Holdings
  "6463-8/00", // Holdings não-financeiras
  "6611-8/01", // Bolsa de valores
  "6612-6/01", // Corretoras de câmbio
  "6613-4/00", // Administração de consórcios
  "6622-3/00", // Corretoras e distribuidoras de títulos
  "6630-4/00", // Atividades de administração de fundos
];

/** CNAEs obrigatoriamente Lucro Real */
export const CNAES_OBRIGATORIO_LUCRO_REAL: string[] = [
  "6410-7/00", // Banco Central
  "6421-2/00", // Bancos comerciais
  "6422-1/00", // Bancos múltiplos com carteira comercial
  "6423-9/00", // Caixas econômicas
  "6424-7/01", // Bancos cooperativos
  "6431-0/00", // Bancos múltiplos sem carteira comercial
  "6432-8/00", // Bancos de investimento
  "6433-6/00", // Bancos de desenvolvimento
  "6434-4/00", // Agências de fomento
  "6435-2/01", // Sociedades de crédito imobiliário
  "6436-1/00", // Sociedades de crédito, financiamento e investimento
  "6450-6/00", // Sociedades de capitalização
  "6511-1/01", // Seguros de vida
  "6512-0/00", // Seguros não-vida
  "6520-1/00", // Seguros saúde
  "6530-8/00", // Resseguros
  "6541-3/00", // Previdência complementar fechada
  "6542-1/00", // Previdência complementar aberta
];

/** Limite de faturamento anual para Simples Nacional (2024) */
export const LIMITE_SIMPLES_NACIONAL = 4_800_000;

/** Limite para obrigatoriedade de Lucro Real */
export const LIMITE_OBRIGATORIO_LUCRO_REAL = 78_000_000;

/** Alíquotas estimadas do Simples Nacional por faixa (Anexo I - Comércio) */
export const FAIXAS_SIMPLES_NACIONAL = [
  { ate: 180_000, aliquota: 0.04, deducao: 0 },
  { ate: 360_000, aliquota: 0.073, deducao: 5940 },
  { ate: 720_000, aliquota: 0.095, deducao: 13860 },
  { ate: 1_800_000, aliquota: 0.107, deducao: 22500 },
  { ate: 3_600_000, aliquota: 0.143, deducao: 87300 },
  { ate: 4_800_000, aliquota: 0.19, deducao: 378000 },
];

/** Alíquotas Lucro Presumido — percentual de presunção */
export const PRESUNCAO_LUCRO_PRESUMIDO = {
  comercio: 0.08,
  industria: 0.08,
  servicos_geral: 0.32,
  transporte_passageiros: 0.16,
  transporte_cargas: 0.08,
  servicos_hospitalares: 0.08,
  revenda_combustiveis: 0.016,
};

/** Alíquotas federais sobre o lucro (Lucro Real e Presumido) */
export const ALIQUOTAS_FEDERAIS = {
  irpj: 0.15,
  irpj_adicional: 0.10, // sobre excedente de R$ 20k/mês
  irpj_adicional_limite_mensal: 20_000,
  csll: 0.09,
  pis_cumulativo: 0.0065, // Presumido
  cofins_cumulativo: 0.03, // Presumido
  pis_nao_cumulativo: 0.0165, // Lucro Real
  cofins_nao_cumulativo: 0.076, // Lucro Real
};
