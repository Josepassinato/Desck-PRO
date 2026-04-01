import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MoreHorizontal,
  FileSearch,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEmpresas, useDeleteEmpresa } from "@/hooks/useEmpresas";
import { EmpresaFormDialog } from "@/components/empresas/EmpresaFormDialog";
import { formatCNPJ } from "@/utils/cnpj";
import { toast } from "sonner";
import type { Empresa } from "@/types/empresa";

const regimeLabels: Record<string, string> = {
  simples_nacional: "Simples Nacional",
  presumido: "Lucro Presumido",
  real: "Lucro Real",
  mei: "MEI",
  outro: "Outro",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  prospecting: "bg-blue-100 text-blue-800",
  migrating: "bg-amber-100 text-amber-800",
};

export function Empresas() {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: empresas, isLoading } = useEmpresas();
  const deleteEmpresa = useDeleteEmpresa();

  const filtered = empresas?.filter(
    (e) =>
      !searchQuery ||
      e.razao_social.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.cnpj.includes(searchQuery) ||
      e.nome_fantasia?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (empresa: Empresa) => {
    try {
      await deleteEmpresa.mutateAsync(empresa.id);
      toast.success(`${empresa.razao_social} removida`);
    } catch {
      toast.error("Erro ao remover empresa");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            {empresas?.length ?? 0} empresas cadastradas
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      {empresas && empresas.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CNPJ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-sm"
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !empresas || empresas.length === 0 ? (
        <Card>
          <CardHeader className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <CardTitle className="text-lg">
              Nenhuma empresa cadastrada
            </CardTitle>
            <CardDescription>
              Adicione a primeira empresa cliente para comecar o diagnostico
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button variant="outline" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Cadastrar Empresa
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((empresa) => (
            <Card key={empresa.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <CardTitle className="text-base truncate">
                      {empresa.nome_fantasia || empresa.razao_social}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">
                      {formatCNPJ(empresa.cnpj)}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FileSearch className="mr-2 h-4 w-4" />
                        Diagnosticar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(empresa)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remover
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      statusColors[empresa.status] ?? "bg-gray-100"
                    }`}
                  >
                    {empresa.status === "active" ? "Ativa" : empresa.status === "inactive" ? "Inativa" : empresa.status === "prospecting" ? "Prospecção" : empresa.status === "migrating" ? "Migrando" : empresa.status}
                  </span>
                  <span className="text-muted-foreground">
                    {regimeLabels[empresa.regime_atual] ?? empresa.regime_atual}
                  </span>
                </div>
                {empresa.cnae_principal && (
                  <p className="text-xs text-muted-foreground">
                    CNAE: {empresa.cnae_principal}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <EmpresaFormDialog open={showForm} onOpenChange={setShowForm} />
    </div>
  );
}
