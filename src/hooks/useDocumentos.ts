import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentoService } from "@/services/documentoService";
import type { TipoDocumento } from "@/types/documento";

export function useDocumentos(empresaId: string | undefined, page = 0, pageSize = 50) {
  return useQuery({
    queryKey: ["documentos", empresaId, page, pageSize],
    queryFn: () => documentoService.listByEmpresa(empresaId!, page, pageSize),
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
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useDeleteDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentoService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
