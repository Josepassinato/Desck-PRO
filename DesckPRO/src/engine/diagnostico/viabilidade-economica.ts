import type {
  DadosEmpresaDiagnostico,
  ResultadoDimensao,
  ItemAvaliacao,
  SimulacaoComparativa,
} from "./types";
import { getNivel } from "./types";
import {
  FAIXAS_SIMPLES_NACIONAL,
  PRESUNCAO_LUCRO_PRESUMIDO,
  ALIQUOTAS_FEDERAIS,
} from "../data/fiscal-reference";

function estimarSimplesNacional(receitaBruta12m: number): number {
  const faixa = FAIXAS_SIMPLES_NACIONAL.find((f) => receitaBruta12m <= f.ate);
  if (!faixa) {
    return receitaBruta12m * 0.19; // última faixa
  }
  const aliquotaEfetiva =
    (receitaBruta12m * faixa.aliquota - faixa.deducao) / receitaBruta12m;
  return receitaBruta12m * Math.max(aliquotaEfetiva, 0);
}

function estimarPresumido(receitaBruta12m: number): number {
  const basePresumida = receitaBruta12m * PRESUNCAO_LUCRO_PRESUMIDO.servicos_geral;
  const irpj = basePresumida * ALIQUOTAS_FEDERAIS.irpj;
  const adicionalMensal = Math.max(
    basePresumida / 12 - ALIQUOTAS_FEDERAIS.irpj_adicional_limite_mensal,
    0
  );
  const irpjAdicional = adicionalMensal * 12 * ALIQUOTAS_FEDERAIS.irpj_adicional;
  const csll = basePresumida * ALIQUOTAS_FEDERAIS.csll;
  const pis = receitaBruta12m * ALIQUOTAS_FEDERAIS.pis_cumulativo;
  const cofins = receitaBruta12m * ALIQUOTAS_FEDERAIS.cofins_cumulativo;

  return irpj + irpjAdicional + csll + pis + cofins;
}

function estimarLucroReal(
  receitaBruta12m: number,
  custosDedutiveis12m: number,
  creditosPisCofins: number
): number {
  const lucroReal = Math.max(receitaBruta12m - custosDedutiveis12m, 0);
  const irpj = lucroReal * ALIQUOTAS_FEDERAIS.irpj;
  const adicionalMensal = Math.max(
    lucroReal / 12 - ALIQUOTAS_FEDERAIS.irpj_adicional_limite_mensal,
    0
  );
  const irpjAdicional = adicionalMensal * 12 * ALIQUOTAS_FEDERAIS.irpj_adicional;
  const csll = lucroReal * ALIQUOTAS_FEDERAIS.csll;
  const pisBruto = receitaBruta12m * ALIQUOTAS_FEDERAIS.pis_nao_cumulativo;
  const cofinsBruto = receitaBruta12m * ALIQUOTAS_FEDERAIS.cofins_nao_cumulativo;
  const pisLiquido = Math.max(pisBruto - creditosPisCofins * 0.18, 0);
  const cofinsLiquido = Math.max(cofinsBruto - creditosPisCofins * 0.82, 0);

  return irpj + irpjAdicional + csll + pisLiquido + cofinsLiquido;
}

