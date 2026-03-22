import { supabase } from "@/lib/supabase";
import type { UserProfile, UserRole } from "@/types/auth";

export const userService = {
  async listByFirm(): Promise<UserProfile[]> {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("accounting_firm_id")
      .single();

    if (!profile?.accounting_firm_id) {
      throw new Error("Usuario nao vinculado a um escritorio");
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("accounting_firm_id", profile.accounting_firm_id)
      .order("full_name");

    if (error) throw error;
    return data as UserProfile[];
  },

  async updateRole(userId: string, role: UserRole): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },

  async remove(userId: string): Promise<void> {
    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", userId);
    if (error) throw error;
  },
};
