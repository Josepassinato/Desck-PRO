# CATÁLOGO COMPLETO DE EXTRAÇÃO CONTROLADA

**Data:** 2026-03-20
**Fase:** Extração e Catalogação
**Regra:** NÃO implementar, NÃO refatorar, NÃO criar repositório final

---

## Resumo Geral

| Origem | Fonte Real | Status Acesso | Arquivos Staged | Tag Principal |
|--------|-----------|--------------|-----------------|---------------|
| Repo2 (Base) | contaflix-lr-main.zip → substituído por aura-contabilidade-autom | Extraído (substituto) | 132 | USE_AS_BASE |
| Repo1 (Conectores ERP) | Contaflux-LR-main 3.zip | NÃO ACESSÍVEL | 1 (README) de 9 planejados | DO_NOT_USE_NOW |
| OCA (Ref. Fiscal) | github.com/OCA/l10n-brazil | EXTRAÍDO | 482 | REFERENCE_ONLY + LICENSE_REVIEW_REQUIRED |
| **TOTAL** | | | **615 + 13 catálogos** | |

---

## REPO2 — Base Principal (aura-contabilidade-autom)

### 1. Backend / Auth & Security

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 1 | backend/routes/AuthContext.tsx | src/contexts/auth/AuthContext.tsx | USE_AS_BASE | Contexto React de autenticação | Auth | COPY |
| 2 | backend/routes/AuthProvider.tsx | src/contexts/auth/AuthProvider.tsx | USE_AS_BASE | Provider de auth com Supabase | Auth | COPY |
| 3 | backend/routes/authService.ts | src/services/auth/authService.ts | USE_AS_BASE | Serviço de autenticação (login, signup, roles) | Auth | COPY |
| 4 | backend/routes/authUtils.ts | src/contexts/auth/authUtils.ts | USE_AS_BASE | Utilitários de auth (tokens, sessão) | Auth | COPY |
| 5 | backend/secure-api.ts | supabase/functions/_shared/secure-api.ts | USE_AS_BASE | Middleware de segurança para edge functions | Backend Base | COPY |
| 6 | backend/securityService.ts | src/services/security/securityService.ts | USE_AS_BASE | Serviço de segurança (rate limiting, audit) | Security | COPY |
| 7 | backend/authSecurityValidator.ts | src/services/security/authSecurityValidator.ts | USE_AS_BASE | Validação de segurança em auth | Security | COPY |
| 8 | backend/rlsValidator.ts | src/services/security/rlsValidator.ts | USE_AS_BASE | Validador de Row Level Security | Security | COPY |
| 9 | backend/security-monitor.ts | supabase/functions/security-monitor/index.ts | EXTRACT_LOGIC_ONLY | Monitor de segurança em tempo real | Security | STUDY |

### 2. Backend / Document Processing

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 10 | backend/classify-document.ts | supabase/functions/classify-document/index.ts | EXTRACT_LOGIC_ONLY | Classificação automática de documentos | Documentos | STUDY |
| 11 | backend/process-ocr-documents.ts | supabase/functions/process-ocr-documents/index.ts | EXTRACT_LOGIC_ONLY | OCR e extração de dados de documentos | Documentos | STUDY |
| 12 | backend/nlp-document-analysis.ts | supabase/functions/nlp-document-analysis/index.ts | EXTRACT_LOGIC_ONLY | Análise NLP de documentos fiscais | Documentos | STUDY |

### 3. Backend / Tasks & Automation

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 13 | backend/tasks/process-data-ingestion.ts | supabase/functions/process-data-ingestion/index.ts | EXTRACT_LOGIC_ONLY | Ingestão de dados de fontes externas | Integrações | STUDY |
| 14 | backend/tasks/process-accounting-automation.ts | supabase/functions/process-accounting-automation/index.ts | EXTRACT_LOGIC_ONLY | Automação contábil | Operacional | STUDY |
| 15 | backend/tasks/process-accounting-entry.ts | supabase/functions/process-accounting-entry/index.ts | EXTRACT_LOGIC_ONLY | Lançamentos contábeis automáticos | Operacional | STUDY |
| 16 | backend/tasks/compliance-automation.ts | supabase/functions/compliance-automation/index.ts | EXTRACT_LOGIC_ONLY | Automação de compliance fiscal | Compliance | STUDY |
| 17 | backend/tasks/validation-service.ts | supabase/functions/validation-service/index.ts | USE_AS_BASE | Serviço de validação genérico | Backend Base | COPY |
| 18 | backend/tasks/queue-processor.ts | supabase/functions/queue-processor/index.ts | USE_AS_BASE | Processador de filas | Backend Base | COPY |

