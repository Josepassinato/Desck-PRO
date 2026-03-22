/**
 * Ponte ContaFlux — Contrato de dados e preparação de pacotes.
 *
 * O DesckPRO captura dados operacionais e os prepara para envio
 * à ContaFlux em formato estruturado. Este módulo define:
 * 1. O contrato de dados (schemas dos pacotes)
 * 2. A normalização dos dados
 * 3. O envio e monitoramento
 */

// ============================================================================
// CONTRATO DE DADOS — Tipos de pacote que o DesckPRO envia à ContaFlux
// ============================================================================

export type TipoPacote =
  | "notas_fiscais"
  | "movimentacoes_bancarias"
  | "folha_pagamento"
  | "documentos"
  | "diagnostico"
  | "certificado";

export interface PacoteContaFlux<T = unknown> {
  id: string;
  empresa_cnpj: string;
  escritorio_cnpj: string;
  tipo: TipoPacote;
  competencia: string; // YYYY-MM
  versao_contrato: string;
  criado_em: string; // ISO 8601
  hash: string;
  total_itens: number;
  dados: T;
}

// ============================================================================
// SCHEMAS POR TIPO DE PACOTE
// ============================================================================

export interface PacoteNotasFiscais {
  notas: NotaFiscalContaFlux[];
}

export interface NotaFiscalContaFlux {
  chave_acesso: string;
  numero: string;
  serie: string;
  tipo: "entrada" | "saida";
  data_emissao: string;
  emitente_cnpj: string;
  emitente_nome: string;
  destinatario_cnpj: string;
  destinatario_nome: string;
  valor_total: number;
  valor_produtos: number;
  valor_servicos: number;
  natureza_operacao: string;
  cfop_principal: string | null;
  itens: ItemNotaContaFlux[];
  impostos: ImpostosNotaContaFlux;
  xml_base64: string | null;
}

export interface ItemNotaContaFlux {
  codigo: string;
  descricao: string;
  ncm: string | null;
  cfop: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

export interface ImpostosNotaContaFlux {
  icms: number;
  ipi: number;
  pis: number;
  cofins: number;
  iss: number;
  irrf: number;
  csll: number;
}

export interface PacoteMovimentacoesBancarias {
  banco_codigo: string;
  agencia: string;
  conta: string;
  periodo_inicio: string;
  periodo_fim: string;
  saldo_inicial: number | null;
  saldo_final: number | null;
  movimentacoes: MovimentacaoContaFlux[];
}

export interface MovimentacaoContaFlux {
  data: string;
  descricao: string;
  valor: number;
  tipo: "credito" | "debito";
  categoria_sugerida: string | null;
  documento_vinculado: string | null;
  referencia: string | null;
}

export interface PacoteFolhaPagamento {
  competencia: string;
  total_funcionarios: number;
  salarios_brutos: number;
  descontos: number;
  liquido: number;
  encargos: EncargosContaFlux;
  funcionarios: FuncionarioResumo[];
}

export interface EncargosContaFlux {
  inss_patronal: number;
  fgts: number;
  rat: number;
  terceiros: number;
  provisao_ferias: number;
  provisao_13: number;
}

export interface FuncionarioResumo {
  nome: string;
  cpf: string;
  cargo: string;
  salario_bruto: number;
  descontos: number;
  liquido: number;
  centro_custo: string | null;
}

// ============================================================================
// PREPARAÇÃO DE PACOTE
// ============================================================================

export function criarPacote<T>(
  empresaCnpj: string,
  escritorioCnpj: string,
  tipo: TipoPacote,
  competencia: string,
  dados: T,
  totalItens: number
): PacoteContaFlux<T> {
  const pacote: PacoteContaFlux<T> = {
    id: crypto.randomUUID(),
    empresa_cnpj: empresaCnpj,
    escritorio_cnpj: escritorioCnpj,
    tipo,
    competencia,
    versao_contrato: "1.0.0",
    criado_em: new Date().toISOString(),
    hash: "", // Será calculado
    total_itens: totalItens,
    dados,
  };

  pacote.hash = calcularHash(pacote);
  return pacote;
}

function calcularHash(pacote: PacoteContaFlux): string {
  const payload = JSON.stringify({
    empresa_cnpj: pacote.empresa_cnpj,
    tipo: pacote.tipo,
    competencia: pacote.competencia,
    total_itens: pacote.total_itens,
    criado_em: pacote.criado_em,
  });

  // Hash simples e deterministico (DJB2)
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) + hash + char) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

// ============================================================================
// VALIDAÇÃO PRÉ-ENVIO
// ============================================================================

export interface ValidacaoResult {
  valido: boolean;
  erros: string[];
  avisos: string[];
}

export function validarPacote(pacote: PacoteContaFlux): ValidacaoResult {
  const erros: string[] = [];
  const avisos: string[] = [];

  if (!pacote.empresa_cnpj || pacote.empresa_cnpj.length < 14) {
    erros.push("CNPJ da empresa invalido ou ausente");
  }

  if (!pacote.competencia || !/^\d{4}-\d{2}$/.test(pacote.competencia)) {
    erros.push("Competencia deve estar no formato YYYY-MM");
  }

  if (pacote.total_itens === 0) {
    avisos.push("Pacote sem itens — sera enviado vazio");
  }

  if (!pacote.hash) {
    erros.push("Hash do pacote nao calculado");
  }

  return {
    valido: erros.length === 0,
    erros,
    avisos,
  };
}
