# Relatório de Revisão CTO — Desck-PRO

**Data:** 2026-03-22
**Escopo:** Revisão completa do código-fonte (app raiz Aura + subpasta DesckPRO)
**Arquivos analisados:** ~1.500 arquivos, 80+ componentes TypeScript/TSX

---

## RESUMO EXECUTIVO

O Desck-PRO tem fundamentos sólidos — stack moderna (React 18, TypeScript, Supabase, Tailwind), boa organização de pastas, e um motor de diagnóstico fiscal bem pensado. Porém, **NÃO está pronto para produção**. Existem vulnerabilidades críticas de segurança, features incompletas entregues como prontas, e gaps de arquitetura que precisam ser resolvidos.

| Severidade | Quantidade | Resumo |
|---|---|---|
| CRÍTICO | 9 | Segurança, credenciais, autorização |
| ALTO | 14 | Auth, isolamento multi-tenant, error handling |
| MÉDIO | 15 | Performance, validação, testes |
| BAIXO | 8 | UX, padrões de código, documentação |

**Nota de qualidade:** 7.2/10 — Bom para MVP, insuficiente para produção.

---

## 1. PROBLEMAS CRÍTICOS DE SEGURANÇA

### 1.1 Credenciais ERP armazenadas em texto puro
**Arquivo:** `DesckPRO/src/services/integracaoService.ts` (linha 30)

O campo chama `credentials_encrypted` mas o valor é salvo **SEM NENHUMA CRIPTOGRAFIA**:

```typescript
credentials_encrypted: credentials, // ❌ NÃO está criptografado
```

**Risco:** Se o banco for comprometido, todas as chaves de API dos ERPs dos clientes ficam expostas.

**Correção:** Usar Supabase Vault ou criptografia AES-256 antes de salvar. Nunca armazenar secrets em texto puro.

---

### 1.2 Sem verificação de autorização nas páginas Admin
**Arquivos:** `DesckPRO/src/pages/AdminUsuarios.tsx`, `AdminConfiguracoes.tsx`

Qualquer usuário autenticado (mesmo role "client") pode acessar a página de admin se souber a URL:

```typescript
export function AdminUsuarios() {
  const { user: currentUser } = useAuth(); // ❌ Só verifica se está logado, não se é admin
  const { data: users = [] } = useUsers(); // ❌ Retorna TODOS os usuários
}
```

**Risco:** Escalação de privilégios — um cliente pode ver/alterar roles de outros usuários.

**Correção:**
```typescript
const { profile } = useAuth();
if (profile?.role !== "admin") return <Navigate to="/" replace />;
```

---

### 1.3 Alteração de role sem checagem de permissão
**Arquivo:** `DesckPRO/src/services/userService.ts` (linhas 25-34)

```typescript
async updateRole(userId: string, role: UserRole): Promise<UserProfile> {
  // ❌ Qualquer usuário autenticado pode mudar o role de qualquer outro
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ role })
    .eq("id", userId)
    .select().single();
}
```

**Risco:** Privilege escalation — um usuário comum pode se promover a admin.

---

### 1.4 Portal do Cliente expõe dados de TODAS as empresas
**Arquivo:** `DesckPRO/src/pages/ClientPortal.tsx` (linhas 37-47)

```typescript
const { data, error } = await supabase
  .from("empresas")
  .select("id, razao_social, cnpj, regime_atual, status")
  .order("razao_social"); // ❌ SEM FILTRO — retorna empresas de TODOS os escritórios
```

**Risco:** Vazamento de dados entre escritórios contábeis (multi-tenant quebrado).

---

### 1.5 RLS (Row-Level Security) sem validação client-side
**Arquivos:** Todos os services (`empresaService.ts`, `pendenciaService.ts`, `documentoService.ts`)

A aplicação confia 100% nas policies do Supabase. Se alguma policy estiver mal configurada ou desabilitada, **todo o isolamento de dados cai**.

Não existe:
- Verificação client-side de `accounting_firm_id`
- Testes automatizados de RLS
- Monitoramento de falhas de autorização
- Fallback se RLS falhar silenciosamente

---

### 1.6 Criação de usuário com senha temporária em texto puro
**Arquivo:** `DesckPRO/src/pages/AdminUsuarios.tsx` (linha 247)

```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password, // ❌ Senha temporária visível na rede/logs
});
```

**Correção:** Usar fluxo de convite por email com magic link (Supabase suporta nativamente).

---

## 2. PROBLEMAS DE ARQUITETURA

### 2.1 Dois apps no mesmo repositório sem separação clara

O repo contém:
- **`/src/`** — App Aura completo (contabilidade, fiscal, IA, voice agent) — ~60 páginas
- **`/DesckPRO/`** — App extraído (diagnóstico, empresas, bancário) — ~12 páginas

**Problema:** Ambos têm `package.json`, `vite.config`, `index.html` independentes. Compartilham o mesmo `.git` mas não compartilham código. O `/src/` raiz parece ser código legado do Aura que veio junto na extração.

