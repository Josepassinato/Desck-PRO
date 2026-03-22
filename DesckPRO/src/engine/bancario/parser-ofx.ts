/**
 * Parser OFX (Open Financial Exchange).
 * Extrai transações bancárias de arquivos OFX/OFC.
 */

export interface TransacaoOFX {
  id: string;
  data: string; // YYYY-MM-DD
  valor: number;
  tipo: "credito" | "debito";
  descricao: string;
  referencia: string | null;
}

export interface ExtratoOFX {
  banco_codigo: string | null;
  agencia: string | null;
  conta: string | null;
  data_inicio: string | null;
  data_fim: string | null;
  saldo_final: number | null;
  transacoes: TransacaoOFX[];
}

export function parseOFX(conteudo: string): ExtratoOFX {
  const transacoes: TransacaoOFX[] = [];

  // Extrair dados da conta
  const bankId = extrairTag(conteudo, "BANKID");
  const branchId = extrairTag(conteudo, "BRANCHID");
  const acctId = extrairTag(conteudo, "ACCTID");

  // Datas do extrato
  const dtStart = extrairTag(conteudo, "DTSTART");
  const dtEnd = extrairTag(conteudo, "DTEND");

  // Saldo
  const balAmt = extrairTag(conteudo, "BALAMT");

  // Extrair transações
  const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
  // Também suportar OFX sem tags de fechamento (formato SGML)
  const sgmlTrnRegex = /STMTTRN\s*\n([\s\S]*?)(?=STMTTRN|\/?BANKTRANLIST|$)/gi;

  let match: RegExpExecArray | null;

  // Tentar formato XML primeiro
  match = stmtTrnRegex.exec(conteudo);
  while (match) {
    const trn = parseTrn(match[1]);
    if (trn) transacoes.push(trn);
    match = stmtTrnRegex.exec(conteudo);
  }

  // Se não encontrou nada, tentar SGML
  if (transacoes.length === 0) {
    match = sgmlTrnRegex.exec(conteudo);
    while (match) {
      const trn = parseTrn(match[1]);
      if (trn) transacoes.push(trn);
      match = sgmlTrnRegex.exec(conteudo);
    }
  }

  return {
    banco_codigo: bankId,
    agencia: branchId,
    conta: acctId,
    data_inicio: formatarDataOFX(dtStart),
    data_fim: formatarDataOFX(dtEnd),
    saldo_final: balAmt ? parseFloat(balAmt) : null,
    transacoes,
  };
}

function parseTrn(bloco: string): TransacaoOFX | null {
  const trnType = extrairTag(bloco, "TRNTYPE");
  const dtPosted = extrairTag(bloco, "DTPOSTED");
  const trnAmt = extrairTag(bloco, "TRNAMT");
  const fitId = extrairTag(bloco, "FITID");
  const memo = extrairTag(bloco, "MEMO");
  const name = extrairTag(bloco, "NAME");
  const refNum = extrairTag(bloco, "REFNUM") ?? extrairTag(bloco, "CHECKNUM");

  if (!trnAmt || !dtPosted) return null;

  const valor = parseFloat(trnAmt);

  return {
    id: fitId ?? `${dtPosted}_${valor}_${Math.random().toString(36).slice(2, 8)}`,
    data: formatarDataOFX(dtPosted) ?? dtPosted,
    valor: Math.abs(valor),
    tipo: valor >= 0 ? "credito" : "debito",
    descricao: memo ?? name ?? trnType ?? "Sem descricao",
    referencia: refNum,
  };
}

function extrairTag(conteudo: string, tag: string): string | null {
  // XML format: <TAG>value</TAG>
  const xmlMatch = conteudo.match(new RegExp(`<${tag}>([^<]*)</${tag}>`, "i"));
  if (xmlMatch) return xmlMatch[1].trim();

  // SGML format: <TAG>value\n
  const sgmlMatch = conteudo.match(new RegExp(`<${tag}>(.+?)(?:\r?\n|<)`, "i"));
  if (sgmlMatch) return sgmlMatch[1].trim();

  return null;
}

function formatarDataOFX(data: string | null): string | null {
  if (!data || data.length < 8) return null;
  const ano = data.substring(0, 4);
  const mes = data.substring(4, 6);
  const dia = data.substring(6, 8);
  return `${ano}-${mes}-${dia}`;
}

/**
 * Categorizador simples de transações bancárias.
 */
export interface CategorizacaoResult {
  categoria: string;
  confianca: number;
}

const CATEGORIAS_PATTERNS: { regex: RegExp; categoria: string }[] = [
  { regex: /salario|folha|pagto\s*func|holerite/i, categoria: "folha_pagamento" },
  { regex: /inss|fgts|gfip|darf|das[\s-]|imposto|tributo|icms|iss|pis|cofins/i, categoria: "impostos" },
  { regex: /aluguel|locacao|condominio/i, categoria: "aluguel" },
  { regex: /energia|eletric|luz|cemig|copel|enel/i, categoria: "energia" },
  { regex: /agua|saneamento|sabesp|copasa/i, categoria: "agua" },
  { regex: /telecom|internet|telefone|celular|vivo|claro|tim|oi/i, categoria: "telecomunicacoes" },
  { regex: /combustivel|gasolina|diesel|posto|shell|ipiranga/i, categoria: "combustivel" },
  { regex: /material|escritorio|papelaria/i, categoria: "material_escritorio" },
  { regex: /software|sistema|licenca|assinatura|saas/i, categoria: "software" },
  { regex: /seguro|apolice/i, categoria: "seguros" },
  { regex: /contabilidade|contador|honorario/i, categoria: "servicos_contabeis" },
  { regex: /juridico|advogad|advocacia/i, categoria: "servicos_juridicos" },
  { regex: /pix|transf|ted|doc|deposito/i, categoria: "transferencia" },
  { regex: /tarifa|taxa\s*bancaria|manutencao.*conta/i, categoria: "tarifas_bancarias" },
  { regex: /venda|receita|faturamento|recebimento/i, categoria: "receita" },
  { regex: /fornecedor|compra|mercadoria/i, categoria: "fornecedores" },
  { regex: /pro[\s-]?labore/i, categoria: "pro_labore" },
  { regex: /dividendo|lucro.*distrib/i, categoria: "distribuicao_lucros" },
];

export function categorizarTransacao(descricao: string): CategorizacaoResult {
  for (const pattern of CATEGORIAS_PATTERNS) {
    if (pattern.regex.test(descricao)) {
      return { categoria: pattern.categoria, confianca: 0.7 };
    }
  }
  return { categoria: "outros", confianca: 0.1 };
}
