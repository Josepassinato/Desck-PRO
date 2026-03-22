import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pendenciaService } from "@/services/pendenciaService";
import type { CreatePendenciaInput, UpdatePendenciaInput } from "@/types/pendencia";

export function usePendencias(empresaId?: string, page = 0, pageSize = 50) {
  return useQuery({
    queryKey: ["pendencias", empresaId ?? "all", page, pageSize],
    queryFn: async () => {
      if (empresaId) {
        const data = await pendenciaService.listByEmpresa(empresaId);
        return { data, count: data.length };
      }
      return pendenciaService.listAll(page, pageSize);
    },
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
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
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
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
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
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
