import { describe, it, expect } from "vitest";
import { parseOFX, categorizarTransacao } from "@/engine/bancario/parser-ofx";

describe("Parser OFX", () => {
  describe("parseOFX — formato XML", () => {
    const xmlOFX = `<?xml version="1.0"?>
<OFX>
  <BANKMSGSRSV1>
    <STMTTRNRS>
      <STMTRS>
        <BANKACCTFROM>
          <BANKID>341</BANKID>
          <BRANCHID>1234</BRANCHID>
          <ACCTID>56789-0</ACCTID>
        </BANKACCTFROM>
        <BANKTRANLIST>
          <DTSTART>20240101</DTSTART>
          <DTEND>20240131</DTEND>
          <STMTTRN>
            <TRNTYPE>CREDIT</TRNTYPE>
            <DTPOSTED>20240105</DTPOSTED>
            <TRNAMT>1500.00</TRNAMT>
            <FITID>2024010501</FITID>
            <MEMO>PIX RECEBIDO - CLIENTE XYZ</MEMO>
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>DEBIT</TRNTYPE>
            <DTPOSTED>20240110</DTPOSTED>
            <TRNAMT>-350.75</TRNAMT>
            <FITID>2024011001</FITID>
            <MEMO>PAGTO ENERGIA ELETRICA ENEL</MEMO>
          </STMTTRN>
          <STMTTRN>
            <TRNTYPE>DEBIT</TRNTYPE>
            <DTPOSTED>20240115</DTPOSTED>
            <TRNAMT>-2500.00</TRNAMT>
            <FITID>2024011501</FITID>
            <MEMO>FOLHA PAGAMENTO JANEIRO</MEMO>
          </STMTTRN>
        </BANKTRANLIST>
        <LEDGERBAL>
          <BALAMT>5649.25</BALAMT>
        </LEDGERBAL>
      </STMTRS>
    </STMTTRNRS>
  </BANKMSGSRSV1>
</OFX>`;

    it("extrai dados da conta", () => {
      const r = parseOFX(xmlOFX);
      expect(r.banco_codigo).toBe("341");
      expect(r.agencia).toBe("1234");
      expect(r.conta).toBe("56789-0");
    });

    it("extrai datas do extrato", () => {
      const r = parseOFX(xmlOFX);
      expect(r.data_inicio).toBe("2024-01-01");
      expect(r.data_fim).toBe("2024-01-31");
    });

    it("extrai saldo final", () => {
      const r = parseOFX(xmlOFX);
      expect(r.saldo_final).toBe(5649.25);
    });

    it("extrai todas as transacoes", () => {
      const r = parseOFX(xmlOFX);
      expect(r.transacoes).toHaveLength(3);
    });

    it("classifica creditos e debitos corretamente", () => {
      const r = parseOFX(xmlOFX);
      expect(r.transacoes[0].tipo).toBe("credito");
      expect(r.transacoes[0].valor).toBe(1500);

      expect(r.transacoes[1].tipo).toBe("debito");
      expect(r.transacoes[1].valor).toBe(350.75);
    });

    it("formata datas como YYYY-MM-DD", () => {
      const r = parseOFX(xmlOFX);
      expect(r.transacoes[0].data).toBe("2024-01-05");
    });

    it("extrai descricao/memo", () => {
      const r = parseOFX(xmlOFX);
      expect(r.transacoes[0].descricao).toBe("PIX RECEBIDO - CLIENTE XYZ");
    });

    it("extrai FITID como id", () => {
      const r = parseOFX(xmlOFX);
      expect(r.transacoes[0].id).toBe("2024010501");
    });
  });

  describe("parseOFX — formato SGML", () => {
    const sgmlOFX = `OFXHEADER:100
<OFX>
<BANKMSGSRSV1>
<STMTTRNRS>
<STMTRS>
<BANKACCTFROM>
<BANKID>237
<ACCTID>12345-6
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20240201
<DTEND>20240228
STMTTRN
<TRNTYPE>CREDIT
<DTPOSTED>20240205
<TRNAMT>800.00
<FITID>FIT001
<MEMO>VENDA RECEBIMENTO
STMTTRN
<TRNTYPE>DEBIT
<DTPOSTED>20240210
<TRNAMT>-150.00
<FITID>FIT002
<MEMO>TARIFA BANCARIA MENSAL
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>2650.00
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;

    it("extrai dados da conta SGML", () => {
      const r = parseOFX(sgmlOFX);
      expect(r.banco_codigo).toBe("237");
      expect(r.conta).toBe("12345-6");
    });

    it("extrai transacoes SGML", () => {
      const r = parseOFX(sgmlOFX);
      expect(r.transacoes.length).toBeGreaterThanOrEqual(1);
    });

    it("extrai saldo SGML", () => {
      const r = parseOFX(sgmlOFX);
      expect(r.saldo_final).toBe(2650);
    });
  });

  describe("parseOFX — arquivo vazio", () => {
    it("retorna extrato vazio", () => {
      const r = parseOFX("");
      expect(r.transacoes).toHaveLength(0);
      expect(r.banco_codigo).toBeNull();
    });
  });
});

describe("Categorizador de Transacoes", () => {
  it("categoriza folha de pagamento", () => {
    expect(categorizarTransacao("FOLHA PAGAMENTO JANEIRO").categoria).toBe(
      "folha_pagamento"
    );
    expect(categorizarTransacao("PAGTO SALARIO FUNC").categoria).toBe(
      "folha_pagamento"
    );
  });

  it("categoriza impostos", () => {
    expect(categorizarTransacao("DARF IRPJ 1 TRIMESTRE").categoria).toBe(
      "impostos"
    );
    expect(categorizarTransacao("PAGTO INSS PATRONAL").categoria).toBe(
      "impostos"
    );
    expect(categorizarTransacao("FGTS COMPETENCIA 01").categoria).toBe(
      "impostos"
    );
  });

  it("categoriza aluguel", () => {
    expect(categorizarTransacao("ALUGUEL SALA COMERCIAL").categoria).toBe(
      "aluguel"
    );
  });

  it("categoriza energia", () => {
    expect(categorizarTransacao("PAGTO ENERGIA ENEL").categoria).toBe(
      "energia"
    );
  });

  it("categoriza telecomunicacoes", () => {
    expect(categorizarTransacao("VIVO INTERNET FIBRA").categoria).toBe(
      "telecomunicacoes"
    );
  });

  it("categoriza transferencias", () => {
    expect(categorizarTransacao("PIX RECEBIDO").categoria).toBe(
      "transferencia"
    );
    expect(categorizarTransacao("TED ENVIADA").categoria).toBe(
      "transferencia"
    );
  });

  it("categoriza tarifas bancarias", () => {
    expect(categorizarTransacao("TARIFA MANUTENCAO CONTA").categoria).toBe(
      "tarifas_bancarias"
    );
  });

  it("categoriza pro-labore", () => {
    expect(categorizarTransacao("PRO LABORE SOCIO").categoria).toBe(
      "pro_labore"
    );
  });

  it("retorna 'outros' para descricao desconhecida", () => {
    const r = categorizarTransacao("XYZABC DESCRICAO ALEATORIA");
    expect(r.categoria).toBe("outros");
    expect(r.confianca).toBeLessThan(0.2);
  });
});
