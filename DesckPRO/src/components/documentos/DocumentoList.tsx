import { useState } from "react";
import {
  FileText,
  Download,
  Trash2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Documento, TipoDocumento, DocumentoStatus } from "@/types/documento";

const tipoDocLabels: Record<TipoDocumento, string> = {
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

const statusLabels: Record<DocumentoStatus, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
  processing: { label: "Processando", className: "bg-blue-100 text-blue-800" },
  classified: { label: "Classificado", className: "bg-green-100 text-green-800" },
  validated: { label: "Validado", className: "bg-emerald-100 text-emerald-800" },
  error: { label: "Erro", className: "bg-red-100 text-red-800" },
  sent_to_contaflux: { label: "Enviado", className: "bg-purple-100 text-purple-800" },
};

interface DocumentoListProps {
  documentos: Documento[];
  onDownload: (filePath: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function DocumentoList({
  documentos,
  onDownload,
  onDelete,
  isDeleting,
}: DocumentoListProps) {
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  const filtrados = documentos.filter((doc) => {
    const matchBusca = doc.nome.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === "todos" || doc.tipo === filtroTipo;
    return matchBusca && matchTipo;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>
              {filtrados.length} documento(s)
            </CardDescription>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              className="pl-8 h-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-48 h-9">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {Object.entries(tipoDocLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filtrados.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">Nenhum documento encontrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtrados.map((doc) => {
              const status = statusLabels[doc.status];
              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.nome}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {tipoDocLabels[doc.tipo]}
                      </span>
                      {doc.competencia && (
                        <span className="text-xs text-muted-foreground">
                          {doc.competencia}
                        </span>
                      )}
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${status.className}`}
                      >
                        {status.label}
                      </span>
                      {doc.file_size && (
                        <span className="text-xs text-muted-foreground">
                          {(doc.file_size / 1024).toFixed(0)} KB
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onDownload(doc.file_path)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => onDelete(doc.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
