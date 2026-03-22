import { describe, it, expect } from "vitest";
import {
  classificarDocumento,
  parseNFeXML,
} from "@/engine/documentos/classificador";

describe("Classificador de Documentos", () => {
  describe("classificarDocumento", () => {
    it("classifica NF-e por nome", () => {
      const r = classificarDocumento("NFe35240612345678000199550010000000011000000011.xml");
      expect(r.tipo).toBe("nfe");
      expect(r.confianca).toBeGreaterThanOrEqual(0.8);
    });

    it("classifica NFS-e por nome", () => {
      const r = classificarDocumento("nfse_202401.pdf");
      expect(r.tipo).toBe("nfse");
    });

    it("classifica CT-e por nome", () => {
      const r = classificarDocumento("cte_transporte_001.xml");
      expect(r.tipo).toBe("cte");
    });

    it("classifica extrato bancario por nome", () => {
      const r = classificarDocumento("extrato_janeiro_2024.pdf");
      expect(r.tipo).toBe("extrato_bancario");
    });

    it("classifica folha de pagamento por nome", () => {
      const r = classificarDocumento("folha_pagamento_01_2024.pdf");
      expect(r.tipo).toBe("folha_pagamento");
    });

    it("classifica DARF por nome", () => {
      const r = classificarDocumento("DARF_IRPJ_2024.pdf");
      expect(r.tipo).toBe("darf");
    });

    it("classifica DAS por nome", () => {
      const r = classificarDocumento("DAS_simples_nacional_01.pdf");
      expect(r.tipo).toBe("das");
    });

    it("classifica contrato por nome", () => {
      const r = classificarDocumento("contrato_social.pdf");
      expect(r.tipo).toBe("contrato");
    });

    it("classifica certificado digital por extensao .pfx", () => {
      const r = classificarDocumento("cert.pfx");
      expect(r.tipo).toBe("certificado_digital");
    });

    it("classifica .ofx como extrato bancario", () => {
      const r = classificarDocumento("banco_do_brasil.ofx");
      expect(r.tipo).toBe("extrato_bancario");
      expect(r.confianca).toBeGreaterThanOrEqual(0.9);
    });

    it("classifica XML generico com confianca menor", () => {
      const r = classificarDocumento("dados.xml");
      expect(r.tipo).toBe("nfe");
      expect(r.confianca).toBeLessThan(0.5);
    });

    it("retorna 'outro' para arquivo desconhecido", () => {
      const r = classificarDocumento("random_file.txt");
      expect(r.tipo).toBe("outro");
      expect(r.confianca).toBeLessThan(0.2);
    });

    it("usa MIME type quando nome nao ajuda", () => {
      const r = classificarDocumento("file.bin", "application/x-pkcs12");
      expect(r.tipo).toBe("certificado_digital");
    });
  });

  describe("parseNFeXML", () => {
    const sampleXML = `<?xml version="1.0"?>
<nfeProc>
  <NFe>
    <infNFe>
      <ide>
        <natOp>Venda de Mercadorias</natOp>
        <serie>1</serie>
        <nNF>12345</nNF>
        <dhEmi>2024-01-15T10:30:00-03:00</dhEmi>
      </ide>
      <emit>
        <CNPJ>12345678000199</CNPJ>
        <xNome>Empresa Emitente LTDA</xNome>
      </emit>
      <dest>
        <CNPJ>98765432000155</CNPJ>
        <xNome>Empresa Destinataria SA</xNome>
      </dest>
      <total>
        <ICMSTot>
          <vNF>1500.50</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
  <protNFe>
    <infProt>
      <chNFe>35240112345678000199550010000123451000000011</chNFe>
    </infProt>
  </protNFe>
</nfeProc>`;

    it("extrai chave de acesso", () => {
      const r = parseNFeXML(sampleXML);
      expect(r.chave_acesso).toBe("35240112345678000199550010000123451000000011");
    });

    it("extrai numero e serie", () => {
      const r = parseNFeXML(sampleXML);
      expect(r.numero).toBe("12345");
      expect(r.serie).toBe("1");
    });

    it("extrai emitente", () => {
      const r = parseNFeXML(sampleXML);
      expect(r.emitente_cnpj).toBe("12345678000199");
      expect(r.emitente_nome).toBe("Empresa Emitente LTDA");
    });

    it("extrai destinatario", () => {
      const r = parseNFeXML(sampleXML);
      expect(r.destinatario_cnpj).toBe("98765432000155");
      expect(r.destinatario_nome).toBe("Empresa Destinataria SA");
    });

    it("extrai valor total", () => {
      const r = parseNFeXML(sampleXML);
      expect(r.valor_total).toBe(1500.5);
    });

    it("extrai natureza da operacao", () => {
      const r = parseNFeXML(sampleXML);
      expect(r.natureza_operacao).toBe("Venda de Mercadorias");
    });

    it("retorna nulls para XML vazio", () => {
      const r = parseNFeXML("<root></root>");
      expect(r.chave_acesso).toBeNull();
      expect(r.numero).toBeNull();
      expect(r.valor_total).toBeNull();
    });
  });
});
