import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { ResultadoDiagnostico } from "@/engine/diagnostico";
import type { ResultadoDimensao, ItemAvaliacao } from "@/engine/diagnostico/types";

interface Props {
  resultado: ResultadoDiagnostico;
  onVoltar: () => void;
}

const recomendacaoConfig = {
  recomendado: {
    cor: "bg-green-100 text-green-800 border-green-300",
    label: "Migracao Recomendada",
    icon: CheckCircle,
  },
  viavel_com_ressalvas: {
    cor: "bg-amber-100 text-amber-800 border-amber-300",
    label: "Viavel com Ressalvas",
    icon: AlertTriangle,
  },
  nao_recomendado: {
    cor: "bg-red-100 text-red-800 border-red-300",
    label: "Nao Recomendado",
    icon: XCircle,
  },
  inconclusivo: {
    cor: "bg-gray-100 text-gray-800 border-gray-300",
    label: "Inconclusivo",
    icon: Info,
  },
};

const nivelCores = {
  critico: "bg-red-500",
  baixo: "bg-orange-500",
  medio: "bg-amber-500",
  bom: "bg-blue-500",
  excelente: "bg-green-500",
};

const itemIcons = {
  aprovado: <CheckCircle className="h-4 w-4 text-green-600" />,
  reprovado: <XCircle className="h-4 w-4 text-red-600" />,
  alerta: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  info: <Info className="h-4 w-4 text-blue-600" />,
};

function ScoreBar({ label, score, nivel }: { label: string; score: number; nivel: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${nivelCores[nivel as keyof typeof nivelCores] ?? "bg-gray-400"}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function DimensaoDetalhe({ titulo, dimensao }: { titulo: string; dimensao: ResultadoDimensao }) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm flex items-center justify-between">
        {titulo}
        <span className={`text-xs px-2 py-0.5 rounded-full ${nivelCores[dimensao.nivel]} text-white`}>
          {dimensao.score} pts
        </span>
      </h4>
      <div className="space-y-2">
        {dimensao.itens.map((item: ItemAvaliacao, i: number) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            {itemIcons[item.resultado]}
            <div>
              <span className="font-medium">{item.criterio}</span>
              <p className="text-muted-foreground text-xs">{item.detalhe}</p>
            </div>
          </div>
        ))}
      </div>
      {dimensao.recomendacoes.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Recomendacoes:</p>
          {dimensao.recomendacoes.map((r, i) => (
            <p key={i} className="text-xs text-muted-foreground">• {r}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export function DiagnosticoResultado({ resultado, onVoltar }: Props) {
  const config = recomendacaoConfig[resultado.recomendacao];
  const Icon = config.icon;
  const sim = resultado.viabilidade_economica.simulacao;

  return (
    <div className="space-y-6">
      {/* Score geral */}
      <Card className={`border-2 ${config.cor}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="h-8 w-8" />
            <div>
              <CardTitle className="text-xl">{config.label}</CardTitle>
              <CardDescription className="text-current/70">
                Score geral: {resultado.score_geral}/100
              </CardDescription>
            </div>
            <div className="ml-auto text-4xl font-bold">{resultado.score_geral}</div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{resultado.resumo}</p>
        </CardContent>
      </Card>

      {/* Scores por dimensão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scores por Dimensao</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreBar label="Elegibilidade Legal" score={resultado.elegibilidade_legal.score} nivel={resultado.elegibilidade_legal.nivel} />
          <ScoreBar label="Viabilidade Economica" score={resultado.viabilidade_economica.score} nivel={resultado.viabilidade_economica.nivel} />
          <ScoreBar label="Prontidao Operacional" score={resultado.prontidao_operacional.score} nivel={resultado.prontidao_operacional.nivel} />
          <ScoreBar label="Qualidade Documental" score={resultado.qualidade_documental.score} nivel={resultado.qualidade_documental.nivel} />
          <ScoreBar label="Custos de Pessoal" score={resultado.custos_pessoal.score} nivel={resultado.custos_pessoal.nivel} />
          <ScoreBar label="Readiness" score={resultado.readiness.score} nivel={resultado.readiness.nivel} />
        </CardContent>
      </Card>

      {/* Simulação comparativa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Simulacao Comparativa (ESTIMATIVA)</CardTitle>
          <CardDescription>{sim.aviso}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-sm font-medium">{sim.regime_atual.nome}</p>
              <p className="text-2xl font-bold">
                R$ {(sim.regime_atual.tributos_estimados / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-muted-foreground">
                Aliquota efetiva: {sim.regime_atual.aliquota_efetiva.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <p className="text-sm font-medium">Lucro Real</p>
              <p className="text-2xl font-bold">
                R$ {(sim.lucro_real.tributos_estimados / 1000).toFixed(0)}k
              </p>
              <p className="text-xs text-muted-foreground">
                Aliquota efetiva: {sim.lucro_real.aliquota_efetiva.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            {sim.economia_estimada > 0 ? (
              <>
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">
                  Economia estimada: R$ {(sim.economia_estimada / 1000).toFixed(0)}k/ano
                  ({sim.economia_percentual}%)
                </span>
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 text-red-600" />
                <span className="text-red-700 font-medium">
                  Custo adicional estimado: R$ {(Math.abs(sim.economia_estimada) / 1000).toFixed(0)}k/ano
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes por dimensão */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalhamento por Dimensao</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DimensaoDetalhe titulo="1. Elegibilidade Legal" dimensao={resultado.elegibilidade_legal} />
          <Separator />
          <DimensaoDetalhe titulo="2. Viabilidade Economica" dimensao={resultado.viabilidade_economica} />
          <Separator />
          <DimensaoDetalhe titulo="3. Prontidao Operacional" dimensao={resultado.prontidao_operacional} />
          <Separator />
          <DimensaoDetalhe titulo="4. Qualidade Documental" dimensao={resultado.qualidade_documental} />
          <Separator />
          <DimensaoDetalhe titulo="5. Custos de Pessoal" dimensao={resultado.custos_pessoal} />
          <Separator />
          <DimensaoDetalhe titulo="6. Readiness" dimensao={resultado.readiness} />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onVoltar}>
          Voltar ao Formulario
        </Button>
      </div>
    </div>
  );
}