**Recomendação:**
1. Decidir: o app principal é `/DesckPRO/` ou `/src/`?
2. Se `/DesckPRO/` é o produto, mover para raiz e deletar `/src/`
3. Se ambos são necessários, usar monorepo com Turborepo/Nx
4. Remover a pasta `staging/` (artefatos de extração, não código de produto)

---

### 2.2 Acoplamento direto ao Supabase em toda a camada de serviços

```typescript
// Todos os services fazem isso:
import { supabase } from "@/lib/supabase";
const { data, error } = await supabase.from("empresas").select("*");
```

**Problema:** Impossível trocar de banco, impossível testar sem mock complexo, impossível adicionar cache intermediário.

**Recomendação:** Implementar Repository Pattern:
```typescript
interface IEmpresaRepository {
  list(): Promise<Empresa[]>;
  getById(id: string): Promise<Empresa>;
}
class SupabaseEmpresaRepository implements IEmpresaRepository { ... }
```

---

### 2.3 Sem transaction boundaries no upload de documentos
**Arquivo:** `DesckPRO/src/services/documentoService.ts` (linhas 16-46)

```typescript
// Passo 1: Upload no storage — SUCESSO
await supabase.storage.from("documentos").upload(filePath, file);

// Passo 2: Insert no banco — FALHA
await supabase.from("documentos").insert({...});
// ❌ Arquivo órfão no storage, sem cleanup
```

**Correção:** Adicionar rollback: se o insert falhar, deletar o arquivo do storage.

---

### 2.4 Dashboard com valores hardcoded em zero
**Arquivo:** `DesckPRO/src/pages/Dashboard.tsx` (linhas 16-41)

```typescript
const stats = [
  { title: "Empresas Ativas", value: "0" },  // ❌ Hardcoded
  { title: "Diagnósticos",    value: "0" },  // ❌ Hardcoded
];
```

**Impacto:** Usuário abre o dashboard e vê tudo zerado mesmo tendo dados. Primeira impressão terrível.

---

## 3. FEATURES INCOMPLETAS

### 3.1 Página de Integrações — botão morto
**Arquivo:** `DesckPRO/src/pages/Integracoes.tsx` (linha 68)

```typescript
<Button variant="outline" size="sm">
  Conectar  {/* ❌ Sem onClick — não faz absolutamente nada */}
</Button>
```

---

### 3.2 ContaFlux — integração é stub
**Arquivo:** `DesckPRO/src/engine/contaflux/service.ts` (linhas 94-111)

```typescript
async enviar(envioId: string): Promise<void> {
  // TODO: Em produção, aqui faria POST para API da ContaFlux
  // Por enquanto, marca como enviado.
}
```

**Risco:** Dados marcados como "enviados" mas nunca foram enviados de fato.

---

### 3.3 Configurações Admin — 3 features "Em breve"
**Arquivo:** `DesckPRO/src/pages/AdminConfiguracoes.tsx` (linhas 287-304)

- Notificações por email — "Em breve"
- Integração automática ContaFlux — "Em breve"
- Backups automáticos — "Em breve"

---

### 3.4 Classificador de documentos não conectado ao upload

O motor de classificação (`classificarDocumento()`) existe e funciona, mas NÃO é chamado durante o upload. O tipo de documento depende 100% da seleção manual do usuário.

---

## 4. PROBLEMAS DE PERFORMANCE

### 4.1 Queries sem paginação
**Arquivos:** `pendenciaService.ts`, `empresaService.ts`

```typescript
// Retorna TUDO — pode ser 100K registros
const { data } = await supabase.from("pendencias").select("*");
```

**Correção:** Adicionar `.limit(50)` + paginação cursor-based na UI.

---

### 4.2 Busca N+1 na lista de pendências
**Arquivo:** `DesckPRO/src/pages/Pendencias.tsx` (linhas 119-227)

```typescript
{filtradas.map((p) => (
  <PendenciaCard
    empresaNome={empresas?.find((e) => e.id === p.empresa_id)?.razao_social}
    // ❌ Array.find() para cada pendência = O(n*m)
  />
))}
```

**Correção:** Criar um Map de lookup antes do render:
```typescript
const empresaMap = new Map(empresas.map(e => [e.id, e.razao_social]));
```

---

### 4.3 OFX Parser com regex ineficiente
**Arquivo:** `DesckPRO/src/engine/bancario/parser-ofx.ts`

Múltiplos passes de regex no conteúdo inteiro do arquivo. Pode travar com arquivos OFX grandes (50MB+).

---

## 5. GAPS DE TESTES

| Tipo | Status |
|---|---|
| Unitários (engine) | ✅ 5 suites — CNPJ, classificador, diagnóstico, contrato, parser OFX |
| Componentes (UI) | ❌ ZERO testes de componente |
| Integração (services) | ❌ ZERO testes de serviço |
| E2E (fluxos) | ❌ ZERO testes end-to-end |
| Segurança (RLS) | ❌ ZERO testes de multi-tenant |

