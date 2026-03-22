export type UserRole = "admin" | "accountant" | "client";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  accounting_firm_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAccountant: boolean;
  isClient: boolean;
}
