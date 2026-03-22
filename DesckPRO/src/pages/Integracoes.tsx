import {
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ERP_PROVIDERS } from "@/types/integracao";
import type { IntegracaoStatus } from "@/types/integracao";

const statusConfig: Record<
  IntegracaoStatus,
  { icon: typeof CheckCircle; label: string; color: string }
> = {
  active: { icon: CheckCircle, label: "Ativo", color: "text-green-600" },
  pending: { icon: Clock, label: "Pendente", color: "text-amber-600" },
  error: { icon: XCircle, label: "Erro", color: "text-red-600" },
  disabled: { icon: XCircle, label: "Desativado", color: "text-gray-400" },
  expired: { icon: AlertTriangle, label: "Expirado", color: "text-red-600" },
};

export function Integracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integracoes ERP</h1>
        <p className="text-muted-foreground">
          Conecte os ERPs das empresas clientes para importar dados
          automaticamente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Conectores Disponiveis
          </CardTitle>
          <CardDescription>
            Selecione uma empresa e conecte o ERP para iniciar a importacao de
            dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ERP_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{provider.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {provider.descricao}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {provider.campos.length} campo(s) de credencial
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Conectar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conexoes Ativas</CardTitle>
          <CardDescription>
            Nenhuma empresa selecionada. Selecione uma empresa para ver suas
            integracoes.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export { statusConfig };
