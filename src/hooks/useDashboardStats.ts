import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { requireFirmId } from "@/lib/auth-guard";

interface DashboardStats {
  diagnosticos: number;
  documentos: number;
  integracoesAtivas: number;
  pendenciasAbertas: number;
  pendenciasUrgentes: number;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const firmId = await requireFirmId();

  // Busca IDs das empresas da firma para filtrar docs e integrações
  const { data: empresas } = await supabase
    .from("empresas")
    .select("id")
    .eq("accounting_firm_id", firmId);

  const empresaIds = empresas?.map((e) => e.id) ?? [];

  // Queries em paralelo
  const [docCount, pendencias, intCount, diagCount] = await Promise.all([
    empresaIds.length > 0
      ? supabase
          .from("documentos")
          .select("id", { count: "exact", head: true })
          .in("empresa_id", empresaIds)
          .then((r) => r.count ?? 0)
      : Promise.resolve(0),

    supabase
      .from("pendencias")
      .select("prioridade, status")
      .eq("accounting_firm_id", firmId)
      .in("status", ["aberta", "em_andamento"])
      .then((r) => r.data ?? []),

    empresaIds.length > 0
      ? supabase
          .from("integracoes_erp")
          .select("id", { count: "exact", head: true })
          .in("empresa_id", empresaIds)
          .eq("status", "active")
          .then((r) => r.count ?? 0)
      : Promise.resolve(0),

    empresaIds.length > 0
      ? supabase
          .from("diagnosticos")
          .select("id", { count: "exact", head: true })
          .in("empresa_id", empresaIds)
          .then((r) => r.count ?? 0)
      : Promise.resolve(0),
  ]);

  const pendenciasUrgentes = pendencias.filter(
    (p) => p.prioridade === "urgente" || p.prioridade === "alta"
  ).length;

  return {
    diagnosticos: diagCount,
    documentos: docCount,
    integracoesAtivas: intCount,
    pendenciasAbertas: pendencias.length,
    pendenciasUrgentes,
  };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 2 * 60 * 1000,
  });
}