export function avaliarViabilidadeEconomica(
  dados: DadosEmpresaDiagnostico
): ResultadoDimensao & { simulacao: SimulacaoComparativa } {
  const itens: ItemAvaliacao[] = [];
  const recomendacoes: string[] = [];
  const receita = dados.receita_bruta_12m ?? dados.faturamento_anual ?? 0;
  const custos = dados.custos_dedutiveis_12m ?? receita * 0.6;
  const creditos = dados.creditos_pis_cofins_estimados ?? custos * 0.3;

  // Simulação
  let tributosAtual = 0;
  let nomeAtual = dados.regime_atual;

  if (dados.regime_atual === "simples_nacional" || dados.regime_atual === "mei") {
    tributosAtual = estimarSimplesNacional(receita);
    nomeAtual = "Simples Nacional";
  } else {
    tributosAtual = estimarPresumido(receita);
    nomeAtual = "Lucro Presumido";
  }

  const tributosLR = estimarLucroReal(receita, custos, creditos);
  const economia = tributosAtual - tributosLR;
  const economiaPct = receita > 0 ? (economia / receita) * 100 : 0;

  const simulacao: SimulacaoComparativa = {
    regime_atual: {
      nome: nomeAtual,
      tributos_estimados: Math.round(tributosAtual),
      aliquota_efetiva: receita > 0 ? (tributosAtual / receita) * 100 : 0,
    },
    lucro_real: {
      tributos_estimados: Math.round(tributosLR),
      aliquota_efetiva: receita > 0 ? (tributosLR / receita) * 100 : 0,
    },
    economia_estimada: Math.round(economia),
    economia_percentual: Math.round(economiaPct * 100) / 100,
    aviso:
      "ESTIMATIVA para projecao. A apuracao REAL e definitiva e responsabilidade da ContaFlux.",
  };

  // Avaliar itens
  const temDadosReceita = receita > 0;
  itens.push({
    criterio: "Dados de receita disponiveis",
    resultado: temDadosReceita ? "aprovado" : "reprovado",
    detalhe: temDadosReceita
      ? `Receita 12m: R$ ${(receita / 1000).toFixed(0)}k`
      : "Receita nao informada — simulacao imprecisa",
    peso: 0.3,
  });

  if (!temDadosReceita) {
    recomendacoes.push(
      "Informe a receita bruta dos ultimos 12 meses para uma simulacao precisa."
    );
  }

  itens.push({
    criterio: "Custos dedutiveis informados",
    resultado: dados.custos_dedutiveis_12m !== null ? "aprovado" : "alerta",
    detalhe:
      dados.custos_dedutiveis_12m !== null
        ? `Custos dedutiveis: R$ ${(custos / 1000).toFixed(0)}k`
        : "Custos estimados em 60% da receita (padrao)",
    peso: 0.2,
  });

  itens.push({
    criterio: "Creditos PIS/COFINS estimados",
    resultado:
      dados.creditos_pis_cofins_estimados !== null ? "aprovado" : "alerta",
    detalhe:
      dados.creditos_pis_cofins_estimados !== null
        ? `Creditos estimados: R$ ${(creditos / 1000).toFixed(0)}k`
        : "Creditos estimados em 30% dos custos (padrao)",
    peso: 0.15,
  });

  // Resultado da simulação
  const economiaFavoravel = economia > 0;
  itens.push({
    criterio: "Economia estimada com Lucro Real",
    resultado: economiaFavoravel ? "aprovado" : "alerta",
    detalhe: economiaFavoravel
      ? `Economia estimada: R$ ${(economia / 1000).toFixed(0)}k/ano (${economiaPct.toFixed(1)}% da receita)`
      : `Lucro Real pode ser R$ ${(Math.abs(economia) / 1000).toFixed(0)}k/ano mais caro`,
    peso: 0.35,
  });

  if (economiaFavoravel && economiaPct > 2) {
    recomendacoes.push(
      `Migracao pode gerar economia de R$ ${(economia / 1000).toFixed(0)}k/ano. Vale aprofundar a analise.`
    );
  } else if (!economiaFavoravel) {
    recomendacoes.push(
      "Simulacao nao indica economia. Considere manter regime atual, salvo obrigacao legal."
    );
  }

  let scoreTotal = 0;
  let pesoTotal = 0;
  for (const item of itens) {
    const pontos =
      item.resultado === "aprovado" ? 100 : item.resultado === "alerta" ? 50 : 0;
    scoreTotal += pontos * item.peso;
    pesoTotal += item.peso;
  }
  const score = Math.round(pesoTotal > 0 ? scoreTotal / pesoTotal : 0);

  return {
    score,
    nivel: getNivel(score),
    itens,
    recomendacoes,
    simulacao,
  };
}
