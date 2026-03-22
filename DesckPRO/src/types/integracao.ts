export interface IntegracaoERP {
  id: string;
  empresa_id: string;
  provider: ERPProvider;
  status: IntegracaoStatus;
  config: Record<string, unknown>;
  last_sync_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
  sync_interval_minutes: number;
  created_at: string;
  updated_at: string;
}

export type ERPProvider =
  | "bling"
  | "omie"
  | "contaazul"
  | "tiny"
  | "nuvemshop"
  | "manual";

export type IntegracaoStatus =
  | "pending"
  | "active"
  | "error"
  | "disabled"
  | "expired";

export interface ERPProviderInfo {
  id: ERPProvider;
  nome: string;
  descricao: string;
  logo?: string;
  campos: ERPCredentialField[];
}

export interface ERPCredentialField {
  key: string;
  label: string;
  type: "text" | "password" | "url";
  required: boolean;
  placeholder?: string;
}

export const ERP_PROVIDERS: ERPProviderInfo[] = [
  {
    id: "bling",
    nome: "Bling",
    descricao: "ERP para e-commerce e varejo",
    campos: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "Cole sua API Key do Bling",
      },
    ],
  },
  {
    id: "omie",
    nome: "Omie",
    descricao: "ERP completo para PMEs",
    campos: [
      {
        key: "app_key",
        label: "App Key",
        type: "text",
        required: true,
        placeholder: "App Key",
      },
      {
        key: "app_secret",
        label: "App Secret",
        type: "password",
        required: true,
        placeholder: "App Secret",
      },
    ],
  },
  {
    id: "contaazul",
    nome: "ContaAzul",
    descricao: "Gestao financeira para pequenas empresas",
    campos: [
      {
        key: "access_token",
        label: "Access Token",
        type: "password",
        required: true,
        placeholder: "OAuth Access Token",
      },
    ],
  },
  {
    id: "tiny",
    nome: "Tiny ERP",
    descricao: "ERP para e-commerce",
    campos: [
      {
        key: "token",
        label: "Token",
        type: "password",
        required: true,
        placeholder: "Token de acesso",
      },
    ],
  },
  {
    id: "nuvemshop",
    nome: "Nuvemshop",
    descricao: "Plataforma de e-commerce",
    campos: [
      {
        key: "access_token",
        label: "Access Token",
        type: "password",
        required: true,
        placeholder: "OAuth Access Token",
      },
      {
        key: "user_id",
        label: "User ID",
        type: "text",
        required: true,
        placeholder: "ID do usuario",
      },
    ],
  },
];
