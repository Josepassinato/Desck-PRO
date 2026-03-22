# CARD 010 - Separar COPY_CANDIDATE de STUDY_CANDIDATE (REVISADO)

> **Objetivo**: Classificar cada item extraido no staging como candidato a copia direta
> (reuso estrutural/logico) ou como candidato a estudo (referencia de dominio, taxonomia,
> fluxo ou arquitetura).
>
> **REVISAO 2026-03-20**: Adicionada classificacao CONTAFLUX_SCOPE para itens cuja
> funcionalidade pertence a ContaFlux, nao ao Produto Novo. Contexto do produto corrigido.

## Contexto do Novo Produto (DEFINICAO CORRIGIDA)

SaaS para escritorios de contabilidade com dois pilares:

1. **Diagnostico de migracao** (6 dimensoes): elegibilidade legal, viabilidade economica,
   prontidao operacional, qualidade documental, custos de pessoal, readiness + plano de implantacao
2. **Camada operacional continua**: captura dados (ERP, banco, documentos, folha) e
   prepara/envia estruturados para a **ContaFlux** (cerebro fiscal-contabil)

O Produto Novo **NAO** implementa: motor IRPJ/CSLL/PIS/COFINS, LALUR/LACS, SPED ECF,
escrituracao contabil definitiva. Isso pertence a ContaFlux.

---

## 1. COPY_CANDIDATE (Reuso Estrutural/Logico)

Itens com alto potencial de reaproveitamento direto (com adaptacoes pontuais) no
novo produto. Origem: Repo2 (proprietario).

