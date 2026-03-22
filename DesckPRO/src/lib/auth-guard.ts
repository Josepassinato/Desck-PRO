import { supabase } from "@/lib/supabase";

/**
 * Retorna o accounting_firm_id do usuário autenticado.
 * Lança erro se não estiver vinculado a um escritório.
 */
export async function requireFirmId(): Promise<string> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthSessionError("Sessao expirada. Faca login novamente.");
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("accounting_firm_id, role")
    .eq("id", user.id)
    .single();

  if (error || !profile?.accounting_firm_id) {
    throw new Error("Usuario nao vinculado a um escritorio.");
  }

  return profile.accounting_firm_id;
}

/**
 * Verifica se o usuário autenticado é admin.
 * Retorna o accounting_firm_id se for admin.
 * Lança erro se não for admin.
 */
export async function requireAdmin(): Promise<string> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthSessionError("Sessao expirada. Faca login novamente.");
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("accounting_firm_id, role")
    .eq("id", user.id)
    .single();

  if (error || !profile?.accounting_firm_id) {
    throw new Error("Usuario nao vinculado a um escritorio.");
  }

  if (profile.role !== "admin") {
    throw new AuthorizationError("Apenas administradores podem realizar esta acao.");
  }

  return profile.accounting_firm_id;
}

/**
 * Erro de sessão expirada — deve redirecionar para login.
 */
export class AuthSessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthSessionError";
  }
}

/**
 * Erro de autorização — usuário autenticado mas sem permissão.
 */
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}
