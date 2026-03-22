import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import type { DadosEmpresaDiagnostico } from "@/engine/diagnostico";

interface Props {
  onExecutar: (dados: DadosEmpresaDiagnostico) => void;
  loading?: boolean;
}

const STEPS = [
  "Dados da Empresa",
  "Financeiro",
  "Operacional",
  "Documentos",
  "Pessoal",
  "Capacidade",
];

export function DiagnosticoWizard({ onExecutar, loading }: Props) {
  const [step, setStep] = useState(0);
  const [dados, setDados] = useState<DadosEmpresaDiagnostico>({
    cnpj: "",
    cnae_principal: null,
    cnaes_secundarios: [],
    regime_atual: "simples_nacional",
    faturamento_anual: null,
    receita_bruta_12m: null,
    custos_dedutiveis_12m: null,
    folha_pagamento_12m: null,
    creditos_pis_cofins_estimados: null,
    tem_erp: false,
    erp_nome: null,
    tem_plano_contas: false,
    tem_centro_custos: false,
    tem_certificado_digital: false,
    certificado_valido: false,
    certificado_vencimento: null,
    total_notas_12m: null,
    notas_com_xml: null,
    notas_sem_xml: null,
    meses_sem_movimentacao: 0,
    tem_extratos_bancarios: false,
    total_funcionarios: 0,
    custo_folha_mensal: null,
    tem_pro_labore: false,
    valor_pro_labore: null,
    tem_provisoes_trabalhistas: false,
    contador_experiencia_lucro_real: false,
    equipe_dedicada: false,
    prazo_desejado_migracao: null,
    motivacao_migracao: null,
  });

  const set = <K extends keyof DadosEmpresaDiagnostico>(
    key: K,
    value: DadosEmpresaDiagnostico[K]
  ) => setDados((prev) => ({ ...prev, [key]: value }));

  const numOrNull = (v: string) => (v ? Number(v) : null);
  const boolStr = (v: boolean) => (v ? "sim" : "nao");
  const strBool = (v: string) => v === "sim";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Diagnostico de Migracao</CardTitle>
            <CardDescription>
              Passo {step + 1} de {STEPS.length}: {STEPS[step]}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input value={dados.cnpj} onChange={(e) => set("cnpj", e.target.value)} placeholder="00.000.000/0000-00" />
            </div>
            <div className="space-y-2">
              <Label>CNAE Principal</Label>
              <Input value={dados.cnae_principal ?? ""} onChange={(e) => set("cnae_principal", e.target.value || null)} placeholder="0000-0/00" />
            </div>
            <div className="space-y-2">
              <Label>Regime Atual</Label>
              <Select value={dados.regime_atual} onValueChange={(v) => set("regime_atual", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                  <SelectItem value="presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="real">Lucro Real</SelectItem>
                  <SelectItem value="mei">MEI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Faturamento Anual (R$)</Label>
              <Input type="number" value={dados.faturamento_anual ?? ""} onChange={(e) => set("faturamento_anual", numOrNull(e.target.value))} placeholder="0" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Receita Bruta 12m (R$)</Label>
              <Input type="number" value={dados.receita_bruta_12m ?? ""} onChange={(e) => set("receita_bruta_12m", numOrNull(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Custos Dedutiveis 12m (R$)</Label>
              <Input type="number" value={dados.custos_dedutiveis_12m ?? ""} onChange={(e) => set("custos_dedutiveis_12m", numOrNull(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Folha Pagamento 12m (R$)</Label>
              <Input type="number" value={dados.folha_pagamento_12m ?? ""} onChange={(e) => set("folha_pagamento_12m", numOrNull(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Creditos PIS/COFINS estimados (R$)</Label>
              <Input type="number" value={dados.creditos_pis_cofins_estimados ?? ""} onChange={(e) => set("creditos_pis_cofins_estimados", numOrNull(e.target.value))} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Possui ERP?</Label>
              <Select value={boolStr(dados.tem_erp)} onValueChange={(v) => set("tem_erp", strBool(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Nao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dados.tem_erp && (
              <div className="space-y-2">
                <Label>Nome do ERP</Label>
                <Input value={dados.erp_nome ?? ""} onChange={(e) => set("erp_nome", e.target.value || null)} placeholder="Bling, Omie..." />
              </div>
            )}
            <div className="space-y-2">
              <Label>Plano de Contas?</Label>
              <Select value={boolStr(dados.tem_plano_contas)} onValueChange={(v) => set("tem_plano_contas", strBool(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Nao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Centro de Custos?</Label>
              <Select value={boolStr(dados.tem_centro_custos)} onValueChange={(v) => set("tem_centro_custos", strBool(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Nao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Certificado Digital?</Label>
              <Select value={boolStr(dados.tem_certificado_digital)} onValueChange={(v) => { set("tem_certificado_digital", strBool(v)); if (!strBool(v)) set("certificado_valido", false); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Nao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dados.tem_certificado_digital && (
              <div className="space-y-2">
                <Label>Certificado Valido?</Label>
                <Select value={boolStr(dados.certificado_valido)} onValueChange={(v) => set("certificado_valido", strBool(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Nao/Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Total Notas 12 meses</Label>
              <Input type="number" value={dados.total_notas_12m ?? ""} onChange={(e) => set("total_notas_12m", numOrNull(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Notas com XML</Label>
              <Input type="number" value={dados.notas_com_xml ?? ""} onChange={(e) => set("notas_com_xml", numOrNull(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Notas sem XML</Label>
              <Input type="number" value={dados.notas_sem_xml ?? ""} onChange={(e) => set("notas_sem_xml", numOrNull(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Meses sem movimentacao</Label>
              <Input type="number" value={dados.meses_sem_movimentacao} onChange={(e) => set("meses_sem_movimentacao", Number(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Extratos Bancarios?</Label>
              <Select value={boolStr(dados.tem_extratos_bancarios)} onValueChange={(v) => set("tem_extratos_bancarios", strBool(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Nao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Total Funcionarios</Label>
              <Input type="number" value={dados.total_funcionarios} onChange={(e) => set("total_funcionarios", Number(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Custo Folha Mensal (R$)</Label>
              <Input type="number" value={dados.custo_folha_mensal ?? ""} onChange={(e) => set("custo_folha_mensal", numOrNull(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Pro-labore?</Label>
              <Select value={boolStr(dados.tem_pro_labore)} onValueChange={(v) => set("tem_pro_labore", strBool(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Nao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dados.tem_pro_labore && (
              <div className="space-y-2">
                <Label>Valor Pro-labore (R$)</Label>
                <Input type="number" value={dados.valor_pro_labore ?? ""} onChange={(e) => set("valor_pro_labore", numOrNull(e.target.value))} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Provisoes Trabalhistas?</Label>
              <Select value={boolStr(dados.tem_provisoes_trabalhistas)} onValueChange={(v) => set("tem_provisoes_trabalhistas", strBool(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Nao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Contador tem experiencia com LR?</Label>
              <Select value={boolStr(dados.contador_experiencia_lucro_real)} onValueChange={(v) => set("contador_experiencia_lucro_real", strBool(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Nao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Equipe dedicada para migracao?</Label>
              <Select value={boolStr(dados.equipe_dedicada)} onValueChange={(v) => set("equipe_dedicada", strBool(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Nao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prazo desejado (meses)</Label>
              <Input type="number" value={dados.prazo_desejado_migracao ?? ""} onChange={(e) => set("prazo_desejado_migracao", numOrNull(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Motivacao da migracao</Label>
              <Input value={dados.motivacao_migracao ?? ""} onChange={(e) => set("motivacao_migracao", e.target.value || null)} placeholder="Ex: reducao tributaria, obrigacao legal..." />
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Proximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => onExecutar(dados)} disabled={loading}>
              <Play className="mr-2 h-4 w-4" />
              {loading ? "Executando..." : "Executar Diagnostico"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
