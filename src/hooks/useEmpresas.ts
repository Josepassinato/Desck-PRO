import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { empresaService } from "@/services/empresaService";
import type { CreateEmpresaInput, UpdateEmpresaInput } from "@/types/empresa";

export function useEmpresas() {
  return useQuery({
    queryKey: ["empresas"],
    queryFn: empresaService.list,
  });
}

export function useEmpresa(id: string | undefined) {
  return useQuery({
    queryKey: ["empresas", id],
    queryFn: () => empresaService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEmpresaInput) => empresaService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
    },
  });
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEmpresaInput }) =>
      empresaService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
    },
  });
}

export function useDeleteEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => empresaService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
    },
  });
}
