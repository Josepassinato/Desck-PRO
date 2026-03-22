import {
  Building2,
  FileSearch,
  FileText,
  ArrowRightLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";

const stats = [
  {
    title: "Empresas Ativas",
    value: "0",
    description: "Clientes cadastrados",
    icon: Building2,
  },
  {
    title: "Diagnosticos",
    value: "0",
    description: "Avaliacoes realizadas",
    icon: FileSearch,
  },
  {
    title: "Documentos",
    value: "0",
    description: "Pendentes de envio",
    icon: FileText,
  },
  {
    title: "Integracoes",
    value: "0",
    description: "Conectores ativos",
    icon: ArrowRightLeft,
  },
];

export function Dashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo, {profile?.full_name ?? "Usuario"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <CardDescription>{stat.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Primeiros Passos</CardTitle>
          <CardDescription>
            Configure o DesckPRO para comecar a trabalhar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Cadastre seu escritorio e configure o perfil</li>
            <li>Adicione empresas clientes com CNPJ</li>
            <li>Conecte integracoes ERP (Bling, Omie, etc.)</li>
            <li>Execute o diagnostico de migracao fiscal</li>
            <li>Configure a ponte com ContaFlux para envio de dados</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
