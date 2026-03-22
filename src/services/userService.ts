import { supabase } from "@/lib/supabase";
import { requireAdmin, requireFirmId } from "@/lib/auth-guard";
import type { UserProfile, UserRole } from "@/types/auth";

export const userService = {
  async listByFirm(): Promise<UserProfile[]> {
    const firmId = await requireFirmId();

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("accounting_firm_id", firmId)
      .order("full_name");

    if (error) throw error;
    return data as UserProfile[];
  },

  async updateRole(userId: string, role: UserRole): Promise<UserProfile> {
    // Somente admin pode alterar roles
    const firmId = await requireAdmin();

    // Verifica se o usuário-alvo pertence à mesma firma
    const { data: targetUser, error: targetError } = await supabase
      .from("user_profiles")
      .select("accounting_firm_id")
      .eq("id", userId)
      .single();

    if (targetError || targetUser?.accounting_firm_id !== firmId) {
      throw new Error("Usuario nao pertence a este escritorio.");
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({ role })
      .eq("id", userId)
      .eq("accounting_firm_id", firmId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },

  async remove(userId: string): Promise<void> {
    // Somente admin pode remover usuários
    const firmId = await requireAdmin();

    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", userId)
      .eq("accounting_firm_id", firmId);
    if (error) throw error;
  },
};
