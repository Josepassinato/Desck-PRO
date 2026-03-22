import { describe, it, expect } from "vitest";
import {
  criarPacote,
  validarPacote,
  type PacoteNotasFiscais,
} from "@/engine/contaflux/contrato";

describe("Contrato ContaFlux", () => {
  describe("criarPacote", () => {
    it("cria pacote com campos obrigatorios", () => {
      const dados: PacoteNotasFiscais = {
        notas: [
          {
            chave_acesso: "35240112345678000199550010000123451000000011",
            numero: "123",
            serie: "1",
            tipo: "saida",
            data_emissao: "2024-01-15",
            emitente_cnpj: "12345678000199",
            emitente_nome: "Empresa A",
            destinatario_cnpj: "98765432000155",
            destinatario_nome: "Empresa B",
            valor_total: 1500.0,
            valor_produtos: 1500.0,
            valor_servicos: 0,
            natureza_operacao: "Venda",
            cfop_principal: "5102",
            itens: [],
            xml_base64: null,
            impostos: {
              icms: 0,
              ipi: 0,
              pis: 0,
              cofins: 0,
              iss: 0,
              irrf: 0,
              csll: 0,
            },
          },
        ],
      };

      const pacote = criarPacote(
        "12345678000199",
        "99888777000166",
        "notas_fiscais",
        "2024-01",
        dados,
        1
      );

      expect(pacote.id).toBeDefined();
      expect(pacote.empresa_cnpj).toBe("12345678000199");
      expect(pacote.escritorio_cnpj).toBe("99888777000166");
      expect(pacote.tipo).toBe("notas_fiscais");
      expect(pacote.competencia).toBe("2024-01");
      expect(pacote.versao_contrato).toBe("1.0.0");
      expect(pacote.total_itens).toBe(1);
      expect(pacote.hash).toBeTruthy();
      expect(pacote.criado_em).toBeTruthy();
    });

    it("gera hash diferente para pacotes diferentes", () => {
      const p1 = criarPacote("11111111000111", "22222222000122", "notas_fiscais", "2024-01", {}, 1);
      const p2 = criarPacote("11111111000111", "22222222000122", "notas_fiscais", "2024-02", {}, 1);
      expect(p1.hash).not.toBe(p2.hash);
    });

    it("gera UUID como id", () => {
      const p = criarPacote("11111111000111", "22222222000122", "documentos", "2024-01", {}, 0);
      expect(p.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });
  });

  describe("validarPacote", () => {
    it("valida pacote completo", () => {
      const pacote = criarPacote(
        "12345678000199",
        "99888777000166",
        "notas_fiscais",
        "2024-01",
        { notas: [] },
        0
      );

      const resultado = validarPacote(pacote);
      expect(resultado.valido).toBe(true);
      expect(resultado.erros).toHaveLength(0);
    });

    it("rejeita pacote sem empresa_cnpj", () => {
      const pacote = criarPacote(
        "",
        "99888777000166",
        "notas_fiscais",
        "2024-01",
        {},
        0
      );

      const resultado = validarPacote(pacote);
      expect(resultado.valido).toBe(false);
      expect(resultado.erros.length).toBeGreaterThan(0);
    });

    it("rejeita pacote sem competencia", () => {
      const pacote = criarPacote(
        "12345678000199",
        "99888777000166",
        "notas_fiscais",
        "",
        {},
        0
      );

      const resultado = validarPacote(pacote);
      expect(resultado.valido).toBe(false);
    });
  });
});
