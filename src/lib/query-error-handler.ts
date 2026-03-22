import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AuthSessionError, AuthorizationError } from "@/lib/auth-guard";

/**
 * Handler global de erros para React Query.
 * Detecta 401/403 e redireciona para login.
 */
export function handleQueryError(error: unknown): void {
  if (error instanceof AuthSessionError) {
    toast.error("Sessao expirada. Redirecionando para login...");
    supabase.auth.signOut().then(() => {
      window.location.href = "/login";
    });
    return;
  }

  if (error instanceof AuthorizationError) {
    toast.error(error.message || "Voce nao tem permissao para esta acao.");
    return;
  }

  // Supabase errors
  if (isSupabaseError(error)) {
    const status = error.status ?? error.code;

    if (status === 401 || status === "401" || error.message?.includes("JWT")) {
      toast.error("Sessao expirada. Faca login novamente.");
      supabase.auth.signOut().then(() => {
        window.location.href = "/login";
      });
      return;
    }

    if (status === 403 || status === "403") {
      toast.error("Voce nao tem permissao para acessar este recurso.");
      return;
    }

    if (status === 404 || status === "PGRST116") {
      // Record not found — usually not a user-facing error
      return;
    }
  }

  // Generic error — show message if available
  const message = error instanceof Error ? error.message : "Erro inesperado";
  toast.error(message);
}

function isSupabaseError(
  error: unknown
): error is { status?: number; code?: string; message?: string } {
  return typeof error === "object" && error !== null && "message" in error;
}
