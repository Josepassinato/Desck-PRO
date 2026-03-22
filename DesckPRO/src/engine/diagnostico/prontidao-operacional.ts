import type { DadosEmpresaDiagnostico, ResultadoDimensao, ItemAvaliacao } from "./types";
import { getNivel } from "./types";

export function avaliarProntidaoOperacional(
  dados: DadosEmpresaDiagnostico
): ResultadoDimensao {
  const itens: ItemAvaliacao[] = [];
  const recomendacoes: string[] = [];

  // 1. ERP
  itens.push({
    criterio: "Sistema ERP em uso",
    resultado: dados.tem_erp ? "aprovado" : "reprovado",
    detalhe: dados.tem_erp
      ? `ERP: ${dados.erp_nome ?? "identificado"}`
      : "Sem ERP — controle manual dificulta Lucro Real",
    peso: 0.25,
  });

  if (!dados.tem_erp) {
    recomendacoes.push(
      "Implementar um ERP e pre-requisito para operar no Lucro Real. Considere Bling, Omie ou ContaAzul."
    );
  }

  // 2. Plano de contas
  itens.push({
    criterio: "Plano de contas estruturado",
    resultado: dados.tem_plano_contas ? "aprovado" : "reprovado",
    detalhe: dados.tem_plano_contas
      ? "Plano de contas configurado"
      : "Sem plano de contas — necessario para Lucro Real",
    peso: 0.2,
  });

  if (!dados.tem_plano_contas) {
    recomendacoes.push(
      "Criar plano de contas conforme modelo RFB antes da migracao."
    );
  }

  // 3. Centro de custos
  itens.push({
    criterio: "Centro de custos configurado",
    resultado: dados.tem_centro_custos ? "aprovado" : "alerta",
    detalhe: dados.tem_centro_custos
      ? "Centro de custos ativo"
      : "Sem centro de custos — recomendado para Lucro Real",
    peso: 0.15,
  });

  // 4. Certificado digital
  itens.push({
    criterio: "Certificado digital valido",
    resultado: dados.tem_certificado_digital
      ? dados.certificado_valido
        ? "aprovado"
        : "alerta"
      : "reprovado",
    detalhe: dados.tem_certificado_digital
      ? dados.certificado_valido
        ? `Certificado valido${dados.certificado_vencimento ? ` ate ${dados.certificado_vencimento}` : ""}`
        : "Certificado expirado ou proximo do vencimento"
      : "Sem certificado digital — obrigatorio para obrigacoes acessorias",
    peso: 0.25,
  });

  if (!dados.tem_certificado_digital) {
    recomendacoes.push(
      "Adquirir certificado digital A1 ou A3 antes da migracao."
    );
  } else if (!dados.certificado_valido) {
    recomendacoes.push("Renovar certificado digital antes da migracao.");
  }

  // 5. Integração ERP conectada
  itens.push({
    criterio: "Integracao automatizada com ERP",
    resultado: dados.tem_erp ? "alerta" : "reprovado",
    detalhe: dados.tem_erp
      ? "ERP presente — verificar se integracao automatica esta configurada"
      : "Sem ERP, sem integracao possivel",
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
