import { useState, useRef } from "react";
import {
  Landmark,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseOFX, categorizarTransacao } from "@/engine/bancario/parser-ofx";
import type { ExtratoOFX, TransacaoOFX } from "@/engine/bancario/parser-ofx";

interface TransacaoComCategoria extends TransacaoOFX {
  categoria: string;
  confianca: number;
}

interface ImportarOFXProps {
  empresaId: string;
  onImportar: (extrato: ExtratoOFX) => void;
  isImporting?: boolean;
}

export function ImportarOFX({
  onImportar,
  isImporting,
}: ImportarOFXProps) {
  const [extrato, setExtrato] = useState<ExtratoOFX | null>(null);
  const [transacoes, setTransacoes] = useState<TransacaoComCategoria[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErro(null);
    try {
      const conteudo = await file.text();
      const parsed = parseOFX(conteudo);

      if (parsed.transacoes.length === 0) {
        setErro("Nenhuma transacao encontrada no arquivo OFX.");
        return;
      }

      setExtrato(parsed);
      setTransacoes(
        parsed.transacoes.map((t) => {
          const cat = categorizarTransacao(t.descricao);
          return { ...t, categoria: cat.categoria, confianca: cat.confianca };
        })
      );
    } catch {
      setErro("Erro ao processar arquivo. Verifique se e um OFX valido.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConfirmar = () => {
    if (extrato) {
      onImportar(extrato);
      setExtrato(null);
      setTransacoes([]);
    }
  };

  const totalCreditos = transacoes
    .filter((t) => t.tipo === "credito")
    .reduce((s, t) => s + t.valor, 0);

  const totalDebitos = transacoes
    .filter((t) => t.tipo === "debito")
    .reduce((s, t) => s + t.valor, 0);

  return (
    <div className="space-y-4">
      {!extrato && (
        <Card>
          <CardHeader>
            <CardTitle>Importar Extrato OFX</CardTitle>
            <CardDescription>
              Selecione um arquivo OFX/OFC do seu banco para importar
              movimentacoes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Landmark className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Arraste um arquivo OFX ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Formatos aceitos: .ofx, .ofc
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".ofx,.ofc"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
            {erro && (
              <p className="text-sm text-destructive mt-3">{erro}</p>
            )}
          </CardContent>
        </Card>
      )}

      {extrato && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Extrato</CardTitle>
              <CardDescription>
                Revise as informacoes antes de importar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Banco</p>
                  <p className="text-sm font-medium">
                    {extrato.banco_codigo ?? "N/I"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conta</p>
                  <p className="text-sm font-medium">
                    {extrato.agencia ?? "—"} / {extrato.conta ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Periodo</p>
                  <p className="text-sm font-medium">
                    {extrato.data_inicio ?? "?"} a {extrato.data_fim ?? "?"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Transacoes</p>
                  <p className="text-sm font-medium">{transacoes.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-1.5">
                    <ArrowDownCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-700">Creditos</span>
                  </div>
                  <p className="text-lg font-bold text-green-700 mt-1">
                    R$ {totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center gap-1.5">
                    <ArrowUpCircle className="h-4 w-4 text-red-600" />
                    <span className="text-xs text-red-700">Debitos</span>
                  </div>
                  <p className="text-lg font-bold text-red-700 mt-1">
                    R$ {totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-1.5">
                    <Landmark className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-blue-700">Saldo Final</span>
                  </div>
                  <p className="text-lg font-bold text-blue-700 mt-1">
                    {extrato.saldo_final != null
                      ? `R$ ${extrato.saldo_final.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      : "N/I"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Transacoes ({transacoes.length})
              </CardTitle>
              <CardDescription>
                Categorias sugeridas automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {transacoes.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted/30 text-sm"
                  >
                    {t.tipo === "credito" ? (
                      <ArrowDownCircle className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <ArrowUpCircle className="h-4 w-4 text-red-600 shrink-0" />
                    )}
                    <span className="text-xs text-muted-foreground w-20 shrink-0">
                      {t.data}
                    </span>
                    <span className="flex-1 truncate">{t.descricao}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                      {t.categoria.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`font-medium tabular-nums shrink-0 ${
                        t.tipo === "credito" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {t.tipo === "debito" ? "-" : "+"}R${" "}
                      {t.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setExtrato(null);
                    setTransacoes([]);
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleConfirmar} disabled={isImporting}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isImporting
                    ? "Importando..."
                    : `Importar ${transacoes.length} transacoes`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
