import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { classificarDocumento } from "@/engine/documentos/classificador";
import type { TipoDocumento } from "@/types/documento";

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

interface ArquivoClassificado {
  file: File;
  tipoSugerido: TipoDocumento;
  confianca: number;
  motivo: string;
  tipoFinal: TipoDocumento;
  competencia: string;
}

interface DocumentoUploadProps {
  empresaId: string;
  onUpload: (
    files: { file: File; tipo: TipoDocumento; competencia?: string }[]
  ) => void;
  isUploading?: boolean;
}

export function DocumentoUpload({
  onUpload,
  isUploading,
}: DocumentoUploadProps) {
  const [arquivos, setArquivos] = useState<ArquivoClassificado[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const novos: ArquivoClassificado[] = Array.from(fileList).map((file) => {
      const classificacao = classificarDocumento(file.name, file.type);
      return {
        file,
        tipoSugerido: classificacao.tipo,
        confianca: classificacao.confianca,
        motivo: classificacao.motivo,
        tipoFinal: classificacao.tipo,
        competencia: "",
      };
    });

    setArquivos((prev) => [...prev, ...novos]);
  };

  const removerArquivo = (index: number) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
  };

  const atualizarTipo = (index: number, tipo: TipoDocumento) => {
    setArquivos((prev) =>
      prev.map((a, i) => (i === index ? { ...a, tipoFinal: tipo } : a))
    );
  };

  const atualizarCompetencia = (index: number, competencia: string) => {
    setArquivos((prev) =>
      prev.map((a, i) => (i === index ? { ...a, competencia } : a))
    );
  };

  const handleEnviar = () => {
    onUpload(
      arquivos.map((a) => ({
        file: a.file,
        tipo: a.tipoFinal,
        competencia: a.competencia || undefined,
      }))
    );
    setArquivos([]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Documentos</CardTitle>
        <CardDescription>
          Arraste arquivos ou clique para selecionar. A classificacao e
          automatica.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <Upload className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            XML, PDF, OFX, PFX e outros formatos
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {arquivos.length > 0 && (
          <div className="space-y-3">
            {arquivos.map((arq, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <FileText className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {arq.file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({(arq.file.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    {arq.confianca >= 0.7 ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                    )}
                    <span className="text-muted-foreground">{arq.motivo}</span>
                    <span className="text-muted-foreground">
                      ({Math.round(arq.confianca * 100)}%)
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-xs">Tipo</Label>
                      <Select
                        value={arq.tipoFinal}
                        onValueChange={(v) =>
                          atualizarTipo(index, v as TipoDocumento)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(tipoDocLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-32">
                      <Label className="text-xs">Competencia</Label>
                      <Input
                        type="month"
                        className="h-8 text-xs"
                        value={arq.competencia}
                        onChange={(e) =>
                          atualizarCompetencia(index, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => removerArquivo(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setArquivos([])}
              >
                Limpar
              </Button>
              <Button
                size="sm"
                onClick={handleEnviar}
                disabled={isUploading}
              >
                {isUploading ? "Enviando..." : `Enviar ${arquivos.length} arquivo(s)`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
