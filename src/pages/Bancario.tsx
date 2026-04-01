import { useState } from "react";
import { Landmark } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmpresaSelector } from "@/components/EmpresaSelector";
import { ImportarOFX } from "@/components/bancario/ImportarOFX";
import {
  MovimentacoesList,
  type Movimentacao,
} from "@/components/bancario/MovimentacoesList";
import { useEmpresaGlobal } from "@/contexts/EmpresaContext";
import { categorizarTransacao } from "@/engine/bancario/parser-ofx";
import type { ExtratoOFX } from "@/engine/bancario/parser-ofx";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function Bancario() {
  const { selectedEmpresaId: empresaId } = useEmpresaGlobal();
  const [isImporting, setIsImporting] = useState(false);
  const queryClient = useQueryClient();

  const { data: movimentacoes = [] } = useQuery({
    queryKey: ["movimentacoes", empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("movimentacoes_bancarias")
        .select("*")
        .eq("empresa_id", empresaId)
        .order("data", { ascending: false })
        .limit(200);

      if (error) throw error;
      return (data ?? []) as Movimentacao[];
    },
    enabled: !!empresaId,
  });

  const handleImportar = async (extrato: ExtratoOFX) => {
    if (!empresaId) return;
    setIsImporting(true);

    try {
      const registros = extrato.transacoes.map((t) => {
        const cat = categorizarTransacao(t.descricao);
        return {
          empresa_id: empresaId,
          data: t.data,
          descricao: t.descricao,
          valor: t.valor,
          tipo: t.tipo,
          categoria: cat.categoria,
          referencia: t.referencia,
          origem: "ofx" as const,
          banco_codigo: extrato.banco_codigo,
          agencia: extrato.agencia,
          conta: extrato.conta,
        };
      });

      const { error } = await supabase
        .from("movimentacoes_bancarias")
        .insert(registros);

      if (error) throw error;

      toast.success(`${registros.length} movimentações importadas`);
      queryClient.invalidateQueries({ queryKey: ["movimentacoes", empresaId] });
    } catch {
      toast.error("Erro ao importar movimentacoes");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bancário</h1>
          <p className="text-muted-foreground">
            Importação de extratos e reconciliação operacional
          </p>
        </div>
        <EmpresaSelector />
      </div>

      {empresaId ? (
        <>
          <ImportarOFX
            empresaId={empresaId}
            onImportar={handleImportar}
            isImporting={isImporting}
          />
          <MovimentacoesList movimentacoes={movimentacoes} />
        </>
      ) : (
        <Card>
          <CardHeader className="text-center py-12">
            <Landmark className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <CardTitle className="text-base">Selecione uma empresa</CardTitle>
            <CardDescription>
              Escolha uma empresa acima para gerenciar extrato bancario
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
