import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FileSearch,
  FileText,
  Landmark,
  Settings,
  Users,
  BarChart3,
  ArrowRightLeft,
  ClipboardList,
  Send,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["admin", "accountant"],
  },
  {
    label: "Empresas",
    href: "/empresas",
    icon: Building2,
    roles: ["admin", "accountant"],
  },
  {
    label: "Diagnostico",
    href: "/diagnostico",
    icon: FileSearch,
    roles: ["admin", "accountant"],
  },
  {
    label: "Documentos",
    href: "/documentos",
    icon: FileText,
    roles: ["admin", "accountant"],
  },
  {
    label: "Integracoes",
    href: "/integracoes",
    icon: ArrowRightLeft,
    roles: ["admin", "accountant"],
  },
  {
    label: "Bancario",
    href: "/bancario",
    icon: Landmark,
    roles: ["admin", "accountant"],
  },
  {
    label: "ContaFlux",
    href: "/contaflux",
    icon: Send,
    roles: ["admin", "accountant"],
  },
  {
    label: "Pendencias",
    href: "/pendencias",
    icon: ClipboardList,
    roles: ["admin", "accountant"],
  },
  {
    label: "Relatorios",
    href: "/relatorios",
    icon: BarChart3,
    roles: ["admin", "accountant"],
  },
] as const;

const clientItems = [
  {
    label: "Meu Portal",
    href: "/portal",
    icon: Home,
    roles: ["client"],
  },
  {
    label: "Pendencias",
    href: "/pendencias",
    icon: ClipboardList,
    roles: ["client"],
  },
] as const;

const adminItems = [
  {
    label: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Configuracoes",
    href: "/admin/configuracoes",
    icon: Settings,
    roles: ["admin"],
  },
] as const;

type NavItem =
  | (typeof navItems)[number]
  | (typeof adminItems)[number]
  | (typeof clientItems)[number];

interface SidebarProps {
  collapsed?: boolean;
}

export function DashboardSidebar({ collapsed = false }: SidebarProps) {
  const { profile, isAdmin, isClient } = useAuth();
  const location = useLocation();

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive =
      location.pathname === item.href ||
      (item.href !== "/" &&
        item.href !== "/portal" &&
        location.pathname.startsWith(item.href));

    return (
      <NavLink
        key={item.href}
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar h-screen sticky top-0 transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          D
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold tracking-tight">DesckPRO</span>
        )}
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 px-3 py-4">
        {isClient
          ? clientItems.map(renderNavItem)
          : navItems.map(renderNavItem)}

        {isAdmin && (
          <>
            <Separator className="my-3" />
            <p
              className={cn(
                "px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2",
                collapsed && "sr-only"
              )}
            >
              Admin
            </p>
            {adminItems.map(renderNavItem)}
          </>
        )}
      </nav>

      <div className="border-t px-3 py-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {profile?.full_name ?? "Usuario"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {profile?.role ?? ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
