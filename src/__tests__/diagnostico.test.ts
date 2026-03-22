import { describe, it, expect } from "vitest";
import { executarDiagnostico } from "@/engine/diagnostico";
import type { DadosEmpresaDiagnostico } from "@/engine/diagnostico/types";

function criarDadosPadrao(): DadosEmpresaDiagnostico {
  return {
    cnpj: "11222333000181",
    cnae_principal: "6201501",
    cnaes_secundarios: [],
    regime_atual: "simples_nacional",
    faturamento_anual: 2000000,
    receita_bruta_12m: 2000000,
    custos_dedutiveis_12m: 800000,
    folha_pagamento_12m: 600000,
    creditos_pis_cofins_estimados: 120000,
    tem_erp: true,
    erp_nome: "Bling",
    tem_plano_contas: true,
    tem_centro_custos: false,
    tem_certificado_digital: true,
    certificado_valido: true,
    certificado_vencimento: "2025-12-31",
    total_notas_12m: 500,
    notas_com_xml: 480,
    notas_sem_xml: 20,
    meses_sem_movimentacao: 0,
    tem_extratos_bancarios: true,
    total_funcionarios: 15,
    custo_folha_mensal: 50000,
    tem_pro_labore: true,
    valor_pro_labore: 8000,
    tem_provisoes_trabalhistas: true,
    contador_experiencia_lucro_real: true,
    equipe_dedicada: true,
    prazo_desejado_migracao: 3,
    motivacao_migracao: "economia_tributaria",
  };
}

describe("Motor de Diagnostico", () => {
  it("executa diagnostico completo e retorna todas as dimensoes", () => {
    const dados = criarDadosPadrao();
    const resultado = executarDiagnostico(dados);

    expect(resultado.score_geral).toBeGreaterThanOrEqual(0);
    expect(resultado.score_geral).toBeLessThanOrEqual(100);
    expect(resultado.elegibilidade_legal).toBeDefined();
    expect(resultado.viabilidade_economica).toBeDefined();
    expect(resultado.prontidao_operacional).toBeDefined();
    expect(resultado.qualidade_documental).toBeDefined();
    expect(resultado.custos_pessoal).toBeDefined();
    expect(resultado.readiness).toBeDefined();
  });

  it("retorna recomendacao valida", () => {
    const resultado = executarDiagnostico(criarDadosPadrao());
    expect([
      "recomendado",
      "viavel_com_ressalvas",
      "nao_recomendado",
      "inconclusivo",
    ]).toContain(resultado.recomendacao);
  });

  it("retorna resumo", () => {
    const resultado = executarDiagnostico(criarDadosPadrao());
    expect(resultado.resumo).toBeTruthy();
    expect(resultado.resumo.length).toBeGreaterThan(10);
  });

  it("dimensoes tem score entre 0-100", () => {
    const resultado = executarDiagnostico(criarDadosPadrao());
    const dimensoes = [
      resultado.elegibilidade_legal,
      resultado.viabilidade_economica,
      resultado.prontidao_operacional,
      resultado.qualidade_documental,
      resultado.custos_pessoal,
      resultado.readiness,
    ];
    for (const dim of dimensoes) {
      expect(dim.score).toBeGreaterThanOrEqual(0);
      expect(dim.score).toBeLessThanOrEqual(100);
    }
  });

  it("dimensoes tem itens de avaliacao", () => {
    const resultado = executarDiagnostico(criarDadosPadrao());
    const dimensoes = [
      resultado.elegibilidade_legal,
      resultado.viabilidade_economica,
      resultado.prontidao_operacional,
      resultado.qualidade_documental,
      resultado.custos_pessoal,
      resultado.readiness,
    ];
    for (const dim of dimensoes) {
      expect(dim.itens.length).toBeGreaterThan(0);
    }
  });

  it("empresa com faturamento alto pontua bem em elegibilidade", () => {
    const dados = criarDadosPadrao();
    dados.faturamento_anual = 5000000; // Acima do Simples
    const resultado = executarDiagnostico(dados);
    expect(resultado.elegibilidade_legal.score).toBeGreaterThanOrEqual(50);
  });

  it("empresa com problemas operacionais pontua baixo em prontidao", () => {
    const dados = criarDadosPadrao();
    dados.tem_erp = false;
    dados.tem_plano_contas = false;
    dados.tem_centro_custos = false;
    dados.tem_certificado_digital = false;
    dados.certificado_valido = false;
    const resultado = executarDiagnostico(dados);
    expect(resultado.prontidao_operacional.score).toBeLessThan(50);
  });

  it("empresa com baixa qualidade documental pontua baixo", () => {
    const dados = criarDadosPadrao();
    dados.total_notas_12m = 100;
    dados.notas_com_xml = 10;
    dados.notas_sem_xml = 90;
    dados.tem_extratos_bancarios = false;
    dados.meses_sem_movimentacao = 4;
    const resultado = executarDiagnostico(dados);
    expect(resultado.qualidade_documental.score).toBeLessThan(60);
  });

  it("gera simulacao comparativa na viabilidade economica", () => {
    const resultado = executarDiagnostico(criarDadosPadrao());
    expect(resultado.viabilidade_economica.simulacao).toBeDefined();
    expect(resultado.viabilidade_economica.simulacao.regime_atual).toBeDefined();
    expect(resultado.viabilidade_economica.simulacao.lucro_real).toBeDefined();
    expect(resultado.viabilidade_economica.simulacao.economia_estimada).toBeDefined();
  });

  it("score geral e media ponderada das dimensoes", () => {
    const resultado = executarDiagnostico(criarDadosPadrao());
    const expectedScore = Math.round(
      resultado.elegibilidade_legal.score * 0.20 +
      resultado.viabilidade_economica.score * 0.25 +
      resultado.prontidao_operacional.score * 0.15 +
      resultado.qualidade_documental.score * 0.15 +
      resultado.custos_pessoal.score * 0.10 +
      resultado.readiness.score * 0.15
    );
    expect(resultado.score_geral).toBe(expectedScore);
  });
});
