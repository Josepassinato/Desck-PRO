# 06 - Matriz de Dependencias

> Data da analise: 2026-03-20
> Base: Imports reais lidos dos arquivos fonte
> Escopo: Itens do staging/repo2_base_candidates/

---

## 1. Matriz de Dependencias por Item

| Item (Grupo) | Imports Internos | Deps Externas | Vars Ambiente | Banco | Framework | Auth | Storage | Grau |
|-------------|-----------------|---------------|---------------|-------|-----------|------|---------|------|
| **fiscal/calculoFiscal.ts** + calculadores/ | `./calculadores/tributosBase`, `./calculadores/tributosEstadual`, `./calculadores/tributosTrabalhistas`, `./calculadores/simplesNacional`, `./types` | Nenhuma | Nenhuma | Nenhum | Nenhum | Nenhum | Nenhum | **LEVE** |
| **fiscal/calculadores/tributosBase.ts** | `../types` (ParametrosCalculo, ResultadoCalculo) | Nenhuma | Nenhuma | Nenhum | Nenhum | Nenhum | Nenhum | **LEVE** |
| **fiscal/types.ts** | Nenhum | Nenhuma | Nenhuma | Nenhum | Nenhum | Nenhum | Nenhum | **LEVE** |
| **fiscal/reconciliacao/** (4 arqs) | Imports internos entre si | Nenhuma | Nenhuma | Supabase (tabelas) | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **fiscal/processadores/** (2 arqs) | `../types`, `../integration/` | Nenhuma | Nenhuma | Supabase (tabelas) | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **fiscal/integration/** (5 arqs) | `./types`, entre si | Nenhuma | Nenhuma | Supabase | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **fiscal/workflow/** | Imports de fiscal/ | Nenhuma | Nenhuma | Supabase | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **governamental/sefazScraperService.ts** | `./sefaz/common`, `./sefaz/santaCatarina`, `./sefaz/procuracaoIntegracao`, `./sefazAutomaticService` | Nenhuma | Nenhuma | Nenhum | Nenhum | Nenhum | Nenhum | **LEVE** |
| **governamental/sefaz/** (7 arqs) | Imports internos entre si | Nenhuma | Nenhuma | Supabase | Nenhum | Nenhum | Supabase Storage | **MEDIA** |
| **governamental/procuracaoService/** (11 arqs) | Imports internos entre si, `./types` | Nenhuma | Nenhuma | Supabase (procuracoes) | Nenhum | Nenhum | Supabase Storage | **MEDIA** |
| **governamental/ecac*.ts** (2 arqs) | Imports de governamental/ | Nenhuma | Nenhuma | Supabase | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **governamental/certificadosDigitaisService.ts** | Imports de governamental/ | Nenhuma | Nenhuma | Supabase | Nenhum | Nenhum | Supabase Storage | **MEDIA** |
| **governamental/serproIntegrationService.ts** | Imports de governamental/ | Nenhuma | SERPRO_API_KEY (provavel) | Nenhum | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **bancario/automacaoBancaria.ts** | Nenhum interno | `@/hooks/use-toast` | Nenhuma | Nenhum | React (toast) | Nenhum | Nenhum | **MEDIA** |
| **bancario/** (outros 5 arqs) | Imports internos, pixTypes | Nenhuma | API keys bancarias (provavel) | Supabase | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **email/emailService.ts** (barrel) | `./types`, `./sendEmail`, `./templateEmailService`, `./scheduleEmailService`, `./templateService`, `./supabaseEmailClient` | Nenhuma | Nenhuma | Nenhum | Nenhum | Nenhum | Nenhum | **LEVE** |
| **email/** (outros 6 arqs) | Imports internos, `./types` | Nenhuma | RESEND_API_KEY (provavel) | Supabase | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **securityService.ts** | `@/integrations/supabase/client`, `@/lib/supabase` (UserRole) | `@supabase/supabase-js` | SUPABASE_URL, SUPABASE_ANON_KEY | Supabase (user_profiles) | Nenhum | Supabase Auth | Nenhum | **PESADA** |
| **authSecurityValidator.ts** | Imports de security/ | Nenhuma | Nenhuma | Supabase | Nenhum | Supabase Auth | Nenhum | **PESADA** |
| **rlsValidator.ts** | Imports de security/ | Nenhuma | Nenhuma | Supabase (RLS) | Nenhum | Supabase Auth | Nenhum | **PESADA** |
| **routes/AuthProvider.tsx** | `./AuthContext`, `@/lib/supabase`, `@/lib/supabaseService`, `@/hooks/use-toast`, `@/contexts/auth/cleanupUtils`, `@/services` (AuthService, UserProfileService) | `@supabase/supabase-js` (Session, User), React | SUPABASE_URL, SUPABASE_ANON_KEY | Supabase (user_profiles) | React | Supabase Auth | Nenhum | **PESADA** |
| **routes/AuthContext.tsx** | `@/lib/supabase` | React | Nenhuma | Nenhum | React | Supabase Auth | Nenhum | **PESADA** |
| **routes/authService.ts** | Imports de auth/ | `@supabase/supabase-js` | SUPABASE_URL, SUPABASE_ANON_KEY | Supabase | Nenhum | Supabase Auth | Nenhum | **PESADA** |
| **routes/authUtils.ts** | Imports de auth/ | Nenhuma | Nenhuma | Nenhum | Nenhum | Supabase Auth | Nenhum | **MEDIA** |
| **routes/integracoes*.ts** (2 arqs) | Imports de supabase/ | `@supabase/supabase-js` | SUPABASE_URL, SUPABASE_ANON_KEY | Supabase | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **tasks/process-data-ingestion.ts** | Nenhum interno | `deno/std@0.177.0/http/server.ts`, `@supabase/supabase-js@2.38.4` | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY | Supabase (automation_logs) | Deno | Nenhum | Nenhum | **PESADA** |
| **tasks/** (outros 5 arqs) | Nenhum interno | `deno/std`, `@supabase/supabase-js` | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY | Supabase | Deno | Nenhum | Nenhum | **PESADA** |
| **frontend/pages/RegimeFiscal.tsx** | `@/components/layout/DashboardLayout`, `@/components/ui/card`, `@/components/layout/ClientSelector`, `@/lib/supabase`, `@/services/supabase/clientsService`, `@/hooks/use-toast`, `@/components/ui/select`, `@/components/ui/button` | `lucide-react`, React | Nenhuma | Supabase (clients) | React, shadcn/ui | Via DashboardLayout | Nenhum | **PESADA** |
| **frontend/components/layout/DashboardLayout.tsx** | `@/components/ui/sidebar`, `./DashboardSidebar`, `./DashboardHeader`, `@/components/dashboard/VoiceAssistant`, `@/components/dashboard/TourController`, `@/contexts/auth`, `@/components/ui/button`, `@/hooks/use-toast`, `@/contexts/auth/cleanupUtils` | `react-router-dom`, `lucide-react`, React | Nenhuma | Nenhum | React, shadcn/ui, react-router | Supabase Auth (via useAuth) | Nenhum | **PESADA** |
| **frontend/services/supabaseClient.ts** | `@/integrations/supabase/` | `@supabase/supabase-js` | SUPABASE_URL, SUPABASE_ANON_KEY | Supabase | Nenhum | Nenhum | Nenhum | **MEDIA** |
| **frontend/services/supabaseTypes.ts** | Nenhum | `@supabase/supabase-js` | Nenhuma | Supabase (schema) | Nenhum | Nenhum | Nenhum | **LEVE** |
| **frontend/components/integracoes/** (17 arqs) | Imports de components/ui/, services/, hooks/ | `lucide-react`, React | Nenhuma | Supabase | React, shadcn/ui | Via contexto | Nenhum | **PESADA** |
| **frontend/components/auth/** (7 arqs) | Imports de components/ui/, contexts/auth/ | React | Nenhuma | Nenhum | React, shadcn/ui | Supabase Auth | Nenhum | **PESADA** |

---

## 2. Itens PESADA (Alto Risco de Extracao)

Estes itens possuem acoplamento forte com frameworks e infraestrutura atual:

| Item | Razao Principal |
|------|----------------|
| routes/AuthProvider.tsx | Acoplado a React, Supabase Auth, multiplos imports internos |
| routes/AuthContext.tsx | Acoplado a React Context API e tipos Supabase |
| routes/authService.ts | Acoplado a Supabase Auth SDK |
| securityService.ts | Acoplado a Supabase client e RLS |
| authSecurityValidator.ts | Acoplado a Supabase Auth |
| rlsValidator.ts | Acoplado a Supabase RLS policies |
| tasks/* (6 arqs) | Acoplado a Deno runtime e Supabase Edge Functions |
| frontend/pages/RegimeFiscal.tsx | Acoplado a React, shadcn/ui, DashboardLayout, Supabase |
| frontend/components/layout/DashboardLayout.tsx | Acoplado a React, react-router, shadcn/ui, auth context |
| frontend/components/integracoes/* (17 arqs) | Acoplado a React, shadcn/ui, Supabase |
| frontend/components/auth/* (7 arqs) | Acoplado a React, shadcn/ui, Supabase Auth |

**Recomendacao**: Para itens PESADA, extrair apenas a logica de negocios (regras, validacoes, calculos) e reimplementar a camada de infraestrutura.

---

## 3. Itens LEVE (Ganhos Rapidos)

Estes itens podem ser extraidos com minima ou nenhuma adaptacao:

| Item | Razao |
|------|-------|
| fiscal/calculoFiscal.ts | Zero deps externas, logica pura de calculo |
| fiscal/calculadores/tributosBase.ts | Apenas import de types interno |
| fiscal/calculadores/tributosEstadual.ts | Apenas import de types interno |
| fiscal/calculadores/tributosTrabalhistas.ts | Apenas import de types interno |
| fiscal/calculadores/simplesNacional.ts | Apenas import de types interno |
| fiscal/types.ts | Zero imports |
| email/emailService.ts (barrel) | Apenas reexporta |
| email/types.ts | Zero imports externos |
| governamental/sefazScraperService.ts (barrel) | Apenas reexporta de submodulos |
| bancario/pixTypes.ts | Apenas tipos |
| frontend/services/supabaseTypes.ts | Tipos gerados, reusavel |
| frontend/components/integracoes/constants.ts | Constantes puras |

**Recomendacao**: Iniciar extracao por estes itens. Podem ser copiados quase intactos.

---

## 4. Variaveis de Ambiente Necessarias

| Variavel | Onde Usada | Obrigatoria |
|----------|-----------|-------------|
| SUPABASE_URL | securityService, authService, supabaseClient, tasks/* | Sim |
| SUPABASE_ANON_KEY | securityService, authService, supabaseClient | Sim |
| SUPABASE_SERVICE_ROLE_KEY | tasks/* (Edge Functions) | Sim (backend) |
| RESEND_API_KEY | email/sendEmail (provavel) | Sim (para email) |
| SERPRO_API_KEY | serproIntegrationService (provavel) | Sim (para CNPJ) |
| API keys bancarias | bancario/* (provavel) | Sim (para banking) |

---

## 5. Dependencias de Framework

| Framework/Lib | Onde Usada | Qtd Arquivos | Substituivel |
|---------------|-----------|-------------|-------------|
| **Supabase JS SDK** | auth, security, tasks, services | ~40 | Sim (Prisma/Drizzle + auth proprio) |
| **React** | frontend/*, AuthProvider, AuthContext | ~60 | Nao (manter no frontend) |
| **react-router-dom** | DashboardLayout, pages | ~10 | Nao (manter no frontend) |
| **shadcn/ui** | components/ui/*, pages | ~30 | Nao (manter no frontend) |
| **lucide-react** | pages, components | ~20 | Nao (manter no frontend) |
| **Deno runtime** | tasks/* (Edge Functions) | 6 | Sim (Node.js + worker) |
| **@/hooks/use-toast** | automacaoBancaria, AuthProvider, pages | ~15 | Nao (manter no frontend) |

---

## 6. Dependencias de Banco de Dados (Supabase/Postgres)

| Tabela/Recurso | Usada Por | Tipo |
|----------------|----------|------|
| user_profiles | securityService, AuthProvider | Auth/RBAC |
| automation_logs | tasks/process-data-ingestion | Logging |
| clients / accounting_clients | RegimeFiscal, clientsService | Core data |
| procuracoes | procuracaoService/* | Gov integration |
| integracoes_estaduais | integracoesEstadualService | Gov integration |
| integracoes_gov | integracoesService | Gov integration |
| Supabase Storage | procuracaoStorage, certificadosDigitais, xmlUpload | File storage |
| Supabase Auth | AuthProvider, authService, securityService | Authentication |
| Supabase RLS | rlsValidator | Authorization |

---

## 7. Resumo Executivo

| Grau | Qtd Grupos | Estrategia |
|------|-----------|-----------|
| LEVE | 12 grupos | Copiar e adaptar minimamente |
| MEDIA | 13 grupos | Extrair logica, adaptar infraestrutura |
| PESADA | 11 grupos | Extrair somente regras de negocio, reimplementar infra |

**Caminho critico para extracao:**
1. Comecar pelos 12 grupos LEVE (motor fiscal, tipos, constantes)
2. Extrair logica dos 13 grupos MEDIA (servicos gov, bancario, email)
3. Deixar grupos PESADA por ultimo (auth, tasks Deno, frontend acoplado)
4. Substituir Supabase SDK por ORM proprio no backend
5. Manter React/shadcn/ui no frontend, substituir apenas Supabase Auth
