import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentoService } from "@/services/documentoService";
import type { TipoDocumento } from "@/types/documento";

export function useDocumentos(empresaId: string | undefined) {
  return useQuery({
    queryKey: ["documentos", empresaId],
    queryFn: () => documentoService.listByEmpresa(empresaId!),
    enabled: !!empresaId,
  });
}

export function useUploadDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      empresaId,
      file,
      tipo,
      competencia,
    }: {
      empresaId: string;
      file: File;
      tipo: TipoDocumento;
      competencia?: string;
    }) => documentoService.upload(empresaId, file, tipo, competencia),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documentos", variables.empresaId],
      });
    },
  });
}

export function useDeleteDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentoService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
  });
}
