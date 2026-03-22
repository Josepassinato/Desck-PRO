/**
 * Motor de Diagnóstico de Migração — Orchestrator
 *
 * Combina os 6 avaliadores dimensionais e gera o resultado consolidado.
 * NOTA: Toda simulação aqui é ESTIMATIVA. A apuração real é da ContaFlux.
 */

import type { DadosEmpresaDiagnostico, ResultadoDiagnostico } from "./types";
import { avaliarElegibilidadeLegal } from "./elegibilidade-legal";
import { avaliarViabilidadeEconomica } from "./viabilidade-economica";
import { avaliarProntidaoOperacional } from "./prontidao-operacional";
import { avaliarQualidadeDocumental } from "./qualidade-documental";
import { avaliarCustosPessoal } from "./custos-pessoal";
import { avaliarReadiness } from "./readiness";

const PESOS_DIMENSOES = {
  elegibilidade_legal: 0.20,
  viabilidade_economica: 0.25,
  prontidao_operacional: 0.15,
  qualidade_documental: 0.15,
  custos_pessoal: 0.10,
  readiness: 0.15,
};

export function executarDiagnostico(
  dados: DadosEmpresaDiagnostico
): ResultadoDiagnostico {
  const elegibilidade = avaliarElegibilidadeLegal(dados);
  const viabilidade = avaliarViabilidadeEconomica(dados);
  const operacional = avaliarProntidaoOperacional(dados);
  const documental = avaliarQualidadeDocumental(dados);
  const pessoal = avaliarCustosPessoal(dados);
  const readiness = avaliarReadiness(dados);

  // Score geral ponderado
  const scoreGeral = Math.round(
    elegibilidade.score * PESOS_DIMENSOES.elegibilidade_legal +
    viabilidade.score * PESOS_DIMENSOES.viabilidade_economica +
    operacional.score * PESOS_DIMENSOES.prontidao_operacional +
    documental.score * PESOS_DIMENSOES.qualidade_documental +
    pessoal.score * PESOS_DIMENSOES.custos_pessoal +
    readiness.score * PESOS_DIMENSOES.readiness
  );

  // Recomendação
  const temBloqueio =
    elegibilidade.itens.some((i) => i.resultado === "reprovado" && i.peso >= 0.2) ||
    operacional.itens.some((i) => i.resultado === "reprovado" && i.peso >= 0.2);

  let recomendacao: ResultadoDiagnostico["recomendacao"];
  let resumo: string;

  if (temBloqueio) {
    recomendacao = "nao_recomendado";
    resumo =
      "Existem pre-requisitos nao atendidos que impedem a migracao no momento. Resolva os itens criticos antes de prosseguir.";
  } else if (scoreGeral >= 70) {
    recomendacao = "recomendado";
    resumo =
      "A empresa apresenta boas condicoes para migracao ao Lucro Real. Recomendamos prosseguir com o plano de implantacao.";
  } else if (scoreGeral >= 45) {
    recomendacao = "viavel_com_ressalvas";
    resumo =
      "A migracao e viavel, mas existem pontos de atencao que devem ser resolvidos. Siga as recomendacoes antes de migrar.";
  } else if (scoreGeral >= 20) {
    recomendacao = "nao_recomendado";
    resumo =
      "Nao recomendamos a migracao neste momento. A empresa precisa resolver varios pontos criticos antes.";
  } else {
    recomendacao = "inconclusivo";
    resumo =
      "Dados insuficientes para um diagnostico conclusivo. Preencha mais informacoes e execute novamente.";
  }

  return {
    elegibilidade_legal: elegibilidade,
    viabilidade_economica: viabilidade,
    prontidao_operacional: operacional,
    qualidade_documental: documental,
    custos_pessoal: pessoal,
    readiness,
    score_geral: scoreGeral,
    recomendacao,
    resumo,
  };
}

export type { DadosEmpresaDiagnostico, ResultadoDiagnostico } from "./types";
