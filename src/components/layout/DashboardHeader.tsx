import { LogOut, Menu, User, ChevronRight, Building2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useEmpresaGlobal } from "@/contexts/EmpresaContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { toast } from "sonner";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/empresas": "Empresas",
  "/diagnostico": "Diagnóstico",
  "/documentos": "Documentos",
  "/integracoes": "Integrações",
  "/bancario": "Bancário",
  "/contaflux": "ContaFlux",
  "/pendencias": "Pendências",
  "/relatorios": "Relatórios",
  "/admin/usuarios": "Usuários",
  "/admin/configuracoes": "Configurações",
  "/portal": "Portal do Cliente",
};

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export function DashboardHeader({ onToggleSidebar }: HeaderProps) {
  const { profile, signOut } = useAuth();
  const { selectedEmpresaNome } = useEmpresaGlobal();
  const location = useLocation();

  const currentLabel = ROUTE_LABELS[location.pathname] ?? "";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Sessão encerrada");
    } catch {
      toast.error("Erro ao encerrar sessão");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onToggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumbs */}
      <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
        <span>DesckPRO</span>
        {currentLabel && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{currentLabel}</span>
          </>
        )}
      </div>

      <div className="flex-1" />

      {/* Empresa selecionada */}
      {selectedEmpresaNome && (
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1.5 rounded-md">
          <Building2 className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{selectedEmpresaNome}</span>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={profile?.avatar_url ?? undefined}
                alt={profile?.full_name}
              />
              <AvatarFallback>
                {profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
