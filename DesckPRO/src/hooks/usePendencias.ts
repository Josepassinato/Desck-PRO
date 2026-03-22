import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pendenciaService } from "@/services/pendenciaService";
import type { CreatePendenciaInput, UpdatePendenciaInput } from "@/types/pendencia";

export function usePendencias(empresaId?: string) {
  return useQuery({
    queryKey: ["pendencias", empresaId ?? "all"],
    queryFn: () =>
      empresaId
        ? pendenciaService.listByEmpresa(empresaId)
        : pendenciaService.listAll(),
  });
}

export function usePendenciasCount() {
  return useQuery({
    queryKey: ["pendencias-count"],
    queryFn: () => pendenciaService.countByStatus(),
  });
}

export function useCreatePendencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePendenciaInput) => pendenciaService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendencias"] });
      queryClient.invalidateQueries({ queryKey: ["pendencias-count"] });
    },
  });
}

export function useUpdatePendencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePendenciaInput }) =>
      pendenciaService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendencias"] });
      queryClient.invalidateQueries({ queryKey: ["pendencias-count"] });
    },
  });
}

export function useDeletePendencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pendenciaService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendencias"] });
      queryClient.invalidateQueries({ queryKey: ["pendencias-count"] });
    },
  });
}
