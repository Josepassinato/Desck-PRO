import { useState } from "react";
import {
  BarChart3,
  Download,
  FileText,
  Building2,
  TrendingUp,
  ClipboardList,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useDocumentos } from "@/hooks/useDocumentos";
import { usePendencias, usePendenciasCount } from "@/hooks/usePendencias";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function Relatorios() {
  const [empresaId, setEmpresaId] = useState<string>("all");
  const { data: empresas = [] } = useEmpresas();
  const selectedEmpresaId = empresaId !== "all" ? empresaId : undefined;

  const { data: documentosResult } = useDocumentos(selectedEmpresaId);
  const documentos = documentosResult?.data ?? [];
  const { data: pendenciasResult } = usePendencias(selectedEmpresaId);
  const pendencias = pendenciasResult?.data ?? [];
  const { data: contagemPendencias = {} } = usePendenciasCount();

  const { data: diagnosticos = [] } = useQuery({
    queryKey: ["relatorio-diagnosticos", empresaId],
    queryFn: async () => {
      let query = supabase.from("diagnosticos").select("*");
      if (selectedEmpresaId) {
        query = query.eq("empresa_id", selectedEmpresaId);
      }
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: movimentacoes = [] } = useQuery({
    queryKey: ["relatorio-movimentacoes", empresaId],
    queryFn: async () => {
      let query = supabase.from("movimentacoes_bancarias").select("*");
      if (selectedEmpresaId) {
        query = query.eq("empresa_id", selectedEmpresaId);
      }
      const { data, error } = await query.limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Stats
  const totalEmpresas = empresas.length;
  const totalDocumentos = documentos.length;
  const pendenciasAbertas =
    (contagemPendencias["aberta"] ?? 0) + (contagemPendencias["em_andamento"] ?? 0);
  const totalDiagnosticos = diagnosticos.length;

  const docsPorTipo: Record<string, number> = {};
  for (const doc of documentos) {
    docsPorTipo[doc.tipo] = (docsPorTipo[doc.tipo] ?? 0) + 1;
  }

  const pendPorPrioridade: Record<string, number> = {};
  for (const p of pendencias) {
    if (p.status === "aberta" || p.status === "em_andamento") {
      pendPorPrioridade[p.prioridade] = (pendPorPrioridade[p.prioridade] ?? 0) + 1;
    }
  }

  const totalCreditos = movimentacoes
    .filter((m: { tipo: string }) => m.tipo === "credito")
    .reduce((s: number, m: { valor: number }) => s + m.valor, 0);
  const totalDebitos = movimentacoes
    .filter((m: { tipo: string }) => m.tipo === "debito")
    .reduce((s: number, m: { valor: number }) => s + m.valor, 0);

  const diagRecomendacoes: Record<string, number> = {};
  for (const d of diagnosticos) {
    const rec = d.recomendacao ?? "sem_recomendacao";
    diagRecomendacoes[rec] = (diagRecomendacoes[rec] ?? 0) + 1;
  }

  const handleExportCSV = () => {
    const linhas = [
      "Tipo,Metrica,Valor",
      `Empresas,Total,${totalEmpresas}`,
      `Documentos,Total,${totalDocumentos}`,
      ...Object.entries(docsPorTipo).map(
        ([tipo, count]) => `Documentos,${tipo},${count}`
      ),
      `Pendencias,Abertas,${pendenciasAbertas}`,
      ...Object.entries(pendPorPrioridade).map(
        ([prio, count]) => `Pendencias,${prio},${count}`
      ),
      `Diagnosticos,Total,${totalDiagnosticos}`,
      ...Object.entries(diagRecomendacoes).map(
        ([rec, count]) => `Diagnosticos,${rec},${count}`
      ),
      `Bancario,Creditos,${totalCreditos.toFixed(2)}`,
      `Bancario,Debitos,${totalDebitos.toFixed(2)}`,
    ];

    const csv = linhas.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-desckpro-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatorios</h1>
          <p className="text-muted-foreground">
            Visao consolidada e exportacao de dados
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={empresaId} onValueChange={setEmpresaId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filtrar empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as empresas</SelectItem>
              {empresas.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.razao_social}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={Building2}
          label="Empresas"
          value={totalEmpresas}
          desc="cadastradas"
        />
        <SummaryCard
          icon={FileText}
          label="Documentos"
          value={totalDocumentos}
          desc="capturados"
        />
        <SummaryCard
          icon={ClipboardList}
          label="Pendencias"
          value={pendenciasAbertas}
          desc="abertas"
        />
        <SummaryCard
          icon={TrendingUp}
          label="Diagnosticos"
          value={totalDiagnosticos}
          desc="realizados"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documentos por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(docsPorTipo).length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(docsPorTipo)
                  .sort(([, a], [, b]) => b - a)
                  .map(([tipo, count]) => {
                    const pct = totalDocumentos > 0 ? (count / totalDocumentos) * 100 : 0;
                    return (
                      <div key={tipo} className="flex items-center gap-3">
                        <span className="text-xs w-28 text-muted-foreground truncate">
                          {tipo.replace(/_/g, " ")}
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pendencias por Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(pendPorPrioridade).length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem pendencias abertas</p>
            ) : (
              <div className="space-y-3">
                {(["urgente", "alta", "media", "baixa"] as const).map((prio) => {
                  const count = pendPorPrioridade[prio] ?? 0;
                  if (count === 0) return null;
                  const colors: Record<string, string> = {
                    urgente: "bg-red-500",
                    alta: "bg-orange-500",
                    media: "bg-blue-500",
                    baixa: "bg-slate-400",
                  };
                  return (
                    <div key={prio} className="flex items-center gap-3">
                      <span className="text-xs w-20 capitalize">{prio}</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className={`${colors[prio]} rounded-full h-2`}
                          style={{
                            width: `${Math.min(100, (count / Math.max(pendenciasAbertas, 1)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Diagnosticos — Recomendacoes</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(diagRecomendacoes).length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem diagnosticos</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(diagRecomendacoes).map(([rec, count]) => {
                  const labels: Record<string, string> = {
                    fortemente_recomendado: "Fortemente Recomendado",
                    recomendado_com_ressalvas: "Recomendado c/ Ressalvas",
                    neutro: "Neutro",
                    nao_recomendado: "Nao Recomendado",
                    sem_recomendacao: "Sem Recomendacao",
                  };
                  return (
                    <div key={rec} className="flex items-center justify-between">
                      <span className="text-sm">
                        {labels[rec] ?? rec}
                      </span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              Resumo Bancario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Total Creditos</span>
                <span className="text-sm font-bold text-green-700">
                  R$ {totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">Total Debitos</span>
                <span className="text-sm font-bold text-red-700">
                  R$ {totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="text-sm font-medium">Saldo</span>
                <span
                  className={`text-sm font-bold ${
                    totalCreditos - totalDebitos >= 0
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  R${" "}
                  {(totalCreditos - totalDebitos).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {movimentacoes.length} movimentacao(es)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  desc,
}: {
  icon: typeof BarChart3;
  label: string;
  value: number;
  desc: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">
              {label} {desc}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
