import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/pages/Dashboard";
import { Empresas } from "@/pages/Empresas";
import { Diagnostico } from "@/pages/Diagnostico";
import { Documentos } from "@/pages/Documentos";
import { Integracoes } from "@/pages/Integracoes";
import { Bancario } from "@/pages/Bancario";
import { ContaFlux } from "@/pages/ContaFlux";
import { Pendencias } from "@/pages/Pendencias";
import { Relatorios } from "@/pages/Relatorios";
import { AdminUsuarios } from "@/pages/AdminUsuarios";
import { AdminConfiguracoes } from "@/pages/AdminConfiguracoes";
import { ClientPortal } from "@/pages/ClientPortal";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function ClientRedirect({ children }: { children: React.ReactNode }) {
  const { isClient } = useAuth();
  if (isClient) return <Navigate to="/portal" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginForm />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <ClientRedirect>
              <Dashboard />
            </ClientRedirect>
          }
        />
        <Route path="portal" element={<ClientPortal />} />
        <Route path="empresas" element={<Empresas />} />
        <Route path="diagnostico" element={<Diagnostico />} />
        <Route path="documentos" element={<Documentos />} />
        <Route path="integracoes" element={<Integracoes />} />
        <Route path="bancario" element={<Bancario />} />
        <Route path="contaflux" element={<ContaFlux />} />
        <Route path="pendencias" element={<Pendencias />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="admin/usuarios" element={<AdminUsuarios />} />
        <Route path="admin/configuracoes" element={<AdminConfiguracoes />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
