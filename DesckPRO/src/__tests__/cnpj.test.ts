import { describe, it, expect } from "vitest";
import { formatCNPJ, cleanCNPJ, validateCNPJ } from "@/utils/cnpj";

describe("CNPJ Utils", () => {
  describe("formatCNPJ", () => {
    it("formata CNPJ completo", () => {
      expect(formatCNPJ("11222333000181")).toBe("11.222.333/0001-81");
    });

    it("formata parcialmente", () => {
      expect(formatCNPJ("11222")).toBe("11.222");
    });

    it("remove caracteres nao-numericos antes de formatar", () => {
      expect(formatCNPJ("11.222.333/0001-81")).toBe("11.222.333/0001-81");
    });

    it("limita a 14 digitos", () => {
      expect(formatCNPJ("112223330001819999")).toBe("11.222.333/0001-81");
    });
  });

  describe("cleanCNPJ", () => {
    it("remove pontuacao", () => {
      expect(cleanCNPJ("11.222.333/0001-81")).toBe("11222333000181");
    });

    it("retorna string vazia para vazio", () => {
      expect(cleanCNPJ("")).toBe("");
    });
  });

  describe("validateCNPJ", () => {
    it("valida CNPJ correto", () => {
      expect(validateCNPJ("11.222.333/0001-81")).toBe(true);
    });

    it("valida CNPJ correto sem formatacao", () => {
      expect(validateCNPJ("11222333000181")).toBe(true);
    });

    it("rejeita CNPJ com digitos iguais", () => {
      expect(validateCNPJ("11111111111111")).toBe(false);
      expect(validateCNPJ("00000000000000")).toBe(false);
    });

    it("rejeita CNPJ com tamanho errado", () => {
      expect(validateCNPJ("1234567890")).toBe(false);
      expect(validateCNPJ("")).toBe(false);
    });

    it("rejeita CNPJ com digito verificador errado", () => {
      expect(validateCNPJ("11222333000182")).toBe(false);
    });

    it("valida outro CNPJ correto", () => {
      // Receita Federal
      expect(validateCNPJ("00394460005887")).toBe(true);
    });
  });
});
