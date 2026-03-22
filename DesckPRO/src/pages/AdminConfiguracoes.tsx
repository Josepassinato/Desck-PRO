import { useState, useEffect } from "react";
import { Save, Building2, Globe, Bell } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { formatCNPJ } from "@/utils/cnpj";

interface FirmData {
  id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string | null;
  email: string | null;
  telefone: string | null;
  endereco: Record<string, string> | null;
  config: Record<string, unknown>;
}

export function AdminConfiguracoes() {
  const { profile } = useAuth();
  const [firm, setFirm] = useState<FirmData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    razao_social: "",
    nome_fantasia: "",
    email: "",
    telefone: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  useEffect(() => {
    if (!profile?.accounting_firm_id) return;

    supabase
      .from("accounting_firms")
      .select("*")
      .eq("id", profile.accounting_firm_id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setIsLoading(false);
          return;
        }
        const f = data as FirmData;
        setFirm(f);
        setFormData({
          razao_social: f.razao_social ?? "",
          nome_fantasia: f.nome_fantasia ?? "",
          email: f.email ?? "",
          telefone: f.telefone ?? "",
          cep: f.endereco?.cep ?? "",
          logradouro: f.endereco?.logradouro ?? "",
          numero: f.endereco?.numero ?? "",
          complemento: f.endereco?.complemento ?? "",
          bairro: f.endereco?.bairro ?? "",
          cidade: f.endereco?.cidade ?? "",
          uf: f.endereco?.uf ?? "",
        });
        setIsLoading(false);
      });
  }, [profile?.accounting_firm_id]);

  const handleSave = async () => {
    if (!firm) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("accounting_firms")
        .update({
          razao_social: formData.razao_social,
          nome_fantasia: formData.nome_fantasia || null,
          email: formData.email || null,
          telefone: formData.telefone || null,
          endereco: {
            cep: formData.cep,
            logradouro: formData.logradouro,
            numero: formData.numero,
            complemento: formData.complemento,
            bairro: formData.bairro,
            cidade: formData.cidade,
            uf: formData.uf,
          },
        })
        .eq("id", firm.id);

      if (error) throw error;
      toast.success("Configuracoes salvas");
    } catch {
      toast.error("Erro ao salvar configuracoes");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuracoes</h1>
          <p className="text-muted-foreground">
            Dados do escritorio e preferencias do sistema
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <CardTitle>Dados do Escritorio</CardTitle>
          </div>
          <CardDescription>
            Informacoes cadastrais do escritorio contabil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CNPJ</Label>
              <Input
                value={firm?.cnpj ? formatCNPJ(firm.cnpj) : ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label>Razao Social</Label>
              <Input
                value={formData.razao_social}
                onChange={(e) => updateField("razao_social", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Nome Fantasia</Label>
              <Input
                value={formData.nome_fantasia}
                onChange={(e) => updateField("nome_fantasia", e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              value={formData.telefone}
              onChange={(e) => updateField("telefone", e.target.value)}
              className="w-64"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle>Endereco</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>CEP</Label>
              <Input
                value={formData.cep}
                onChange={(e) => updateField("cep", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Label>Logradouro</Label>
              <Input
                value={formData.logradouro}
                onChange={(e) => updateField("logradouro", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Numero</Label>
              <Input
                value={formData.numero}
                onChange={(e) => updateField("numero", e.target.value)}
              />
            </div>
            <div>
              <Label>Complemento</Label>
              <Input
                value={formData.complemento}
                onChange={(e) => updateField("complemento", e.target.value)}
              />
            </div>
            <div>
              <Label>Bairro</Label>
              <Input
                value={formData.bairro}
                onChange={(e) => updateField("bairro", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Cidade</Label>
                <Input
                  value={formData.cidade}
                  onChange={(e) => updateField("cidade", e.target.value)}
                />
              </div>
              <div>
                <Label>UF</Label>
                <Input
                  value={formData.uf}
                  onChange={(e) => updateField("uf", e.target.value)}
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Preferencias</CardTitle>
          </div>
          <CardDescription>
            Configuracoes de notificacao e comportamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Notificacoes por email
                </p>
                <p className="text-xs text-muted-foreground">
                  Receba alertas de pendencias e diagnosticos
                </p>
              </div>
              <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                Em breve
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Integracao ContaFlux automatica
                </p>
                <p className="text-xs text-muted-foreground">
                  Envie pacotes automaticamente ao classificar documentos
                </p>
              </div>
              <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                Em breve
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Backup automatico
                </p>
                <p className="text-xs text-muted-foreground">
                  Exporte dados periodicamente para seguranca
                </p>
              </div>
              <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                Em breve
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
