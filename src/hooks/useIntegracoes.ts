import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integracaoService } from "@/services/integracaoService";
import type { ERPProvider } from "@/types/integracao";

export function useIntegracoes(empresaId: string | undefined) {
  return useQuery({
    queryKey: ["integracoes", empresaId],
    queryFn: () => integracaoService.listByEmpresa(empresaId!),
    enabled: !!empresaId,
  });
}

export function useCreateIntegracao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      empresaId,
      provider,
      credentials,
      config,
    }: {
      empresaId: string;
      provider: ERPProvider;
      credentials: Record<string, string>;
      config?: Record<string, unknown>;
    }) => integracaoService.create(empresaId, provider, credentials, config),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["integracoes", variables.empresaId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useDeleteIntegracao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => integracaoService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integracoes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