### 4. Backend / Services — Fiscal

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 19 | backend/services/fiscal/calculoFiscal.ts | src/services/fiscal/calculoFiscal.ts | EXTRACT_LOGIC_ONLY | Motor de cálculo fiscal (Simples Nacional) | Diagnóstico | STUDY |
| 20 | backend/services/fiscal/darfService.ts | src/services/fiscal/darfService.ts | EXTRACT_LOGIC_ONLY | Geração de DARFs | Documentos | STUDY |
| 21 | backend/services/fiscal/types.ts | src/services/fiscal/types.ts | USE_AS_BASE | Tipos TypeScript do domínio fiscal | Tipos | COPY |
| 22 | backend/services/fiscal/calculadores/simplesNacional.ts | src/services/fiscal/calculadores/simplesNacional.ts | REFERENCE_ONLY | Cálculo Simples Nacional (NÃO serve para LR) | — | STUDY |
| 23 | backend/services/fiscal/calculadores/tributosBase.ts | src/services/fiscal/calculadores/tributosBase.ts | EXTRACT_LOGIC_ONLY | Base de cálculos tributários | Diagnóstico | STUDY |
| 24 | backend/services/fiscal/calculadores/tributosEstadual.ts | src/services/fiscal/calculadores/tributosEstadual.ts | EXTRACT_LOGIC_ONLY | Cálculos ICMS/estaduais | Diagnóstico | STUDY |
| 25 | backend/services/fiscal/calculadores/tributosTrabalhistas.ts | src/services/fiscal/calculadores/tributosTrabalhistas.ts | EXTRACT_LOGIC_ONLY | Cálculos trabalhistas (INSS, FGTS) | Custos Pessoal | STUDY |
| 26 | backend/services/fiscal/integration/contabilService.ts | src/services/fiscal/integration/contabilService.ts | EXTRACT_LOGIC_ONLY | Integração contábil | Operacional | STUDY |
| 27 | backend/services/fiscal/integration/index.ts | src/services/fiscal/integration/index.ts | EXTRACT_LOGIC_ONLY | Barrel export integrações fiscais | Integrações | STUDY |
| 28 | backend/services/fiscal/integration/integracoesConfig.ts | src/services/fiscal/integration/integracoesConfig.ts | USE_AS_BASE | Config de fontes de dados (ERP, NFe, manual) | Integrações ERP | COPY |
| 29 | backend/services/fiscal/integration/notasFiscaisService.ts | src/services/fiscal/integration/notasFiscaisService.ts | EXTRACT_LOGIC_ONLY | Serviço de notas fiscais | Documentos | STUDY |
| 30 | backend/services/fiscal/integration/types.ts | src/services/fiscal/integration/types.ts | USE_AS_BASE | Tipos de integração fiscal | Tipos | COPY |
| 31 | backend/services/fiscal/processadores/lancamentosProcessor.ts | src/services/fiscal/processadores/lancamentosProcessor.ts | EXTRACT_LOGIC_ONLY | Processador de lançamentos | Operacional | STUDY |
| 32 | backend/services/fiscal/processadores/notasFiscaisProcessor.ts | src/services/fiscal/processadores/notasFiscaisProcessor.ts | EXTRACT_LOGIC_ONLY | Processador de NFs | Documentos | STUDY |
| 33 | backend/services/fiscal/reconciliacao/aprendizadoMaquina.ts | src/services/fiscal/reconciliacao/aprendizadoMaquina.ts | REFERENCE_ONLY | ML para reconciliação | — | STUDY |
| 34 | backend/services/fiscal/reconciliacao/detecaoPadroes.ts | src/services/fiscal/reconciliacao/detecaoPadroes.ts | REFERENCE_ONLY | Detecção de padrões em transações | — | STUDY |
| 35 | backend/services/fiscal/reconciliacao/reconciliacaoBancaria.ts | src/services/fiscal/reconciliacao/reconciliacaoBancaria.ts | EXTRACT_LOGIC_ONLY | Reconciliação bancária (básica) | Bancário | STUDY |
| 36 | backend/services/fiscal/reconciliacao/resolucaoAutonoma.ts | src/services/fiscal/reconciliacao/resolucaoAutonoma.ts | REFERENCE_ONLY | Resolução autônoma de pendências | — | STUDY |
| 37 | backend/services/fiscal/workflow/fiscalWorkflowService.ts | src/services/fiscal/workflow/fiscalWorkflowService.ts | EXTRACT_LOGIC_ONLY | Workflow fiscal | Pendências | STUDY |

