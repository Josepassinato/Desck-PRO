import type { DadosEmpresaDiagnostico, ResultadoDimensao, ItemAvaliacao } from "./types";
import { getNivel } from "./types";
import {
  CNAES_VEDADOS_SIMPLES,
  CNAES_OBRIGATORIO_LUCRO_REAL,
  LIMITE_SIMPLES_NACIONAL,
  LIMITE_OBRIGATORIO_LUCRO_REAL,
} from "../data/fiscal-reference";

export function avaliarElegibilidadeLegal(
  dados: DadosEmpresaDiagnostico
): ResultadoDimensao {
  const itens: ItemAvaliacao[] = [];
  const recomendacoes: string[] = [];

  // 1. Verificar se CNAE é vedado ao Simples
  const cnaeVedado = dados.cnae_principal
    ? CNAES_VEDADOS_SIMPLES.includes(dados.cnae_principal)
    : false;

  itens.push({
    criterio: "CNAE vedado ao Simples Nacional",
    resultado: cnaeVedado ? "info" : "aprovado",
    detalhe: cnaeVedado
      ? `CNAE ${dados.cnae_principal} vedado ao Simples — migracao pode ser obrigatoria`
      : "CNAE nao consta na lista de vedacoes",
    peso: 0.15,
  });

  // 2. Verificar se CNAE obriga Lucro Real
  const cnaeObrigaLR = dados.cnae_principal
    ? CNAES_OBRIGATORIO_LUCRO_REAL.includes(dados.cnae_principal)
    : false;

  itens.push({
    criterio: "CNAE exige Lucro Real",
    resultado: cnaeObrigaLR ? "info" : "aprovado",
    detalhe: cnaeObrigaLR
      ? `CNAE ${dados.cnae_principal} obriga adocao do Lucro Real`
      : "CNAE nao obriga Lucro Real",
    peso: 0.15,
  });

  if (cnaeObrigaLR) {
    recomendacoes.push(
      "A atividade obriga Lucro Real. A migracao nao e opcao, e obrigacao legal."
    );
  }

  // 3. Verificar faturamento vs limites
  const fat = dados.faturamento_anual;
  let fatResultado: ItemAvaliacao["resultado"] = "info";
  let fatDetalhe = "Faturamento nao informado";

  if (fat !== null) {
    if (fat > LIMITE_OBRIGATORIO_LUCRO_REAL) {
      fatResultado = "info";
      fatDetalhe = `Faturamento R$ ${(fat / 1_000_000).toFixed(1)}M excede R$ 78M — Lucro Real obrigatorio`;
      recomendacoes.push("Faturamento acima de R$ 78M obriga Lucro Real.");
    } else if (fat > LIMITE_SIMPLES_NACIONAL) {
      fatResultado = "alerta";
      fatDetalhe = `Faturamento R$ ${(fat / 1_000_000).toFixed(1)}M excede limite Simples (R$ 4,8M) — avaliar Presumido ou Real`;
    } else {
      fatResultado = "aprovado";
      fatDetalhe = `Faturamento R$ ${(fat / 1_000).toFixed(0)}k dentro do limite Simples`;
    }
  }

  itens.push({
    criterio: "Faturamento vs limites legais",
    resultado: fatResultado,
    detalhe: fatDetalhe,
    peso: 0.25,
  });

  // 4. Verificar regime atual
  const regimenCompativel = dados.regime_atual !== "real";
  itens.push({
    criterio: "Regime atual permite migracao",
    resultado: regimenCompativel ? "aprovado" : "alerta",
    detalhe: regimenCompativel
      ? `Regime atual: ${dados.regime_atual} — migracao para Lucro Real possivel`
      : "Empresa ja esta no Lucro Real",
    peso: 0.15,
  });

  if (!regimenCompativel) {
    recomendacoes.push(
      "Empresa ja esta no Lucro Real. Diagnostico pode focar em otimizacao."
    );
  }

  // 5. CNAEs secundários com vedações
  const cnaesSecVedados = dados.cnaes_secundarios.filter((c) =>
    CNAES_VEDADOS_SIMPLES.includes(c)
  );
  itens.push({
    criterio: "CNAEs secundarios com vedacoes",
    resultado: cnaesSecVedados.length > 0 ? "alerta" : "aprovado",
    detalhe:
      cnaesSecVedados.length > 0
        ? `${cnaesSecVedados.length} CNAE(s) secundario(s) vedado(s) ao Simples`
        : "Nenhum CNAE secundario vedado",
    peso: 0.1,
  });

  // 6. Existência de CNAE
  itens.push({
    criterio: "CNAE principal informado",
    resultado: dados.cnae_principal ? "aprovado" : "reprovado",
    detalhe: dados.cnae_principal
      ? `CNAE: ${dados.cnae_principal}`
      : "CNAE nao informado — necessario para analise completa",
    peso: 0.2,
  });

  if (!dados.cnae_principal) {
    recomendacoes.push(
      "Informe o CNAE principal para uma analise de elegibilidade completa."
    );
  }

  // Calcular score
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

  return {
    score,
    nivel: getNivel(score),
    itens,
    recomendacoes,
  };
}
