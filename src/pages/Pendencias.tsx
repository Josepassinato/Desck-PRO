import { useState } from "react";
import {
  ClipboardList,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Calendar,
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEmpresas } from "@/hooks/useEmpresas";
import { Pagination } from "@/components/ui/pagination";
import {
  usePendencias,
  usePendenciasCount,
  useCreatePendencia,
  useUpdatePendencia,
  useDeletePendencia,
} from "@/hooks/usePendencias";
import type {
  Pendencia,
  TipoPendencia,
  Prioridade,
  PendenciaStatus,
  CreatePendenciaInput,
} from "@/types/pendencia";
import {
  TIPO_PENDENCIA_LABELS,
  PRIORIDADE_LABELS,
  PRIORIDADE_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/types/pendencia";
import { toast } from "sonner";

export function Pendencias() {
  const [empresaFilter, setEmpresaFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("abertas");
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const { data: empresas } = useEmpresas();
  const { data: pendResult } = usePendencias(
    empresaFilter !== "all" ? empresaFilter : undefined,
    page,
    PAGE_SIZE
  );
  const pendencias = pendResult?.data ?? [];
  const totalPendencias = pendResult?.count ?? 0;
  const { data: contagem = {} } = usePendenciasCount();
  const createMutation = useCreatePendencia();
  const updateMutation = useUpdatePendencia();
  const deleteMutation = useDeletePendencia();

  const filtradas = pendencias.filter((p) => {
    const matchBusca =
      !busca || p.titulo.toLowerCase().includes(busca.toLowerCase());
    const matchStatus =
      statusFilter === "todas" ||
      (statusFilter === "abertas" &&
        (p.status === "aberta" || p.status === "em_andamento")) ||
      p.status === statusFilter;
    return matchBusca && matchStatus;
  });

  const handleStatusChange = async (id: string, status: PendenciaStatus) => {
    try {
      await updateMutation.mutateAsync({ id, input: { status } });
      toast.success(`Pendencia ${STATUS_LABELS[status].toLowerCase()}`);
    } catch {
      toast.error("Erro ao atualizar pendencia");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Pendencia removida");
    } catch {
      toast.error("Erro ao remover pendencia");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pendencias</h1>
          <p className="text-muted-foreground">
            Workflow de cobranca documental e gestao de tarefas
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Pendencia
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Abertas"
          value={(contagem["aberta"] ?? 0) + (contagem["em_andamento"] ?? 0)}
          icon={Clock}
          className="text-yellow-600 bg-yellow-50 border-yellow-200"
        />
        <StatCard
          label="Em Andamento"
          value={contagem["em_andamento"] ?? 0}
          icon={AlertTriangle}
          className="text-blue-600 bg-blue-50 border-blue-200"
        />
        <StatCard
          label="Resolvidas"
          value={contagem["resolvida"] ?? 0}
          icon={CheckCircle}
          className="text-green-600 bg-green-50 border-green-200"
        />
        <StatCard
          label="Canceladas"
          value={contagem["cancelada"] ?? 0}
          icon={XCircle}
          className="text-gray-600 bg-gray-50 border-gray-200"
        />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pendencias..."
            className="pl-8 h-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select value={empresaFilter} onValueChange={setEmpresaFilter}>
          <SelectTrigger className="w-48 h-9">
            <SelectValue placeholder="Empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as empresas</SelectItem>
            {empresas?.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.razao_social}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="abertas">Abertas</SelectItem>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="aberta">Aberta</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="resolvida">Resolvida</SelectItem>
            <SelectItem value="cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtradas.length === 0 ? (
        <Card>
          <CardHeader className="text-center py-12">
            <ClipboardList className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <CardTitle className="text-base">Nenhuma pendencia</CardTitle>
            <CardDescription>
              {busca
                ? "Nenhuma pendencia encontrada para a busca"
                : "Crie uma nova pendencia para comecar"}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtradas.map((p) => (
            <PendenciaCard
              key={p.id}
              pendencia={p}
              empresaNome={
                empresas?.find((e) => e.id === p.empresa_id)?.razao_social
              }
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={totalPendencias}
            onPageChange={setPage}
          />
        </div>
      )}

      <NovaPendenciaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        empresas={empresas ?? []}
        onCreate={async (input) => {
          try {
            await createMutation.mutateAsync(input);
            toast.success("Pendencia criada");
            setDialogOpen(false);
          } catch {
            toast.error("Erro ao criar pendencia");
          }
        }}
        isCreating={createMutation.isPending}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon: typeof Clock;
  className: string;
}) {
  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function PendenciaCard({
  pendencia,
  empresaNome,
  onStatusChange,
  onDelete,
}: {
  pendencia: Pendencia;
  empresaNome?: string;
  onStatusChange: (id: string, status: PendenciaStatus) => void;
  onDelete: (id: string) => void;
}) {
  const priorCls = PRIORIDADE_COLORS[pendencia.prioridade];
  const statusCls = STATUS_COLORS[pendencia.status];

  return (
    <Card>
      <CardContent className="flex items-start gap-3 py-3 px-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{pendencia.titulo}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${priorCls}`}>
              {PRIORIDADE_LABELS[pendencia.prioridade]}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusCls}`}>
              {STATUS_LABELS[pendencia.status]}
            </span>
          </div>
          {pendencia.descricao && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {pendencia.descricao}
            </p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            {empresaNome && <span>{empresaNome}</span>}
            <span>{TIPO_PENDENCIA_LABELS[pendencia.tipo]}</span>
            {pendencia.data_limite && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(pendencia.data_limite).toLocaleDateString("pt-BR")}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {pendencia.status === "aberta" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => onStatusChange(pendencia.id, "em_andamento")}
            >
              Iniciar
            </Button>
          )}
          {pendencia.status === "em_andamento" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-green-700"
              onClick={() => onStatusChange(pendencia.id, "resolvida")}
            >
              Resolver
            </Button>
          )}
          {(pendencia.status === "aberta" ||
            pendencia.status === "em_andamento") && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-muted-foreground"
              onClick={() => onStatusChange(pendencia.id, "cancelada")}
            >
              Cancelar
            </Button>
          )}
          {(pendencia.status === "resolvida" ||
            pendencia.status === "cancelada") && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-destructive"
              onClick={() => onDelete(pendencia.id)}
            >
              Excluir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NovaPendenciaDialog({
  open,
  onClose,
  empresas,
  onCreate,
  isCreating,
}: {
  open: boolean;
  onClose: () => void;
  empresas: { id: string; razao_social: string }[];
  onCreate: (input: CreatePendenciaInput) => void;
  isCreating: boolean;
}) {
  const [form, setForm] = useState<CreatePendenciaInput>({
    empresa_id: "",
    titulo: "",
    tipo: "documento_faltante",
    prioridade: "media",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.empresa_id || !form.titulo) return;
    onCreate(form);
    setForm({
      empresa_id: "",
      titulo: "",
      tipo: "documento_faltante",
      prioridade: "media",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Pendencia</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Empresa</Label>
            <Select
              value={form.empresa_id}
              onValueChange={(v) => setForm((f) => ({ ...f, empresa_id: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Titulo</Label>
            <Input
              value={form.titulo}
              onChange={(e) =>
                setForm((f) => ({ ...f, titulo: e.target.value }))
              }
              placeholder="Ex: Enviar balancete de janeiro"
            />
          </div>
          <div>
            <Label>Descricao</Label>
            <Input
              value={form.descricao ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, descricao: e.target.value }))
              }
              placeholder="Detalhes opcionais"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipo</Label>
              <Select
                value={form.tipo}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, tipo: v as TipoPendencia }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_PENDENCIA_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Prioridade</Label>
              <Select
                value={form.prioridade}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, prioridade: v as Prioridade }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORIDADE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Data Limite</Label>
            <Input
              type="date"
              value={form.data_limite ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, data_limite: e.target.value || undefined }))
              }
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !form.empresa_id || !form.titulo}
            >
              {isCreating ? "Criando..." : "Criar Pendencia"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
