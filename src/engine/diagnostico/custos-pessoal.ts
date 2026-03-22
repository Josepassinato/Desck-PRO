import type { DadosEmpresaDiagnostico, ResultadoDimensao, ItemAvaliacao } from "./types";
import { getNivel } from "./types";

export function avaliarCustosPessoal(
  dados: DadosEmpresaDiagnostico
): ResultadoDimensao {
  const itens: ItemAvaliacao[] = [];
  const recomendacoes: string[] = [];

  // 1. Dados de folha disponíveis
  itens.push({
    criterio: "Dados de folha de pagamento",
    resultado: dados.custo_folha_mensal !== null ? "aprovado" : "reprovado",
    detalhe:
      dados.custo_folha_mensal !== null
        ? `Custo mensal: R$ ${(dados.custo_folha_mensal / 1000).toFixed(1)}k (${dados.total_funcionarios} funcionarios)`
        : "Dados de folha nao informados",
    peso: 0.3,
  });

  if (dados.custo_folha_mensal === null) {
    recomendacoes.push(
      "Informar custo de folha de pagamento para analise de custos de pessoal."
    );
  }

  // 2. Pro-labore
  itens.push({
    criterio: "Pro-labore definido",
    resultado: dados.tem_pro_labore ? "aprovado" : "alerta",
    detalhe: dados.tem_pro_labore
      ? `Pro-labore: R$ ${((dados.valor_pro_labore ?? 0) / 1000).toFixed(1)}k/mes`
      : "Sem pro-labore definido — impacta INSS e IRPF do socio",
    peso: 0.2,
  });

  if (!dados.tem_pro_labore) {
    recomendacoes.push(
      "Definir pro-labore dos socios. No Lucro Real, pro-labore e despesa dedutivel."
    );
  }

  // 3. Provisões trabalhistas
  itens.push({
    criterio: "Provisoes trabalhistas controladas",
    resultado: dados.tem_provisoes_trabalhistas ? "aprovado" : "alerta",
    detalhe: dados.tem_provisoes_trabalhistas
      ? "Provisoes de ferias, 13o e FGTS controladas"
      : "Sem controle de provisoes — risco de surpresas na migracao",
    peso: 0.2,
  });

  if (!dados.tem_provisoes_trabalhistas) {
    recomendacoes.push(
      "Implementar controle de provisoes (ferias, 13o, FGTS rescisorio) antes da migracao."
    );
  }

  // 4. Proporção folha/receita
  if (dados.custo_folha_mensal !== null && dados.faturamento_anual) {
    const folhaAnual = dados.custo_folha_mensal * 12;
    const proporcao = (folhaAnual / dados.faturamento_anual) * 100;

    itens.push({
      criterio: "Proporcao folha/receita",
      resultado: proporcao <= 40 ? "aprovado" : proporcao <= 60 ? "alerta" : "reprovado",
      detalhe: `Folha representa ${proporcao.toFixed(1)}% da receita`,
      peso: 0.15,
    });

    if (proporcao > 40) {
      recomendacoes.push(
        `Folha de pagamento alta (${proporcao.toFixed(0)}% da receita). No Lucro Real, e dedutivel mas impacta margem.`
      );
    }
  } else {
    itens.push({
      criterio: "Proporcao folha/receita",
      resultado: "alerta",
      detalhe: "Nao foi possivel calcular — dados incompletos",
      peso: 0.15,
    });
  }

  // 5. Número de funcionários
  itens.push({
    criterio: "Quadro de funcionarios",
    resultado: dados.total_funcionarios > 0 ? "aprovado" : "info",
    detalhe:
      dados.total_funcionarios > 0
        ? `${dados.total_funcionarios} funcionario(s) registrado(s)`
        : "Sem funcionarios registrados",
    peso: 0.15,
  });

  let scoreTotal = 0;
  let pesoTotal = 0;
  for (const item of itens) {
    const pontos =
      item.resultado === "aprovado"
        ? 100
        : item.resultado === "info"
        ? 80
        : item.resultado === "alerta"
        ? 50
        : 0;
    scoreTotal += pontos * item.peso;
    pesoTotal += item.peso;
  }
  const score = Math.round(pesoTotal > 0 ? scoreTotal / pesoTotal : 0);

  return { score, nivel: getNivel(score), itens, recomendacoes };
}
