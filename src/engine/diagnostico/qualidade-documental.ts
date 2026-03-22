import type { DadosEmpresaDiagnostico, ResultadoDimensao, ItemAvaliacao } from "./types";
import { getNivel } from "./types";

export function avaliarQualidadeDocumental(
  dados: DadosEmpresaDiagnostico
): ResultadoDimensao {
  const itens: ItemAvaliacao[] = [];
  const recomendacoes: string[] = [];

  const totalNotas = dados.total_notas_12m ?? 0;
  const comXml = dados.notas_com_xml ?? 0;
  const semXml = dados.notas_sem_xml ?? 0;
  const pctXml = totalNotas > 0 ? (comXml / totalNotas) * 100 : 0;

  // 1. Volume de notas
  itens.push({
    criterio: "Volume de notas nos ultimos 12 meses",
    resultado: totalNotas > 0 ? "aprovado" : "reprovado",
    detalhe:
      totalNotas > 0
        ? `${totalNotas} notas identificadas`
        : "Nenhuma nota fiscal encontrada",
    peso: 0.2,
  });

  // 2. XMLs disponíveis
  itens.push({
    criterio: "XMLs de notas fiscais disponiveis",
    resultado: pctXml >= 90 ? "aprovado" : pctXml >= 70 ? "alerta" : "reprovado",
    detalhe:
      totalNotas > 0
        ? `${comXml}/${totalNotas} notas com XML (${pctXml.toFixed(0)}%)`
        : "Sem dados de XML",
    peso: 0.25,
  });

  if (pctXml < 90 && totalNotas > 0) {
    recomendacoes.push(
      `${semXml} nota(s) sem XML. Recuperar via DFe/SEFAZ antes da migracao.`
    );
  }

  // 3. Continuidade (meses sem movimentação)
  itens.push({
    criterio: "Continuidade documental (sem gaps)",
    resultado:
      dados.meses_sem_movimentacao === 0
        ? "aprovado"
        : dados.meses_sem_movimentacao <= 2
        ? "alerta"
        : "reprovado",
    detalhe:
      dados.meses_sem_movimentacao === 0
        ? "Sem gaps — todos os meses tem movimentacao"
        : `${dados.meses_sem_movimentacao} mes(es) sem movimentacao`,
    peso: 0.2,
  });

  if (dados.meses_sem_movimentacao > 0) {
    recomendacoes.push(
      `Verificar ${dados.meses_sem_movimentacao} mes(es) sem movimentacao — pode indicar notas faltantes.`
    );
  }

  // 4. Extratos bancários
  itens.push({
    criterio: "Extratos bancarios disponiveis",
    resultado: dados.tem_extratos_bancarios ? "aprovado" : "alerta",
    detalhe: dados.tem_extratos_bancarios
      ? "Extratos bancarios presentes"
      : "Sem extratos — reconciliacao bancaria ficara incompleta",
    peso: 0.2,
  });

  if (!dados.tem_extratos_bancarios) {
    recomendacoes.push(
      "Solicitar extratos bancarios (OFX/OFC) dos ultimos 12 meses."
    );
  }

  // 5. Organização geral
  const orgScore =
    (dados.tem_extratos_bancarios ? 1 : 0) +
    (pctXml >= 90 ? 1 : 0) +
    (dados.meses_sem_movimentacao === 0 ? 1 : 0);

  itens.push({
    criterio: "Organizacao documental geral",
    resultado: orgScore >= 3 ? "aprovado" : orgScore >= 2 ? "alerta" : "reprovado",
    detalhe: `${orgScore}/3 criterios de organizacao atendidos`,
    peso: 0.15,
  });

  let scoreTotal = 0;
  let pesoTotal = 0;
  for (const item of itens) {
    const pontos =
      item.resultado === "aprovado" ? 100 : item.resultado === "alerta" ? 50 : 0;
    scoreTotal += pontos * item.peso;
    pesoTotal += item.peso;
  }
  const score = Math.round(pesoTotal > 0 ? scoreTotal / pesoTotal : 0);

  return { score, nivel: getNivel(score), itens, recomendacoes };
}