| # | Item | Caminho no Staging | Justificativa |
|---|------|--------------------|---------------|
| C01 | **AuthProvider + AuthContext** | `repo2_base_candidates/backend/routes/AuthProvider.tsx`, `AuthContext.tsx` | Infraestrutura de autenticacao e universal; modelo de contexto React reutilizavel diretamente. |
| C02 | **authService + authUtils** | `repo2_base_candidates/backend/routes/authService.ts`, `authUtils.ts` | Logica de login/logout/refresh. Agnostica ao dominio fiscal. |
| C03 | **useAuth hook** | `repo2_base_candidates/frontend/services/useAuth.tsx` | Hook padrao de autenticacao React. Reutilizavel sem alteracao significativa. |
| C04 | **authStore-index** | `repo2_base_candidates/frontend/services/authStore-index.ts` | Gerenciamento de estado de auth no frontend. |
| C05 | **Componentes Auth UI** | `repo2_base_candidates/frontend/components/auth/*` (LoginForm, SignupForm, InviteSignupForm, AdminRoute, AuthHeader, AuthFooter, QuickLoginButtons) | Formularios e rotas de autenticacao. Layout e fluxo reutilizaveis; copiar e adaptar branding. |
| C06 | **Security Services** | `repo2_base_candidates/backend/securityService.ts`, `security-monitor.ts`, `secure-api.ts`, `authSecurityValidator.ts`, `rlsValidator.ts` | Padroes de seguranca (rate limiting, validacao RLS, monitoramento). Infraestrutura reusavel. |
| C07 | **DashboardLayout + Sidebar** | `repo2_base_candidates/frontend/components/layout/*` (DashboardLayout, DashboardHeader, DashboardSidebar, sidebar/*) | Shell de UI (sidebar, header, layout responsivo). Estrutura reusavel; trocar itens de menu. |
| C08 | **GlobalErrorBoundary + GlobalLoadingIndicator** | `repo2_base_candidates/frontend/components/layout/GlobalErrorBoundary.tsx`, `GlobalLoadingIndicator.tsx` | Componentes utilitarios de UX universais. |
| C09 | **ClientSelector** | `repo2_base_candidates/frontend/components/layout/ClientSelector.tsx` | Seletor de cliente para escritorio multi-tenant. Conceito identico no novo produto. |
| C10 | **Email Services** | `repo2_base_candidates/backend/services/email/*` (emailService, sendEmail, scheduleEmailService, templateEmailService, templateService, supabaseEmailClient, types) | Infraestrutura completa de emails transacionais e agendados. Reutilizavel com novos templates. |
| C11 | **Supabase Client + Types** | `repo2_base_candidates/frontend/services/supabaseClient.ts`, `supabaseService.ts`, `supabaseTypes.ts` | Camada de dados Supabase. Reutilizavel; atualizar types para novo schema. |
| C12 | **Queue Processor** | `repo2_base_candidates/backend/tasks/queue-processor.ts` | Infraestrutura de fila de tarefas. Padrao reutilizavel independente do dominio. |
| C13 | **Validation Service** | `repo2_base_candidates/backend/tasks/validation-service.ts` | Servico de validacao generico. Adaptar regras para Lucro Real. |
| C14 | **Data Ingestion Task** | `repo2_base_candidates/backend/tasks/process-data-ingestion.ts` | Pipeline de ingestao de dados. Estrutura reutilizavel. |
| C15 | **BackButton** | `repo2_base_candidates/frontend/components/shell/BackButton.tsx` | Componente UI simples e universal. |
| C16 | **Certificados Digitais Service** | `repo2_base_candidates/backend/services/governamental/certificadosDigitaisService.ts` | Gestao de certificados A1/A3 necessaria em qualquer produto fiscal brasileiro. |
| C17 | **Tributos Base** | `repo2_base_candidates/backend/services/fiscal/calculadores/tributosBase.ts` | Calculo de tributos base (PIS, COFINS, ISS base). Estrutura reutilizavel, adaptar aliquotas. |

---

## 2. STUDY_CANDIDATE (Referencia de Dominio)

Itens que servem como referencia de dominio, arquitetura ou taxonomia, mas que
precisam de reescrita substancial ou possuem restricoes de licenca.

| # | Item | Caminho no Staging | Justificativa |
|---|------|--------------------|---------------|
| S01 | **Calculador Simples Nacional** | `repo2_base_candidates/backend/services/fiscal/calculadores/simplesNacional.ts` | Especifico ao regime Simples Nacional. O novo produto foca em Lucro Real; logica completamente diferente. Estudar estrutura de calculador, reescrever motor. |
| S02 | **Tributos Estadual** | `repo2_base_candidates/backend/services/fiscal/calculadores/tributosEstadual.ts` | ICMS estadual tem particularidades que mudam significativamente no Lucro Real (credito de ICMS). Estudar modelo; reescrever para aproveitamento de creditos. |
| S03 | **Tributos Trabalhistas** | `repo2_base_candidates/backend/services/fiscal/calculadores/tributosTrabalhistas.ts` | Referencia para custos de pessoal. Estudar estrutura; adaptar para modulo de custos Lucro Real. |
| S04 | **SEFAZ Scraper Service** | `repo2_base_candidates/backend/services/governamental/sefazScraperService.ts` | Abordagem de screen-scraping fragil. Estudar para entender fluxo SEFAZ; implementar via API oficial ou abordagem mais robusta. |
| S05 | **SEFAZ Automatic Service** | `repo2_base_candidates/backend/services/governamental/sefazAutomaticService.ts` | Automacao SEFAZ. Referencia de fluxo; reimplementar com arquitetura mais resiliente. |
| S06 | **SEFAZ API/XML Services** | `repo2_base_candidates/backend/services/governamental/sefaz/*` (apiIntegration, estadualApiService, xmlUploadService, common, types, santaCatarina, procuracaoIntegracao) | Integracao SEFAZ estadual. Referencia de endpoints e formatos XML; adaptar para necessidades Lucro Real. |
| S07 | **Procuracao Service (completo)** | `repo2_base_candidates/backend/services/governamental/procuracaoService/*` | Fluxo de procuracao eletronica e-CAC. Estudar workflow completo; avaliar se pode ser simplificado no novo produto. |
| S08 | **e-CAC Integration** | `repo2_base_candidates/backend/services/governamental/ecacIntegration.ts`, `ecacService.ts` | Integracao com e-CAC. Referencia de fluxo; complexidade alta, necessita reimplementacao cuidadosa. |
| S09 | **Serpro Integration** | `repo2_base_candidates/backend/services/governamental/serproIntegrationService.ts` | Consultas via Serpro. Estudar endpoints disponiveis; avaliar necessidade no novo produto. |
| S10 | **Simples Nacional Integration** | `repo2_base_candidates/backend/services/governamental/simplesNacionalIntegration.ts`, `declaracoesSimplesNacionalService.ts` | Especifico ao regime que o cliente esta SAINDO. Referencia para entender situacao atual do cliente durante diagnostico de migracao. |
| S11 | **Automacao Bancaria** | `repo2_base_candidates/backend/services/bancario/*` (automacaoBancaria, openBankingService, pagamentoAutomatico, pagamentoService, pixService, pixTypes) | Complexidade alta, especifico ao produto atual. Estudar arquitetura; reconciliacao bancaria precisa ser reescrita para Lucro Real. |
| S12 | **Reconciliacao Bancaria** | `repo2_base_candidates/backend/services/fiscal/reconciliacao/*` (reconciliacaoBancaria, detecaoPadroes, aprendizadoMaquina) | ML e deteccao de padroes. Estudar abordagem; reescrever com foco em conciliacao contabil Lucro Real. |
| S13 | **Fiscal Workflow Service** | `repo2_base_candidates/backend/services/fiscal/workflow/fiscalWorkflowService.ts` | Workflow fiscal. Estudar orquestracao; redesenhar para fluxos de Lucro Real. |
| S14 | **Calculo Fiscal + DARF** | `repo2_base_candidates/backend/services/fiscal/calculoFiscal.ts`, `darfService.ts` | Calculos fiscais e geracao DARF. Estudar estrutura; reescrever para IRPJ/CSLL Lucro Real. |
| S15 | **Notas Fiscais Service + Processor** | `repo2_base_candidates/backend/services/fiscal/integration/notasFiscaisService.ts`, `processadores/notasFiscaisProcessor.ts` | Pipeline de notas fiscais. Estudar modelo de dados; adaptar para escrituracao Lucro Real. |
| S16 | **Lancamentos Processor** | `repo2_base_candidates/backend/services/fiscal/processadores/lancamentosProcessor.ts` | Processador de lancamentos contabeis. **CONTAFLUX_SCOPE**: lancamentos contabeis finais pertencem a ContaFlux. Estudar para entender formato de dados que o Produto Novo deve preparar e enviar. |
| S17 | **Contabil Service + Config** | `repo2_base_candidates/backend/services/fiscal/integration/contabilService.ts`, `integracoesConfig.ts` | Integracao contabil. Estudar modelo; adaptar para integracao com ContaFlux. |
| S18 | **Classify Document + OCR + NLP** | `repo2_base_candidates/backend/classify-document.ts`, `process-ocr-documents.ts`, `nlp-document-analysis.ts` | Pipeline de classificacao e OCR de documentos. Estudar abordagem; adaptar para documentos de migracao Lucro Real. |
| S19 | **Compliance Automation** | `repo2_base_candidates/backend/tasks/compliance-automation.ts` | Automacao de compliance. Estudar regras; reescrever para obrigacoes de Lucro Real. |
| S20 | **Accounting Entry/Automation Tasks** | `repo2_base_candidates/backend/tasks/process-accounting-automation.ts`, `process-accounting-entry.ts` | Processamento contabil automatizado. **CONTAFLUX_SCOPE**: automacao contabil definitiva pertence a ContaFlux. Estudar para entender formato de dados a preparar para envio. |
| S21 | **Paginas Especificas** | `repo2_base_candidates/frontend/pages/*` (ClientDocuments, GerenciarClientes, IntegracoesEstaduais, IntegracoesGov, RegimeFiscal, Settings) | Paginas fortemente acopladas ao UX do produto atual. Estudar modelo de dados e fluxos de usuario. |
| S22 | **Componentes de Integracoes** | `repo2_base_candidates/frontend/components/integracoes/*` | Componentes UI especificos de integracoes governamentais. Estudar padroes de formulario; reimplementar para novo produto. |
| S23 | **Integracoes Service (backend routes)** | `repo2_base_candidates/backend/routes/integracoesService.ts`, `integracoesEstadualService.ts` | Servicos de integracoes. Estudar endpoints; redesenhar para novo produto. |
| S24 | **OCA l10n_br_fiscal** | `oca_reference_candidates/` (pendente de copia) | Motor fiscal brasileiro completo. AGPL-3.0. REFERENCE_ONLY. Estudar taxonomia fiscal, tipos de documentos, modelos de calculo. |
| S25 | **OCA l10n_br_fiscal_dfe** | `oca_reference_candidates/` (pendente de copia) | DFe. AGPL-3.0. Estudar fluxo de emissao/recepcao de documentos fiscais eletronicos. |
| S26 | **OCA l10n_br_nfse** | `oca_reference_candidates/` (pendente de copia) | NFS-e. AGPL-3.0. Estudar modelo de emissao de nota de servico. |
| S27 | **OCA l10n_br_sped_base** | `oca_reference_candidates/` (pendente de copia) | Base SPED. AGPL-3.0. Estudar estrutura de blocos e registros SPED (essencial para ECF). |
| S28 | **OCA spec_driven_model** | `oca_reference_candidates/` (pendente de copia) | Geracao de modelos a partir de XSD. AGPL-3.0. Estudar abordagem para gerar tipos a partir de schemas oficiais. |
| S29 | **OCA l10n_br_hr + hr_contract** | `oca_reference_candidates/` (pendente de copia) | RH Brasil. AGPL-3.0. Estudar modelo de custos de pessoal e encargos trabalhistas. |
| S30 | **OCA l10n_br_cnpj_search** | `oca_reference_candidates/` (pendente de copia) | Consulta CNPJ. AGPL-3.0. Estudar abordagem de validacao e enriquecimento de dados cadastrais. |
| S31 | **OCA l10n_br_fiscal_certificate** | `oca_reference_candidates/` (pendente de copia) | Gestao de certificados. AGPL-3.0. Estudar modelo (comparar com C16 proprietario). |
| S32 | **OCA l10n_br_fiscal_edi** | `oca_reference_candidates/` (pendente de copia) | EDI fiscal. AGPL-3.0. Estudar protocolos de comunicacao com SEFAZ. |
| S33 | **Repo1 ERP Connectors** | `repo1_connector_candidates/` (pendente de copia) | ERPProvider, ERPService, mappers, providers (Bling, ContaAzul, Omie, Tiny). Licenca desconhecida. Estudar padrao de abstraction layer para ERPs. |

---

## 3. Decisoes de Borda (Borderline)

| Item | Decisao | Justificativa |
|------|---------|---------------|
| **Certificados Digitais Service** (C16) | COPY_CANDIDATE | Embora seja governamental, a gestao de certificados A1/A3 e identica em qualquer regime fiscal. Logica de upload, validacao de validade e armazenamento e generica. |
| **Tributos Base** (C17) | COPY_CANDIDATE | Estrutura base de calculo de tributos (aliquotas, bases de calculo, faixas) e reutilizavel. As aliquotas mudam, mas o motor e o mesmo. |
| **VoiceAssistantButton** | Excluido | Funcionalidade de voz nao e prioridade para MVP do novo produto. Nao classificado. |
| **Login page** | COPY_CANDIDATE (via C05) | Pagina de login e generica; incluida nos componentes Auth UI. |
| **Settings page** (S21) | STUDY_CANDIDATE | Embora settings seja comum, esta muito acoplada ao produto atual. Melhor redesenhar. |
| **Fiscal Types** | STUDY_CANDIDATE (via S14) | Tipos fiscais provavelmente precisam de revisao significativa para Lucro Real. |
| **Repo1 Connectors** (S33) | STUDY_CANDIDATE | Licenca desconhecida impede copia direta. Padrao de abstraction layer e valioso como referencia. |

---

## 4. CONTAFLUX_SCOPE (Funcionalidade pertence a ContaFlux)

> **REVISAO 2026-03-20**: Nova classificacao adicionada.

Itens cuja funcionalidade pertence a ContaFlux, nao ao Produto Novo.
Permanecem como STUDY_CANDIDATE (para entender formato de dados),
mas o Produto Novo NAO implementa a logica — apenas prepara dados para envio.

| # | Item | Caminho no Staging | Justificativa |
|---|------|--------------------|---------------|
| S16 | **Lancamentos Processor** | `repo2_base_candidates/backend/services/fiscal/processadores/lancamentosProcessor.ts` | Lancamentos contabeis finais sao responsabilidade da ContaFlux. Estudar para entender formato de dados que o Produto Novo deve preparar e enviar. |
| S20 | **Accounting Entry/Automation Tasks** | `repo2_base_candidates/backend/tasks/process-accounting-automation.ts`, `process-accounting-entry.ts` | Automacao contabil definitiva pertence a ContaFlux. Estudar para entender formato de dados. |

> **NOTA**: Estes itens continuam no staging como referencia de dominio.
> O Produto Novo precisa conhecer a ESTRUTURA dos dados (lancamentos, entradas contabeis)
> para preparar pacotes de envio a ContaFlux, mas NAO implementa a logica de escrituracao.

---

## Resumo Quantitativo (REVISADO)

| Classificacao | Quantidade | Origem |
|---------------|------------|--------|
| COPY_CANDIDATE | 17 itens | Todos de Repo2 (proprietario) |
| STUDY_CANDIDATE | 31 itens | 19 de Repo2, 9 de OCA (AGPL-3.0), 3 de Repo1 (licenca desconhecida) |
| CONTAFLUX_SCOPE | 2 itens | Repo2 (funcionalidade pertence a ContaFlux) |

## Proximos Passos

1. **COPY_CANDIDATEs**: Iniciar adaptacao quando autorizado, priorizando auth + layout + email
2. **STUDY_CANDIDATEs**: Documentar aprendizados de dominio durante fase de design
3. **CONTAFLUX_SCOPE**: Estudar para entender formato de dados a preparar para envio
4. **OCA items**: Completar clonagem do repositorio para estudo (ver CARD 011 para riscos)
5. **Repo1 items**: Verificar licenca antes de qualquer uso (ver CARD 011)
