import { Send } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmpresaSelector } from "@/components/EmpresaSelector";
import { ContaFluxMonitor } from "@/components/contaflux/ContaFluxMonitor";
import { useEmpresaGlobal } from "@/contexts/EmpresaContext";
import { contafluxService } from "@/engine/contaflux/service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function ContaFlux() {
  const { selectedEmpresaId: empresaId } = useEmpresaGlobal();
  const queryClient = useQueryClient();

  const { data: envios = [], isLoading: loadingEnvios } = useQuery({
    queryKey: ["contaflux-envios", empresaId],
    queryFn: () => contafluxService.listarEnvios(empresaId),
    enabled: !!empresaId,
  });

  const { data: contagem = {} } = useQuery({
    queryKey: ["contaflux-contagem", empresaId],
    queryFn: () => contafluxService.contarPorStatus(empresaId),
    enabled: !!empresaId,
  });

  const handleReenviar = async (envioId: string) => {
    try {
      await contafluxService.enviar(envioId);
      toast.success("Pacote reenviado");
      queryClient.invalidateQueries({ queryKey: ["contaflux-envios", empresaId] });
      queryClient.invalidateQueries({ queryKey: ["contaflux-contagem", empresaId] });
    } catch {
      toast.error("Erro ao reenviar pacote");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ContaFlux</h1>
          <p className="text-muted-foreground">
            Monitoramento de envios para o motor fiscal-contábil
          </p>
        </div>
        <EmpresaSelector />
      </div>

      {empresaId ? (
        <ContaFluxMonitor
          envios={envios}
          contagem={contagem}
          onReenviar={handleReenviar}
          isLoading={loadingEnvios}
        />
      ) : (
        <Card>
          <CardHeader className="text-center py-12">
            <Send className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <CardTitle className="text-base">Selecione uma empresa</CardTitle>
            <CardDescription>
              Escolha uma empresa para monitorar envios ContaFlux
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
