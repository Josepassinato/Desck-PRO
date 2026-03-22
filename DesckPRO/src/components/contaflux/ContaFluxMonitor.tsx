import {
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EnvioStatus } from "@/engine/contaflux/service";

const statusConfig: Record<
  EnvioStatus["status"],
  { label: string; icon: typeof Clock; className: string }
> = {
  pending: { label: "Pendente", icon: Clock, className: "text-yellow-600" },
  sending: { label: "Enviando", icon: RefreshCw, className: "text-blue-600 animate-spin" },
  sent: { label: "Enviado", icon: Send, className: "text-blue-600" },
  accepted: { label: "Aceito", icon: CheckCircle, className: "text-green-600" },
  rejected: { label: "Rejeitado", icon: XCircle, className: "text-red-600" },
  error: { label: "Erro", icon: AlertTriangle, className: "text-red-600" },
};

const tipoPacoteLabels: Record<string, string> = {
  notas_fiscais: "Notas Fiscais",
  movimentacoes_bancarias: "Mov. Bancarias",
  folha_pagamento: "Folha Pagamento",
  documentos: "Documentos",
  diagnostico: "Diagnostico",
  certificado: "Certificado",
};

interface ContaFluxMonitorProps {
  envios: EnvioStatus[];
  contagem: Record<string, number>;
  onReenviar: (envioId: string) => void;
  isLoading?: boolean;
}

export function ContaFluxMonitor({
  envios,
  contagem,
  onReenviar,
  isLoading,
}: ContaFluxMonitorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Pendentes"
          value={contagem["pending"] ?? 0}
          className="text-yellow-600 bg-yellow-50 border-yellow-200"
        />
        <StatCard
          label="Enviados"
          value={(contagem["sent"] ?? 0) + (contagem["sending"] ?? 0)}
          className="text-blue-600 bg-blue-50 border-blue-200"
        />
        <StatCard
          label="Aceitos"
          value={contagem["accepted"] ?? 0}
          className="text-green-600 bg-green-50 border-green-200"
        />
        <StatCard
          label="Erros"
          value={(contagem["error"] ?? 0) + (contagem["rejected"] ?? 0)}
          className="text-red-600 bg-red-50 border-red-200"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historico de Envios</CardTitle>
          <CardDescription>
            Ultimos pacotes enviados para ContaFlux
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Carregando...</p>
            </div>
          ) : envios.length === 0 ? (
            <div className="text-center py-8">
              <Send className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground mt-2">
                Nenhum envio registrado
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {envios.map((envio) => {
                const config = statusConfig[envio.status];
                const StatusIcon = config.icon;
                return (
                  <div
                    key={envio.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <StatusIcon className={`h-5 w-5 shrink-0 ${config.className}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {tipoPacoteLabels[envio.tipo_pacote] ?? envio.tipo_pacote}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {envio.competencia}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${
                            envio.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : envio.status === "error" || envio.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {config.label}
                        </span>
                        {envio.retry_count > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {envio.retry_count} tentativa(s)
                          </span>
                        )}
                        {envio.last_error && (
                          <span className="text-xs text-red-600 truncate">
                            {envio.last_error}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(envio.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    {(envio.status === "error" || envio.status === "rejected") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReenviar(envio.id)}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Reenviar
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <p className="text-xs">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
