import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useEmpresaGlobal } from "@/contexts/EmpresaContext";

interface EmpresaSelectorProps {
  showLabel?: boolean;
  className?: string;
}

export function EmpresaSelector({ showLabel = false, className }: EmpresaSelectorProps) {
  const { data: empresas = [] } = useEmpresas();
  const { selectedEmpresaId, setEmpresa } = useEmpresaGlobal();

  const handleChange = (id: string) => {
    const emp = empresas.find((e) => e.id === id);
    setEmpresa(id, emp?.nome_fantasia || emp?.razao_social || "");
  };

  return (
    <div className={className}>
      {showLabel && <Label>Empresa</Label>}
      <Select value={selectedEmpresaId} onValueChange={handleChange}>
        <SelectTrigger className={showLabel ? "" : "w-[220px]"}>
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {empresas.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.nome_fantasia || e.razao_social}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
