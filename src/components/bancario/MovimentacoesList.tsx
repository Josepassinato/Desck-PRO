import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Movimentacao {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: "credito" | "debito";
  categoria: string | null;
  referencia: string | null;
  origem: string;
}

interface MovimentacoesListProps {
  movimentacoes: Movimentacao[];
}

export function MovimentacoesList({ movimentacoes }: MovimentacoesListProps) {
  if (movimentacoes.length === 0) {
    return (
      <Card>
        <CardHeader className="text-center py-12">
          <Landmark className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <CardTitle className="text-base">Sem movimentacoes</CardTitle>
          <CardDescription>
            Importe um extrato OFX para visualizar movimentacoes
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalCreditos = movimentacoes
    .filter((m) => m.tipo === "credito")
    .reduce((s, m) => s + m.valor, 0);
  const totalDebitos = movimentacoes
    .filter((m) => m.tipo === "debito")
    .reduce((s, m) => s + m.valor, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimentacoes Bancarias</CardTitle>
        <CardDescription>
          {movimentacoes.length} movimentacao(es) registrada(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-xs text-green-700">Total Creditos</p>
            <p className="text-lg font-bold text-green-700">
              R$ {totalCreditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-xs text-red-700">Total Debitos</p>
            <p className="text-lg font-bold text-red-700">
              R$ {totalDebitos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {movimentacoes.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-muted/30 text-sm"
            >
              {m.tipo === "credito" ? (
                <ArrowDownCircle className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <ArrowUpCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span className="text-xs text-muted-foreground w-20 shrink-0">
                {m.data}
              </span>
              <span className="flex-1 truncate">{m.descricao}</span>
              {m.categoria && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                  {m.categoria.replace(/_/g, " ")}
                </span>
              )}
              <span
                className={`font-medium tabular-nums shrink-0 ${
                  m.tipo === "credito" ? "text-green-700" : "text-red-700"
                }`}
              >
                {m.tipo === "debito" ? "-" : "+"}R${" "}
                {m.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
