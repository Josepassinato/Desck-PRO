import {
  FileText,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/lib/supabase";
import { documentoService } from "@/services/documentoService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Documento } from "@/types/documento";
import type { Pendencia } from "@/types/pendencia";
import {
  TIPO_PENDENCIA_LABELS,
  PRIORIDADE_LABELS,
  PRIORIDADE_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/types/pendencia";

export function ClientPortal() {
  const { profile } = useAuth();

  const firmId = profile?.accounting_firm_id;

  // Client sees only empresas from their firm
  const { data: empresas = [] } = useQuery({
    queryKey: ["client-empresas", firmId],
    queryFn: async () => {
      if (!firmId) return [];
      const { data, error } = await supabase
        .from("empresas")
        .select("id, razao_social, cnpj, regime_atual, status")
        .eq("accounting_firm_id", firmId)
        .order("razao_social");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!firmId,
  });

  const empresaIds = empresas.map((e) => e.id);

  const { data: pendencias = [] } = useQuery({
    queryKey: ["client-pendencias", firmId],
    queryFn: async () => {
      if (!firmId || empresaIds.length === 0) return [];
      const { data, error } = await supabase
        .from("pendencias")
        .select("*")
        .eq("accounting_firm_id", firmId)
        .in("status", ["aberta", "em_andamento"])
        .order("prioridade")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Pendencia[];
    },
    enabled: !!firmId && empresaIds.length > 0,
  });

  const { data: documentos = [] } = useQuery({
    queryKey: ["client-documentos", firmId],
    queryFn: async () => {
      if (!firmId || empresaIds.length === 0) return [];
      const { data, error } = await supabase
        .from("documentos")
        .select("*")
        .in("empresa_id", empresaIds)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as Documento[];
    },
    enabled: !!firmId && empresaIds.length > 0,
  });

  const handleDownload = async (filePath: string) => {
    try {
      const url = await documentoService.getDownloadUrl(filePath);
      window.open(url, "_blank");
    } catch {
      toast.error("Erro ao baixar documento");
    }
  };

  const pendenciasUrgentes = pendencias.filter(
    (p) => p.prioridade === "urgente" || p.prioridade === "alta"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo, {profile?.full_name?.split(" ")[0] ?? "Cliente"}
        </h1>
        <p className="text-muted-foreground">
          Portal do Cliente — acompanhe documentos e pendencias
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{empresas.length}</p>
                <p className="text-xs text-muted-foreground">Empresa(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <ClipboardList className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendencias.length}</p>
                <p className="text-xs text-muted-foreground">
                  Pendencia(s) abertas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{documentos.length}</p>
                <p className="text-xs text-muted-foreground">Documentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {pendenciasUrgentes.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-base text-orange-800">
                Atencao — Pendencias Urgentes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendenciasUrgentes.map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-sm">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      PRIORIDADE_COLORS[p.prioridade]
                    }`}
                  >
                    {PRIORIDADE_LABELS[p.prioridade]}
                  </span>
                  <span className="font-medium">{p.titulo}</span>
                  {p.data_limite && (
                    <span className="text-xs text-muted-foreground">
                      Prazo:{" "}
                      {new Date(p.data_limite).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pendencias</CardTitle>
          <CardDescription>
            Itens que precisam da sua atencao
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendencias.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-10 w-10 text-green-500/50" />
              <p className="text-sm text-muted-foreground mt-2">
                Nenhuma pendencia em aberto
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendencias.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{p.titulo}</p>
                    {p.descricao && (
                      <p className="text-xs text-muted-foreground truncate">
                        {p.descricao}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {TIPO_PENDENCIA_LABELS[p.tipo]}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          STATUS_COLORS[p.status]
                        }`}
                      >
                        {STATUS_LABELS[p.status]}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${
                      PRIORIDADE_COLORS[p.prioridade]
                    }`}
                  >
                    {PRIORIDADE_LABELS[p.prioridade]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentos Recentes</CardTitle>
          <CardDescription>
            Ultimos documentos processados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground mt-2">
                Nenhum documento
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {documentos.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/30"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{d.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.tipo.replace(/_/g, " ")} — {d.competencia ?? "sem competencia"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDownload(d.file_path)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
