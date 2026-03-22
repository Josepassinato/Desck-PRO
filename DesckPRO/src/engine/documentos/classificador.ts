/**
 * Classificador automático de documentos por nome/tipo de arquivo.
 * Primeira camada — classificação por heurística.
 * OCR e NLP seriam camadas adicionais (futuro).
 */

import type { TipoDocumento } from "@/types/documento";

interface ClassificacaoResult {
  tipo: TipoDocumento;
  confianca: number; // 0-1
  motivo: string;
}

const PATTERNS: { regex: RegExp; tipo: TipoDocumento; label: string }[] = [
  { regex: /nf[\-_]?e|nota[\-_]?fiscal[\-_]?eletr/i, tipo: "nfe", label: "NF-e detectada pelo nome" },
  { regex: /nfs[\-_]?e|nota[\-_]?servico/i, tipo: "nfse", label: "NFS-e detectada pelo nome" },
  { regex: /ct[\-_]?e|conhecimento[\-_]?transporte/i, tipo: "cte", label: "CT-e detectado pelo nome" },
  { regex: /extrato|bancario|bank[\-_]?statement/i, tipo: "extrato_bancario", label: "Extrato bancario detectado" },
  { regex: /folha[\-_]?pagamento|holerite|contracheque|payroll/i, tipo: "folha_pagamento", label: "Folha de pagamento detectada" },
  { regex: /balancete|trial[\-_]?balance/i, tipo: "balancete", label: "Balancete detectado" },
  { regex: /darf/i, tipo: "darf", label: "DARF detectada" },
  { regex: /das[\-_]|simples[\-_]?nacional/i, tipo: "das", label: "DAS detectada" },
  { regex: /contrato|agreement/i, tipo: "contrato", label: "Contrato detectado" },
  { regex: /procuracao|power[\-_]?of[\-_]?attorney/i, tipo: "procuracao", label: "Procuracao detectada" },
  { regex: /certificado[\-_]?digital|\.pfx|\.p12/i, tipo: "certificado_digital", label: "Certificado digital detectado" },
];

const MIME_HINTS: Record<string, TipoDocumento> = {
  "text/xml": "nfe",
  "application/xml": "nfe",
  "application/x-pkcs12": "certificado_digital",
};

export function classificarDocumento(
  nomeArquivo: string,
  mimeType?: string
): ClassificacaoResult {
  // 1. Tentar por padrão de nome
  for (const pattern of PATTERNS) {
    if (pattern.regex.test(nomeArquivo)) {
      return {
        tipo: pattern.tipo,
        confianca: 0.8,
        motivo: pattern.label,
      };
    }
  }

  // 2. Tentar por MIME type
  if (mimeType && MIME_HINTS[mimeType]) {
    return {
      tipo: MIME_HINTS[mimeType],
      confianca: 0.5,
      motivo: `Tipo sugerido pelo MIME: ${mimeType}`,
    };
  }

  // 3. Tentar por extensão
  const ext = nomeArquivo.split(".").pop()?.toLowerCase();
  if (ext === "xml") {
    return {
      tipo: "nfe",
      confianca: 0.4,
      motivo: "XML generico — pode ser NF-e, NFS-e ou CT-e",
    };
  }
  if (ext === "ofx" || ext === "ofc") {
    return {
      tipo: "extrato_bancario",
      confianca: 0.9,
      motivo: `Arquivo ${ext.toUpperCase()} — extrato bancario`,
    };
  }
  if (ext === "pfx" || ext === "p12") {
    return {
      tipo: "certificado_digital",
      confianca: 0.95,
      motivo: "Arquivo de certificado digital",
    };
  }

  return {
    tipo: "outro",
    confianca: 0.1,
    motivo: "Tipo nao identificado automaticamente",
  };
}

/**
 * Parser básico de XML NF-e.
 * Extrai campos essenciais de uma NF-e a partir do XML.
 */
export interface NFeResumo {
  chave_acesso: string | null;
  numero: string | null;
  serie: string | null;
  data_emissao: string | null;
  emitente_cnpj: string | null;
  emitente_nome: string | null;
  destinatario_cnpj: string | null;
  destinatario_nome: string | null;
  valor_total: number | null;
  natureza_operacao: string | null;
}

export function parseNFeXML(xmlString: string): NFeResumo {
  const tag = (name: string): string | null => {
    const match = xmlString.match(new RegExp(`<${name}>([^<]*)</${name}>`));
    return match ? match[1] : null;
  };

  const chNFe = tag("chNFe");
  const nNF = tag("nNF");
  const serie = tag("serie");
  const dhEmi = tag("dhEmi");
  const natOp = tag("natOp");
  const vNF = tag("vNF");

  // Emitente
  const emitBlock = xmlString.match(/<emit>([\s\S]*?)<\/emit>/);
  const emitXml = emitBlock?.[1] ?? "";
  const emitCNPJ = emitXml.match(/<CNPJ>([^<]*)<\/CNPJ>/)?.[1] ?? null;
  const emitNome = emitXml.match(/<xNome>([^<]*)<\/xNome>/)?.[1] ?? null;

  // Destinatário
  const destBlock = xmlString.match(/<dest>([\s\S]*?)<\/dest>/);
  const destXml = destBlock?.[1] ?? "";
  const destCNPJ = destXml.match(/<CNPJ>([^<]*)<\/CNPJ>/)?.[1] ??
                   destXml.match(/<CPF>([^<]*)<\/CPF>/)?.[1] ?? null;
  const destNome = destXml.match(/<xNome>([^<]*)<\/xNome>/)?.[1] ?? null;

  return {
    chave_acesso: chNFe,
    numero: nNF,
    serie,
    data_emissao: dhEmi,
    emitente_cnpj: emitCNPJ,
    emitente_nome: emitNome,
    destinatario_cnpj: destCNPJ,
    destinatario_nome: destNome,
    valor_total: vNF ? parseFloat(vNF) : null,
    natureza_operacao: natOp,
  };
}
