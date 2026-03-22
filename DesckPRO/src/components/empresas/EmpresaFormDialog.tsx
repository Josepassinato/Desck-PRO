import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCreateEmpresa } from "@/hooks/useEmpresas";
import { formatCNPJ, cleanCNPJ, validateCNPJ } from "@/utils/cnpj";
import { toast } from "sonner";
import type { RegimeTributario } from "@/types/empresa";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmpresaFormDialog({ open, onOpenChange }: Props) {
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [regime, setRegime] = useState<RegimeTributario>("simples_nacional");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnaePrincipal, setCnaePrincipal] = useState("");

  const createEmpresa = useCreateEmpresa();

  const resetForm = () => {
    setCnpj("");
    setRazaoSocial("");
    setNomeFantasia("");
    setRegime("simples_nacional");
    setEmail("");
    setTelefone("");
    setCnaePrincipal("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedCnpj = cleanCNPJ(cnpj);
    if (!validateCNPJ(cleanedCnpj)) {
      toast.error("CNPJ invalido");
      return;
    }

    if (!razaoSocial.trim()) {
      toast.error("Razao social e obrigatoria");
      return;
    }

    try {
      await createEmpresa.mutateAsync({
        cnpj: cleanedCnpj,
        razao_social: razaoSocial.trim(),
        nome_fantasia: nomeFantasia.trim() || undefined,
        regime_atual: regime,
        email: email.trim() || undefined,
        telefone: telefone.trim() || undefined,
        cnae_principal: cnaePrincipal.trim() || undefined,
      });
      toast.success("Empresa cadastrada com sucesso");
      resetForm();
      onOpenChange(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao cadastrar empresa";
      if (message.includes("duplicate")) {
        toast.error("CNPJ ja cadastrado neste escritorio");
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Empresa</DialogTitle>
          <DialogDescription>
            Cadastre uma empresa cliente para iniciar o diagnostico de migracao
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={cnpj}
                onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                maxLength={18}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regime">Regime Atual</Label>
              <Select
                value={regime}
                onValueChange={(v) => setRegime(v as RegimeTributario)}
              >
                <SelectTrigger id="regime">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples_nacional">
                    Simples Nacional
                  </SelectItem>
                  <SelectItem value="presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="real">Lucro Real</SelectItem>
                  <SelectItem value="mei">MEI</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="razao_social">Razao Social *</Label>
            <Input
              id="razao_social"
              placeholder="Razao social da empresa"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
            <Input
              id="nome_fantasia"
              placeholder="Nome fantasia (opcional)"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnae">CNAE Principal</Label>
            <Input
              id="cnae"
              placeholder="0000-0/00"
              value={cnaePrincipal}
              onChange={(e) => setCnaePrincipal(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createEmpresa.isPending}>
              {createEmpresa.isPending ? "Salvando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