### 5. Backend / Services — Governamental

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 38 | backend/services/governamental/apiIntegration.ts | src/services/governamental/apiIntegration.ts | EXTRACT_LOGIC_ONLY | Integração APIs governamentais | Gov | STUDY |
| 39 | backend/services/governamental/certificadosDigitaisService.ts | src/services/governamental/certificadosDigitaisService.ts | EXTRACT_LOGIC_ONLY | Gestão certificados digitais | Gov | STUDY |
| 40 | backend/services/governamental/declaracoesSimplesNacionalService.ts | src/services/governamental/declaracoesSimplesNacionalService.ts | REFERENCE_ONLY | Declarações SN (não serve para LR) | — | STUDY |
| 41 | backend/services/governamental/ecacIntegration.ts | src/services/governamental/ecacIntegration.ts | EXTRACT_LOGIC_ONLY | Integração e-CAC | Gov | STUDY |
| 42 | backend/services/governamental/ecacService.ts | src/services/governamental/ecacService.ts | EXTRACT_LOGIC_ONLY | Serviço e-CAC | Gov | STUDY |
| 43 | backend/services/governamental/estadualIntegration.ts | src/services/governamental/estadualIntegration.ts | EXTRACT_LOGIC_ONLY | Integração SEFAZ estadual | Gov | STUDY |
| 44 | backend/services/governamental/sefazAutomaticService.ts | src/services/governamental/sefazAutomaticService.ts | EXTRACT_LOGIC_ONLY | Consulta automática SEFAZ | Gov | STUDY |
| 45 | backend/services/governamental/sefazScraperService.ts | src/services/governamental/sefazScraperService.ts | REFERENCE_ONLY | Scraping SEFAZ (FRÁGIL - não usar) | — | STUDY |
| 46 | backend/services/governamental/serproIntegrationService.ts | src/services/governamental/serproIntegrationService.ts | EXTRACT_LOGIC_ONLY | Integração Serpro | Gov | STUDY |
| 47 | backend/services/governamental/simplesNacionalIntegration.ts | src/services/governamental/simplesNacionalIntegration.ts | REFERENCE_ONLY | Integração SN (não serve para LR) | — | STUDY |
| 48-58 | backend/services/governamental/procuracaoService/*.ts (11 arquivos) | src/services/governamental/procuracaoService/ | EXTRACT_LOGIC_ONLY | Sistema de procurações eletrônicas e-CAC | Gov | STUDY |
| 59-65 | backend/services/governamental/sefaz/*.ts (7 arquivos) | src/services/governamental/sefaz/ | EXTRACT_LOGIC_ONLY | Integração SEFAZ (APIs, XML, estados) | Gov | STUDY |

### 6. Backend / Services — Bancário

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 66 | backend/services/bancario/automacaoBancaria.ts | src/services/bancario/automacaoBancaria.ts | EXTRACT_LOGIC_ONLY | Automação bancária | Bancário | STUDY |
| 67 | backend/services/bancario/openBankingService.ts | src/services/bancario/openBankingService.ts | EXTRACT_LOGIC_ONLY | Open Banking | Bancário | STUDY |
| 68 | backend/services/bancario/pagamentoAutomatico.ts | src/services/bancario/pagamentoAutomatico.ts | EXTRACT_LOGIC_ONLY | Pagamento automático | Bancário | STUDY |
| 69 | backend/services/bancario/pagamentoService.ts | src/services/bancario/pagamentoService.ts | EXTRACT_LOGIC_ONLY | Serviço de pagamentos | Bancário | STUDY |
| 70 | backend/services/bancario/pixService.ts | src/services/bancario/pixService.ts | EXTRACT_LOGIC_ONLY | Integração PIX | Bancário | STUDY |
| 71 | backend/services/bancario/pixTypes.ts | src/services/bancario/pixTypes.ts | USE_AS_BASE | Tipos PIX | Tipos | COPY |

### 7. Backend / Services — Email

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 72 | backend/services/email/emailService.ts | src/services/email/emailService.ts | USE_AS_BASE | Serviço principal de email | Notificações | COPY |
| 73 | backend/services/email/scheduleEmailService.ts | src/services/email/scheduleEmailService.ts | USE_AS_BASE | Agendamento de emails | Notificações | COPY |
| 74 | backend/services/email/sendEmail.ts | src/services/email/sendEmail.ts | USE_AS_BASE | Envio de emails | Notificações | COPY |
| 75 | backend/services/email/supabaseEmailClient.ts | src/services/email/supabaseEmailClient.ts | USE_AS_BASE | Cliente Supabase para email | Notificações | COPY |
| 76 | backend/services/email/templateEmailService.ts | src/services/email/templateEmailService.ts | USE_AS_BASE | Templates de email | Notificações | COPY |
| 77 | backend/services/email/templateService.ts | src/services/email/templateService.ts | USE_AS_BASE | Motor de templates | Notificações | COPY |
| 78 | backend/services/email/types.ts | src/services/email/types.ts | USE_AS_BASE | Tipos email | Tipos | COPY |
| 79 | backend/services/send-email.ts | supabase/functions/send-email/index.ts | USE_AS_BASE | Edge function envio email | Notificações | COPY |

### 8. Backend / Integrations Routes

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 80 | backend/routes/integracoesService.ts | src/services/supabase/integracoesService.ts | EXTRACT_LOGIC_ONLY | CRUD integrações governamentais | Integrações | STUDY |
| 81 | backend/routes/integracoesEstadualService.ts | src/services/supabase/integracoesEstadualService.ts | EXTRACT_LOGIC_ONLY | CRUD integrações estaduais | Integrações | STUDY |

### 9. Frontend / Pages

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 82 | frontend/pages/RegimeFiscal.tsx | src/pages/RegimeFiscal.tsx | EXTRACT_LOGIC_ONLY | Simulador de regime fiscal | Diagnóstico | STUDY |
| 83 | frontend/pages/IntegracoesGov.tsx | src/pages/IntegracoesGov.tsx | EXTRACT_LOGIC_ONLY | Página integrações governamentais | Integrações | STUDY |
| 84 | frontend/pages/IntegracoesEstaduais.tsx | src/pages/IntegracoesEstaduais.tsx | EXTRACT_LOGIC_ONLY | Página integrações estaduais | Integrações | STUDY |
| 85 | frontend/pages/ClientDocuments.tsx | src/pages/ClientDocuments.tsx | EXTRACT_LOGIC_ONLY | Gestão documentos do cliente | Documentos | STUDY |
| 86 | frontend/pages/GerenciarClientes.tsx | src/pages/GerenciarClientes.tsx | USE_AS_BASE | Cadastro mestre de clientes | Cadastro | COPY |
| 87 | frontend/pages/Login.tsx | src/pages/Login.tsx | USE_AS_BASE | Página de login | Auth | COPY |
| 88 | frontend/pages/Settings.tsx | src/pages/Settings.tsx | EXTRACT_LOGIC_ONLY | Configurações do sistema | Config | STUDY |

### 10. Frontend / Components — Auth

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 89 | frontend/components/auth/AdminRoute.tsx | src/components/auth/AdminRoute.tsx | USE_AS_BASE | Rota protegida admin | Auth | COPY |
| 90 | frontend/components/auth/AuthFooter.tsx | src/components/auth/AuthFooter.tsx | USE_AS_BASE | Footer de auth | Auth | COPY |
| 91 | frontend/components/auth/AuthHeader.tsx | src/components/auth/AuthHeader.tsx | USE_AS_BASE | Header de auth | Auth | COPY |
| 92 | frontend/components/auth/InviteSignupForm.tsx | src/components/auth/InviteSignupForm.tsx | USE_AS_BASE | Formulário signup por convite | Auth | COPY |
| 93 | frontend/components/auth/LoginForm.tsx | src/components/auth/LoginForm.tsx | USE_AS_BASE | Formulário de login | Auth | COPY |
| 94 | frontend/components/auth/QuickLoginButtons.tsx | src/components/auth/QuickLoginButtons.tsx | REFERENCE_ONLY | Botões login rápido (demo) | — | STUDY |
| 95 | frontend/components/auth/SignupForm.tsx | src/components/auth/SignupForm.tsx | USE_AS_BASE | Formulário de cadastro | Auth | COPY |

### 11. Frontend / Components — Layout

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 96 | frontend/components/layout/ClientSelector.tsx | src/components/layout/ClientSelector.tsx | USE_AS_BASE | Seletor de cliente ativo | Cadastro | COPY |
| 97 | frontend/components/layout/DashboardHeader.tsx | src/components/layout/DashboardHeader.tsx | USE_AS_BASE | Header do dashboard | UI Shell | COPY |
| 98 | frontend/components/layout/DashboardLayout.tsx | src/components/layout/DashboardLayout.tsx | USE_AS_BASE | Layout principal com sidebar | UI Shell | COPY |
| 99 | frontend/components/layout/DashboardSidebar.tsx | src/components/layout/DashboardSidebar.tsx | USE_AS_BASE | Sidebar de navegação | UI Shell | COPY |
| 100 | frontend/components/layout/GlobalErrorBoundary.tsx | src/components/layout/GlobalErrorBoundary.tsx | USE_AS_BASE | Error boundary global | UI Shell | COPY |
| 101 | frontend/components/layout/GlobalLoadingIndicator.tsx | src/components/layout/GlobalLoadingIndicator.tsx | USE_AS_BASE | Indicador de loading | UI Shell | COPY |
| 102 | frontend/components/layout/VoiceAssistantButton.tsx | src/components/layout/VoiceAssistantButton.tsx | REFERENCE_ONLY | Assistente de voz (feature específica) | — | STUDY |
| 103-108 | frontend/components/layout/sidebar/*.tsx (6 arquivos) | src/components/layout/sidebar/ | USE_AS_BASE | Seções da sidebar (Accountant, Admin, Common, Footer, Header, Permissions) | UI Shell | COPY |

### 12. Frontend / Components — Integrations

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 109-126 | frontend/components/integracoes/*.tsx (18 arquivos) | src/components/integracoes/ | EXTRACT_LOGIC_ONLY | Componentes de integração SEFAZ, estados, procuração | Integrações | STUDY |

### 13. Frontend / Components — Shell

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 127 | frontend/components/shell/BackButton.tsx | src/components/navigation/BackButton.tsx | USE_AS_BASE | Botão voltar | UI Shell | COPY |

### 14. Frontend / Services

| # | Arquivo Staging | Caminho Original | Tag | Propósito | Módulo-alvo | Class. |
|---|----------------|-----------------|-----|-----------|-------------|--------|
| 128 | frontend/services/supabaseClient.ts | src/integrations/supabase/client.ts | USE_AS_BASE | Cliente Supabase configurado | Backend Base | COPY |
| 129 | frontend/services/supabaseTypes.ts | src/integrations/supabase/types.ts | USE_AS_BASE | Tipos gerados do Supabase | Tipos | COPY |
| 130 | frontend/services/useAuth.tsx | src/contexts/auth/useAuth.tsx | USE_AS_BASE | Hook de autenticação | Auth | COPY |
| 131 | frontend/services/authStore-index.ts | src/contexts/auth/index.ts | USE_AS_BASE | Barrel export auth store | Auth | COPY |
| 132 | frontend/services/supabaseService.ts | src/lib/supabaseService.ts | USE_AS_BASE | Service layer Supabase | Backend Base | COPY |

---

## REPO1 — Conectores ERP (NÃO ACESSÍVEL)

**Fonte:** Contaflux-LR-main 3.zip
**Status:** PENDENTE DE ACESSO
**Tag:** DO_NOT_USE_NOW

| # | Arquivo Planejado | Propósito | Módulo-alvo | Prioridade |
|---|------------------|-----------|-------------|------------|
| 1 | core/erp/ERPProvider.ts | Interface abstrata base ERP | Integrações ERP | CRÍTICA |
| 2 | core/erp/ERPService.ts | Orquestrador de chamadas ERP | Integrações ERP | CRÍTICA |
| 3 | core/erp/mappers/normalizeInvoice.ts | Normalização de faturas | Documentos | ALTA |
| 4 | core/erp/mappers/normalizeNFeXML.ts | Parser XML NFe | Documentos | ALTA |
| 5 | core/erp/mappers/normalizeServiceInvoice.ts | Normalização NFS | Documentos | ALTA |
| 6 | core/erp/providers/BlingProvider.ts | Conector Bling | Integrações ERP | ALTA |
| 7 | core/erp/providers/ContaAzulProvider.ts | Conector Conta Azul | Integrações ERP | ALTA |
| 8 | core/erp/providers/OmieProvider.ts | Conector Omie | Integrações ERP | ALTA |
| 9 | core/erp/providers/TinyProvider.ts | Conector Tiny | Integrações ERP | ALTA |

---

## OCA — Referência Fiscal Brasileira (l10n-brazil)

**Fonte:** https://github.com/OCA/l10n-brazil
**Licença:** AGPL-3.0 (exceto spec_driven_model: LGPL-3)
**Tag:** REFERENCE_ONLY + LICENSE_REVIEW_REQUIRED
**Status:** EXTRAÍDO COM SUCESSO (480 arquivos)

| # | Módulo | Versão | Arquivos | Licença | Propósito | Uso Permitido |
|---|--------|--------|----------|---------|-----------|---------------|
| 1 | l10n_br_fiscal | 18.0.7.2.1 | 203 | AGPL-3 | Motor fiscal completo (impostos, NCM, CFOP, CST) | Estudar taxonomias |
| 2 | l10n_br_fiscal_dfe | 18.0.1.2.0 | 25 | AGPL-3 | Distribuição de DFe (docs fiscais eletrônicos) | Estudar fluxo |
| 3 | l10n_br_fiscal_certificate | 18.0.1.2.0 | 24 | AGPL-3 | Gestão certificados digitais A1 | Estudar modelo |
| 4 | l10n_br_fiscal_edi | 18.0.2.0.0 | 36 | AGPL-3 | EDI fiscal (transmissão/recepção eletrônica) | Estudar protocolo |
| 5 | l10n_br_nfse | 18.0.4.0.1 | 32 | AGPL-3 | Emissão NFS-e | Estudar fluxo NFS-e |
| 6 | spec_driven_model | 18.0.1.1.2 | 29 | **LGPL-3** | XML binding (XSD → modelos) | Estudar abordagem |
| 7 | l10n_br_sped_base | 18.0.1.0.1 | 21 | AGPL-3 | Framework SPED (ECD, ECF, EFD) | Estudar estrutura |
| 8 | l10n_br_cnpj_search | 18.0.1.0.2 | 37 | AGPL-3 | Consulta CNPJ (ReceitaWS, Serpro) | Estudar integração |
| 9 | l10n_br_hr | 18.0.1.2.0 | 37 | AGPL-3 | Localização RH (CBO, deficiência, etnia) | Estudar modelo dados |
| 10 | l10n_br_hr_contract | 18.0.1.1.0 | 36 | AGPL-3 | Contrato trabalho (admissão, rescisão, regime) | Estudar modelo dados |

**ALERTA:** NÃO copiar código Python/XML. Usar APENAS como referência conceitual de domínio.

---

## ESTATÍSTICAS POR TAG

| Tag | Quantidade | Descrição |
|-----|-----------|-----------|
| USE_AS_BASE | ~55 | Reuso direto viável (infra, auth, email, layout, tipos) |
| EXTRACT_LOGIC_ONLY | ~65 | Lógica aproveitável mas precisa adaptação |
| REFERENCE_ONLY | ~495 | Apenas referência (OCA + itens específicos Repo2) |
| LICENSE_REVIEW_REQUIRED | 480 | Todos os módulos OCA |
| DO_NOT_USE_NOW | 9 | Repo1 (pendente de acesso) |

## ESTATÍSTICAS POR CLASSIFICAÇÃO

| Classificação | Quantidade | Descrição |
|---------------|-----------|-----------|
| COPY_CANDIDATE | ~45 | Pode ser adaptado e incorporado ao produto novo |
| STUDY_CANDIDATE | ~570 | Serve como referência de domínio, fluxo ou arquitetura |
