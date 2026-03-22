import { useState } from "react";
import {
  ArrowRightLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ERP_PROVIDERS } from "@/types/integracao";
import type { IntegracaoStatus, ERPProvider, ERPProviderInfo } from "@/types/integracao";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useIntegracoes, useCreateIntegracao, useDeleteIntegracao } from "@/hooks/useIntegracoes";
import { toast } from "sonner";

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
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<string>("");
  const [connectDialog, setConnectDialog] = useState<ERPProviderInfo | null>(null);
  const { data: empresas = [] } = useEmpresas();
  const { data: integracoes = [] } = useIntegracoes(selectedEmpresaId || undefined);
  const createIntegracao = useCreateIntegracao();
  const deleteIntegracao = useDeleteIntegracao();

  const handleDelete = async (id: string) => {
    try {
      await deleteIntegracao.mutateAsync(id);
      toast.success("Integracao removida");
    } catch {
      toast.error("Erro ao remover integracao");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integracoes ERP</h1>
        <p className="text-muted-foreground">
          Conecte os ERPs das empresas clientes para importar dados
          automaticamente
        </p>
      </div>

      <div className="max-w-sm">
        <Label>Empresa</Label>
        <Select value={selectedEmpresaId} onValueChange={setSelectedEmpresaId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent>
            {empresas.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.nome_fantasia || e.razao_social}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Conectores Disponiveis
          </CardTitle>
          <CardDescription>
            {selectedEmpresaId
              ? "Escolha um ERP para conectar"
              : "Selecione uma empresa acima para conectar um ERP"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ERP_PROVIDERS.map((provider) => {
              const isConnected = integracoes.some(
                (i) => i.provider === provider.id && i.status !== "disabled"
              );
              return (
                <div
                  key={provider.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{provider.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {provider.descricao}
                    </p>
                  </div>
                  {isConnected ? (
                    <span className="text-xs text-green-600 font-medium">
                      Conectado
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!selectedEmpresaId}
                      onClick={() => setConnectDialog(provider)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Conectar
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedEmpresaId && (
        <Card>
          <CardHeader>
            <CardTitle>Conexoes Ativas</CardTitle>
            <CardDescription>
              {integracoes.length === 0
                ? "Nenhuma integracao conectada para esta empresa"
                : `${integracoes.length} integracao(es) configurada(s)`}
            </CardDescription>
          </CardHeader>
          {integracoes.length > 0 && (
            <CardContent>
              <div className="space-y-2">
                {integracoes.map((integ) => {
                  const providerInfo = ERP_PROVIDERS.find(
                    (p) => p.id === integ.provider
                  );
                  const status = statusConfig[integ.status];
                  const StatusIcon = status.icon;

                  return (
                    <div
                      key={integ.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <StatusIcon
                        className={`h-4 w-4 shrink-0 ${status.color}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {providerInfo?.nome ?? integ.provider}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={status.color}>
                            {status.label}
                          </span>
                          {integ.last_sync_at && (
                            <span>
                              Ultimo sync:{" "}
                              {new Date(integ.last_sync_at).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          )}
                        </div>
                        {integ.last_sync_error && (
                          <p className="text-xs text-red-500 mt-1">
                            {integ.last_sync_error}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(integ.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {connectDialog && selectedEmpresaId && (
        <ConnectERPDialog
          provider={connectDialog}
          empresaId={selectedEmpresaId}
          open={!!connectDialog}
          onClose={() => setConnectDialog(null)}
          onCreate={createIntegracao}
        />
      )}
    </div>
  );
}

function ConnectERPDialog({
  provider,
  empresaId,
  open,
  onClose,
  onCreate,
}: {
  provider: ERPProviderInfo;
  empresaId: string;
  open: boolean;
  onClose: () => void;
  onCreate: ReturnType<typeof useCreateIntegracao>;
}) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valida campos obrigatórios
    const missing = provider.campos.filter(
      (c) => c.required && !credentials[c.key]?.trim()
    );
    if (missing.length > 0) {
      toast.error(`Preencha: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }

    setIsSaving(true);
    try {
      await onCreate.mutateAsync({
        empresaId,
        provider: provider.id,
        credentials,
      });
      toast.success(`${provider.nome} conectado com sucesso`);
      onClose();
    } catch {
      toast.error(`Erro ao conectar ${provider.nome}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conectar {provider.nome}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {provider.campos.map((campo) => (
            <div key={campo.key}>
              <Label>
                {campo.label}
                {campo.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                type={campo.type === "password" ? "password" : "text"}
                placeholder={campo.placeholder}
                value={credentials[campo.key] ?? ""}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    [campo.key]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            As credenciais sao criptografadas antes de serem armazenadas.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Conectando..." : "Conectar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { statusConfig };
