import { Link } from "react-router-dom";
import {
  Building2,
  FileSearch,
  FileText,
  ArrowRightLeft,
  AlertTriangle,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export function Dashboard() {
  const { profile } = useAuth();
  const { data: empresas } = useEmpresas();
  const { data: stats } = useDashboardStats();

  const cards = [
    {
      title: "Empresas Ativas",
      value: empresas?.filter((e) => e.status === "active").length ?? 0,
      total: empresas?.length ?? 0,
      description: "Clientes cadastrados",
      icon: Building2,
      href: "/empresas",
      color: "text-blue-600",
    },
    {
      title: "Diagnosticos",
      value: stats?.diagnosticos ?? 0,
      description: "Avaliacoes realizadas",
      icon: FileSearch,
      href: "/diagnostico",
      color: "text-purple-600",
    },
    {
      title: "Documentos",
      value: stats?.documentos ?? 0,
      description: "Total no sistema",
      icon: FileText,
      href: "/documentos",
      color: "text-green-600",
    },
    {
      title: "Integracoes",
      value: stats?.integracoesAtivas ?? 0,
      description: "Conectores ativos",
      icon: ArrowRightLeft,
      href: "/integracoes",
      color: "text-amber-600",
    },
  ];

  const pendenciasAbertas = stats?.pendenciasAbertas ?? 0;
  const pendenciasUrgentes = stats?.pendenciasUrgentes ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo, {profile?.full_name ?? "Usuario"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} to={card.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <CardDescription>{card.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {pendenciasUrgentes > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">
                  {pendenciasUrgentes} pendencia(s) urgente(s)
                </p>
                <p className="text-sm text-orange-600">
                  Verifique as pendencias que precisam de atencao imediata
                </p>
              </div>
              <Link to="/pendencias" className="ml-auto">
                <Button variant="outline" size="sm">
                  Ver Pendencias
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {pendenciasAbertas > 0 && pendenciasUrgentes === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {pendenciasAbertas} pendencia(s) em aberto
                </p>
                <p className="text-sm text-muted-foreground">
                  Acompanhe o status das pendencias do escritorio
                </p>
              </div>
              <Link to="/pendencias" className="ml-auto">
                <Button variant="outline" size="sm">
                  Ver Pendencias
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {(!empresas || empresas.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Primeiros Passos
            </CardTitle>
            <CardDescription>
              Configure o DesckPRO para comecar a trabalhar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Cadastre seu escritorio em Configuracoes</li>
              <li>Adicione empresas clientes com CNPJ</li>
              <li>Conecte integracoes ERP (Bling, Omie, etc.)</li>
              <li>Execute o diagnostico de migracao fiscal</li>
              <li>Configure a ponte com ContaFlux para envio de dados</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
