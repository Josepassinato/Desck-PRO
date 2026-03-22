import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";

/**
 * Protege rotas que exigem role "admin".
 * Redireciona para / se não for admin.
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/**
 * Protege rotas que exigem role "accountant" ou "admin".
 * Redireciona clientes para /portal.
 */
export function StaffRoute({ children }: { children: React.ReactNode }) {
  const { isAccountant, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAccountant) {
    return <Navigate to="/portal" replace />;
  }

  return <>{children}</>;
}
