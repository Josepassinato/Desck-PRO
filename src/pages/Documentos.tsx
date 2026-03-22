import { useState } from "react";
import { FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentoUpload } from "@/components/documentos/DocumentoUpload";
import { DocumentoList } from "@/components/documentos/DocumentoList";
import { Pagination } from "@/components/ui/pagination";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useDocumentos, useUploadDocumento, useDeleteDocumento } from "@/hooks/useDocumentos";
import { documentoService } from "@/services/documentoService";
import type { TipoDocumento } from "@/types/documento";
import { toast } from "sonner";

const tipoDocLabels: Record<string, string> = {
  nfe: "NF-e",
  nfse: "NFS-e",
  cte: "CT-e",
  extrato_bancario: "Extrato Bancario",
  folha_pagamento: "Folha de Pagamento",
  balancete: "Balancete",
  darf: "DARF",
  das: "DAS",
  contrato: "Contrato",
  procuracao: "Procuracao",
  certificado_digital: "Certificado Digital",
  outro: "Outro",
};

export function Documentos() {
  const [empresaId, setEmpresaId] = useState<string>("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;
  const { data: empresas } = useEmpresas();
  const { data: docResult } = useDocumentos(empresaId || undefined, page, PAGE_SIZE);
  const documentos = docResult?.data ?? [];
  const totalDocs = docResult?.count ?? 0;
  const uploadMutation = useUploadDocumento();
  const deleteMutation = useDeleteDocumento();

  const handleUpload = async (
    files: { file: File; tipo: TipoDocumento; competencia?: string }[]
  ) => {
    if (!empresaId) {
      toast.error("Selecione uma empresa primeiro");
      return;
    }

    for (const { file, tipo, competencia } of files) {
      try {
        await uploadMutation.mutateAsync({
          empresaId,
          file,
          tipo,
          competencia,
        });
      } catch {
        toast.error(`Erro ao enviar ${file.name}`);
        return;
      }
    }
    toast.success(`${files.length} documento(s) enviado(s)`);
  };

  const handleDownload = async (filePath: string) => {
    try {
      const url = await documentoService.getDownloadUrl(filePath);
      window.open(url, "_blank");
    } catch {
      toast.error("Erro ao gerar link de download");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Documento removido");
    } catch {
      toast.error("Erro ao remover documento");
    }
  };

  const contagemPorTipo: Record<string, number> = {};
  for (const doc of documentos) {
    contagemPorTipo[doc.tipo] = (contagemPorTipo[doc.tipo] ?? 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">
            Captura, classificacao automatica e gestao de documentos fiscais
          </p>
        </div>
        <Select value={empresaId} onValueChange={setEmpresaId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent>
            {empresas?.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.razao_social}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Object.entries(tipoDocLabels).map(([key, label]) => (
          <Card key={key} className="text-center">
            <CardHeader className="pb-1 pt-3 px-2">
              <FileText className="mx-auto h-6 w-6 text-muted-foreground/50" />
              <CardTitle className="text-xs">{label}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 px-2">
              <p className="text-xl font-bold">{contagemPorTipo[key] ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {empresaId ? (
        <>
          <DocumentoUpload
            empresaId={empresaId}
            onUpload={handleUpload}
            isUploading={uploadMutation.isPending}
          />
          <DocumentoList
            documentos={documentos}
            onDownload={handleDownload}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={totalDocs}
            onPageChange={setPage}
          />
        </>
      ) : (
        <Card>
          <CardHeader className="text-center py-12">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <CardTitle className="text-base">Selecione uma empresa</CardTitle>
            <CardDescription>
              Escolha uma empresa acima para gerenciar seus documentos
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