**Cobertura estimada:** <15% do código

---

## 6. ERROR HANDLING

### 6.1 Erros genéricos sem contexto
```typescript
catch {
  toast.error("Erro ao remover empresa"); // ❌ Sem detalhes — rede? auth? permissão?
}
```

### 6.2 Sem tratamento de 401/403
Nenhum service distingue erros de autenticação de outros erros. Token expirado mostra "Erro genérico" em vez de redirecionar para login.

### 6.3 `.single()` sem validação
Múltiplos pontos onde `.single()` é chamado sem tratar o caso de "nenhum registro encontrado" — causa crash silencioso.

---

## 7. COMPLIANCE & DADOS

| Item | Status |
|---|---|
| Audit trail (quem alterou o quê) | ❌ Não existe |
| Data retention policy | ❌ Não existe |
| Backup automatizado | ❌ Não existe |
| LGPD (exportação/exclusão de dados) | ❌ Não existe |
| Monitoramento de integrações | ❌ Não existe |

---

## 8. PONTOS POSITIVOS

- ✅ Stack moderna e bem escolhida (React 18 + TypeScript + Vite + Tailwind)
- ✅ Organização de pastas clara (services, hooks, types, components, engine)
- ✅ Motor de diagnóstico 6-dimensional bem arquitetado com scoring ponderado
- ✅ Validação de CNPJ robusta com 60+ assertions nos testes
- ✅ Classificador de documentos com heurísticas inteligentes
- ✅ UI components usando Radix UI (acessibilidade built-in)
- ✅ React Query bem configurado (staleTime 5min, retry 1)
- ✅ Tipos TypeScript para quase todas as entidades
- ✅ Estrutura multi-tenant presente nos modelos de dados

---

## ROADMAP DE CORREÇÃO PRIORITIZADO

### P0 — CRÍTICO (Fazer antes de qualquer deploy)
| # | Item | Esforço |
|---|---|---|
| 1 | Gate de autorização nas páginas Admin | 2-3h |
| 2 | Filtro por `accounting_firm_id` em TODOS os services | 3-4h |
| 3 | Criptografia real para credenciais ERP (Supabase Vault) | 4-6h |
| 4 | Filtro no ClientPortal (só empresas do cliente) | 1-2h |
| 5 | Fluxo de convite por email (substituir senha temporária) | 3-4h |

### P1 — ALTO (Fazer no primeiro sprint)
| # | Item | Esforço |
|---|---|---|
| 6 | Error handling para 401/403 com redirect para login | 2-3h |
| 7 | Rollback no upload de documentos (cleanup storage) | 2h |
| 8 | Dashboard com dados reais (não zeros) | 3-4h |
| 9 | Completar página de Integrações (formulário + conexão) | 4-6h |
| 10 | Testes E2E com Playwright (login, criar empresa, diagnóstico) | 6-8h |

### P2 — MÉDIO (Fazer no segundo sprint)
| # | Item | Esforço |
|---|---|---|
| 11 | Paginação em todas as listagens | 4-6h |
| 12 | Conectar classificador ao upload de documentos | 2-3h |
| 13 | Audit logging (created_by, updated_by, triggers PostgreSQL) | 6-8h |
| 14 | Validação de tamanho/tipo de arquivo no upload | 1-2h |
| 15 | Resolver estrutura do repo (monorepo ou mover DesckPRO para raiz) | 2-3h |

### P3 — BAIXO (Backlog)
| # | Item | Esforço |
|---|---|---|
| 16 | Repository Pattern (desacoplar do Supabase) | 8-12h |
| 17 | CSP headers + SRI hashes | 2-3h |
| 18 | LGPD compliance (exportação/exclusão) | 8-12h |
| 19 | Monitoramento/alertas de integrações | 4-6h |
| 20 | Documentação arquitetural (ARCHITECTURE.md, ER diagram) | 4-6h |

---

## ESTIMATIVA TOTAL

| Prioridade | Horas | Timeline |
|---|---|---|
| P0 (Crítico) | 13-19h | Semana 1 |
| P1 (Alto) | 17-25h | Semana 2-3 |
| P2 (Médio) | 15-22h | Semana 4-5 |
| P3 (Baixo) | 26-39h | Backlog |
| **Total** | **71-105h** | **5-8 semanas** |

---

## DECISÃO ARQUITETURAL NECESSÁRIA

Antes de avançar, é preciso decidir:

**O produto final é o `/DesckPRO/` ou o `/src/` raiz (Aura)?**

- Se **DesckPRO** → mover para raiz, deletar `/src/`, `/staging/`, `/docs/` do Aura
- Se **ambos** → configurar monorepo com shared packages
- Se **Aura** → o DesckPRO é apenas um módulo dentro do Aura

Essa decisão impacta toda a estratégia de deploy, testes e CI/CD.

---

*Relatório gerado em 2026-03-22 por análise automatizada de código.*
