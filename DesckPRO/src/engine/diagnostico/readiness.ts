import type { DadosEmpresaDiagnostico, ResultadoDimensao, ItemAvaliacao } from "./types";
import { getNivel } from "./types";

export function avaliarReadiness(
  dados: DadosEmpresaDiagnostico
): ResultadoDimensao {
  const itens: ItemAvaliacao[] = [];
  const recomendacoes: string[] = [];

  // 1. Experiência do contador com Lucro Real
  itens.push({
    criterio: "Contador com experiencia em Lucro Real",
    resultado: dados.contador_experiencia_lucro_real ? "aprovado" : "alerta",
    detalhe: dados.contador_experiencia_lucro_real
      ? "Contador tem experiencia com Lucro Real"
      : "Contador sem experiencia previa com Lucro Real",
    peso: 0.25,
  });

  if (!dados.contador_experiencia_lucro_real) {
    recomendacoes.push(
      "Considerar capacitacao ou consultoria especializada em Lucro Real para a equipe contabil."
    );
  }

  // 2. Equipe dedicada
  itens.push({
    criterio: "Equipe dedicada para a migracao",
    resultado: dados.equipe_dedicada ? "aprovado" : "alerta",
    detalhe: dados.equipe_dedicada
      ? "Equipe dedicada para acompanhar a transicao"
      : "Sem equipe dedicada — migracao pode sobrecarregar equipe atual",
    peso: 0.2,
  });

  // 3. Prazo de migração
  const prazo = dados.prazo_desejado_migracao;
  itens.push({
    criterio: "Prazo de migracao adequado",
    resultado:
      prazo === null
        ? "alerta"
        : prazo >= 3
        ? "aprovado"
        : "reprovado",
    detalhe:
      prazo === null
        ? "Prazo nao definido"
        : prazo >= 3
        ? `${prazo} meses — prazo adequado para transicao`
        : `${prazo} mes(es) — prazo muito curto para migracao segura`,
    peso: 0.2,
  });

  if (prazo !== null && prazo < 3) {
    recomendacoes.push(
      "Prazo inferior a 3 meses e arriscado. Recomendamos pelo menos 3-6 meses para migracao segura."
    );
  }

  // 4. Motivação da migração
  itens.push({
    criterio: "Motivacao da migracao clara",
    resultado: dados.motivacao_migracao ? "aprovado" : "alerta",
    detalhe: dados.motivacao_migracao
      ? `Motivacao: ${dados.motivacao_migracao}`
      : "Motivacao nao informada",
    peso: 0.1,
  });

  // 5. Infraestrutura geral (composição dos outros scores)
  const infraOk =
    dados.tem_erp && dados.tem_certificado_digital && dados.tem_plano_contas;
  itens.push({
    criterio: "Infraestrutura minima para Lucro Real",
    resultado: infraOk ? "aprovado" : "reprovado",
    detalhe: infraOk
      ? "ERP + certificado + plano de contas presentes"
      : "Infraestrutura incompleta (faltam pré-requisitos)",
    peso: 0.25,
  });

  if (!infraOk) {
    const faltam: string[] = [];
    if (!dados.tem_erp) faltam.push("ERP");
    if (!dados.tem_certificado_digital) faltam.push("certificado digital");
    if (!dados.tem_plano_contas) faltam.push("plano de contas");
    recomendacoes.push(`Resolver pre-requisitos antes da migracao: ${faltam.join(", ")}.`);
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

  return { score, nivel: getNivel(score), itens, recomendacoes };
}
