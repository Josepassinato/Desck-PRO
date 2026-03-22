export interface Empresa {
  id: string;
  accounting_firm_id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string | null;
  inscricao_estadual: string | null;
  inscricao_municipal: string | null;
  cnae_principal: string | null;
  cnaes_secundarios: string[] | null;
  regime_atual: RegimeTributario;
  faturamento_anual: number | null;
  email: string | null;
  telefone: string | null;
  endereco: Endereco | null;
  responsavel_nome: string | null;
  responsavel_cpf: string | null;
  status: EmpresaStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type RegimeTributario =
  | "simples_nacional"
  | "presumido"
  | "real"
  | "mei"
  | "outro";

export type EmpresaStatus =
  | "active"
  | "inactive"
  | "prospecting"
  | "migrating";

export interface Endereco {
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
}

export interface CreateEmpresaInput {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  cnae_principal?: string;
  cnaes_secundarios?: string[];
  regime_atual?: RegimeTributario;
  faturamento_anual?: number;
  email?: string;
  telefone?: string;
  endereco?: Endereco;
  responsavel_nome?: string;
  responsavel_cpf?: string;
}

export interface UpdateEmpresaInput extends Partial<CreateEmpresaInput> {
  status?: EmpresaStatus;
}
