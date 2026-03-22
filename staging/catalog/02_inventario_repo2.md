# 02 - Inventario Repo2: aura-contabilidade-autom

> **Fonte**: aura-contabilidade-autom (React/TypeScript SaaS contabil com Supabase backend)
> **Data do inventario**: 2026-03-20
> **Diretorio staging**: `staging/repo2_base_candidates/`
> **Total de arquivos**: 113

---

## Sumario

| Metrica | Valor |
|---------|-------|
| Total de arquivos no staging | 113 |
| Backend (services/routes/tasks/raiz) | 81 |
| Frontend (pages/components/services) | 32 |

---

## Backend — Routes

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 1 | backend/routes/AuthContext.tsx | src/contexts/auth/AuthContext.tsx | arquivo | EXTRACT_LOGIC_ONLY | Contexto React de autenticacao com Supabase | Extrair fluxo auth para backend puro |
| 2 | backend/routes/AuthProvider.tsx | src/contexts/auth/AuthProvider.tsx | arquivo | EXTRACT_LOGIC_ONLY | Provider de autenticacao com sessao Supabase | Extrair logica de sessao/estado auth |
| 3 | backend/routes/authService.ts | src/services/auth/authService.ts | arquivo | USE_AS_BASE | Servico de login/logout/refresh token | Base para auth service no backend NestJS |
| 4 | backend/routes/authUtils.ts | src/services/auth/authUtils.ts | arquivo | USE_AS_BASE | Utilitarios de validacao de sessao | Helpers de auth reutilizaveis |
| 5 | backend/routes/integracoesEstadualService.ts | src/services/supabase/integracoesEstadualService.ts | arquivo | USE_AS_BASE | Integracoes estaduais via Supabase | Base para API de integracoes estaduais |
| 6 | backend/routes/integracoesService.ts | src/services/supabase/integracoesService.ts | arquivo | USE_AS_BASE | Integracoes governamentais via Supabase | Base para API de integracoes gov |

## Backend — Seguranca (raiz)

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 7 | backend/authSecurityValidator.ts | src/services/security/authSecurityValidator.ts | arquivo | USE_AS_BASE | Validacao de seguranca de auth requests | Middleware de validacao auth |
| 8 | backend/rlsValidator.ts | src/services/security/rlsValidator.ts | arquivo | REFERENCE_ONLY | Validacao de RLS policies do Supabase | Referencia para design de permissoes |
| 9 | backend/securityService.ts | src/services/security/securityService.ts | arquivo | USE_AS_BASE | Servico central de seguranca e RBAC | Base para RBAC no backend |
| 10 | backend/secure-api.ts | supabase/functions/secure-api/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Edge function de API segura com validacao | Extrair middleware de seguranca |
| 11 | backend/security-monitor.ts | supabase/functions/security-monitor/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Monitor de eventos de seguranca | Extrair logica de monitoramento |

## Backend — Document Processing (raiz)

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 12 | backend/classify-document.ts | supabase/functions/classify-document/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Classificacao automatica de documentos via IA | Extrair logica de classificacao |
| 13 | backend/nlp-document-analysis.ts | supabase/functions/nlp-document-analysis/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Analise NLP de documentos contabeis | Extrair motor NLP |
| 14 | backend/process-ocr-documents.ts | supabase/functions/process-ocr-documents/index.ts | arquivo | EXTRACT_LOGIC_ONLY | OCR e extracao de dados de documentos | Extrair pipeline OCR |

## Backend — Tasks

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 15 | backend/tasks/compliance-automation.ts | supabase/functions/compliance-automation/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Automacao de compliance fiscal | Extrair regras de compliance para worker |
| 16 | backend/tasks/process-accounting-automation.ts | supabase/functions/process-accounting-automation/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Processamento automatico de lancamentos contabeis | Extrair pipeline contabil |
| 17 | backend/tasks/process-accounting-entry.ts | supabase/functions/process-accounting-entry/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Processamento de entrada contabil individual | Extrair logica de lancamentos |
| 18 | backend/tasks/process-data-ingestion.ts | supabase/functions/process-data-ingestion/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Ingestao de dados de multiplas fontes | Extrair pipeline de ingestao |
| 19 | backend/tasks/queue-processor.ts | supabase/functions/queue-processor/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Processador generico de fila | Extrair padrao de fila para BullMQ |
| 20 | backend/tasks/validation-service.ts | supabase/functions/validation-service/index.ts | arquivo | EXTRACT_LOGIC_ONLY | Servico de validacao de dados | Extrair regras de validacao |

## Backend — Services: Bancario

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 21 | backend/services/bancario/automacaoBancaria.ts | src/services/bancario/automacaoBancaria.ts | arquivo | USE_AS_BASE | Automacao de operacoes bancarias e Open Banking | Base para integracao bancaria |
| 22 | backend/services/bancario/openBankingService.ts | src/services/bancario/openBankingService.ts | arquivo | USE_AS_BASE | Integracao Open Banking Brasil | Base para API Open Banking |
| 23 | backend/services/bancario/pagamentoAutomatico.ts | src/services/bancario/pagamentoAutomatico.ts | arquivo | USE_AS_BASE | Pagamento automatico de guias e boletos | Base para agendamento de pagamentos |
| 24 | backend/services/bancario/pagamentoService.ts | src/services/bancario/pagamentoService.ts | arquivo | USE_AS_BASE | Servico central de pagamentos | Base para processamento de pagamentos |
| 25 | backend/services/bancario/pixService.ts | src/services/bancario/pixService.ts | arquivo | USE_AS_BASE | Integracao Pix (DICT, cobrancas) | Base para modulo Pix |
| 26 | backend/services/bancario/pixTypes.ts | src/services/bancario/pixTypes.ts | arquivo | USE_AS_BASE | Tipos TypeScript para Pix | Reusar tipagem Pix |

## Backend — Services: Email

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 27 | backend/services/email/emailService.ts | src/services/email/emailService.ts | arquivo | USE_AS_BASE | Servico central de envio de emails | Base para servico de email |
| 28 | backend/services/email/scheduleEmailService.ts | src/services/email/scheduleEmailService.ts | arquivo | USE_AS_BASE | Agendamento de envio de emails | Base para email scheduling |
| 29 | backend/services/email/sendEmail.ts | src/services/email/sendEmail.ts | arquivo | USE_AS_BASE | Funcao de envio de email (Resend/SMTP) | Base para envio de email |
| 30 | backend/services/email/supabaseEmailClient.ts | src/services/email/supabaseEmailClient.ts | arquivo | EXTRACT_LOGIC_ONLY | Cliente de email via Supabase | Extrair e adaptar para novo backend |
| 31 | backend/services/email/templateEmailService.ts | src/services/email/templateEmailService.ts | arquivo | USE_AS_BASE | Servico de emails com templates | Base para sistema de templates |
| 32 | backend/services/email/templateService.ts | src/services/email/templateService.ts | arquivo | USE_AS_BASE | Gerenciamento de templates de email | Base para CRUD de templates |
| 33 | backend/services/email/types.ts | src/services/email/types.ts | arquivo | USE_AS_BASE | Tipos TypeScript do servico de email | Reusar tipagem de email |

## Backend — Services: Send Email (standalone)

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 34 | backend/services/send-email.ts | src/services/send-email.ts | arquivo | REFERENCE_ONLY | Wrapper legado de envio de email | Referencia — logica ja presente em email/* |

## Backend — Services: Fiscal — Calculadores

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 35 | backend/services/fiscal/calculadores/simplesNacional.ts | src/services/fiscal/calculadores/simplesNacional.ts | arquivo | USE_AS_BASE | Calculo de tributos Simples Nacional | Base para motor fiscal SN |
| 36 | backend/services/fiscal/calculadores/tributosBase.ts | src/services/fiscal/calculadores/tributosBase.ts | arquivo | USE_AS_BASE | Calculo base de tributos (PIS, COFINS, IRPJ, CSLL) | Base para motor tributos federais |
| 37 | backend/services/fiscal/calculadores/tributosEstadual.ts | src/services/fiscal/calculadores/tributosEstadual.ts | arquivo | USE_AS_BASE | Calculo ICMS, ICMS-ST, DIFAL | Base para motor tributos estaduais |
| 38 | backend/services/fiscal/calculadores/tributosTrabalhistas.ts | src/services/fiscal/calculadores/tributosTrabalhistas.ts | arquivo | USE_AS_BASE | Calculo encargos trabalhistas (INSS, FGTS, IRRF) | Base para motor de folha/encargos |

## Backend — Services: Fiscal — Core

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 39 | backend/services/fiscal/calculoFiscal.ts | src/services/fiscal/calculoFiscal.ts | arquivo | USE_AS_BASE | Orquestrador de calculos fiscais | Base para facade do motor fiscal |
| 40 | backend/services/fiscal/darfService.ts | src/services/fiscal/darfService.ts | arquivo | USE_AS_BASE | Geracao e controle de DARFs | Base para emissao de DARF |
| 41 | backend/services/fiscal/types.ts | src/services/fiscal/types.ts | arquivo | USE_AS_BASE | Tipos TypeScript fiscais | Reusar tipagem fiscal |

## Backend — Services: Fiscal — Integration

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 42 | backend/services/fiscal/integration/contabilService.ts | src/services/fiscal/integration/contabilService.ts | arquivo | EXTRACT_LOGIC_ONLY | Integracao fiscal para contabil | Extrair logica de integracao |
| 43 | backend/services/fiscal/integration/index.ts | src/services/fiscal/integration/index.ts | arquivo | USE_AS_BASE | Barrel export do modulo de integracao | Reusar barrel exports |
| 44 | backend/services/fiscal/integration/integracoesConfig.ts | src/services/fiscal/integration/integracoesConfig.ts | arquivo | USE_AS_BASE | Configuracoes de integracoes fiscais | Base para config de integracoes |
| 45 | backend/services/fiscal/integration/notasFiscaisService.ts | src/services/fiscal/integration/notasFiscaisService.ts | arquivo | USE_AS_BASE | Servico de notas fiscais | Base para gestao de NFs |
| 46 | backend/services/fiscal/integration/types.ts | src/services/fiscal/integration/types.ts | arquivo | USE_AS_BASE | Tipos de integracao fiscal | Reusar tipagem de integracao |

## Backend — Services: Fiscal — Processadores

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 47 | backend/services/fiscal/processadores/lancamentosProcessor.ts | src/services/fiscal/processadores/lancamentosProcessor.ts | arquivo | USE_AS_BASE | Processador de lancamentos contabeis | Base para pipeline de lancamentos |
| 48 | backend/services/fiscal/processadores/notasFiscaisProcessor.ts | src/services/fiscal/processadores/notasFiscaisProcessor.ts | arquivo | USE_AS_BASE | Processador de notas fiscais | Base para pipeline de NFs |

## Backend — Services: Fiscal — Reconciliacao

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 49 | backend/services/fiscal/reconciliacao/aprendizadoMaquina.ts | src/services/fiscal/reconciliacao/aprendizadoMaquina.ts | arquivo | EXTRACT_LOGIC_ONLY | ML para reconciliacao bancaria | Extrair algoritmos ML |
| 50 | backend/services/fiscal/reconciliacao/detecaoPadroes.ts | src/services/fiscal/reconciliacao/detecaoPadroes.ts | arquivo | EXTRACT_LOGIC_ONLY | Deteccao de padroes em transacoes | Extrair logica de pattern matching |
| 51 | backend/services/fiscal/reconciliacao/reconciliacaoBancaria.ts | src/services/fiscal/reconciliacao/reconciliacaoBancaria.ts | arquivo | USE_AS_BASE | Motor de reconciliacao bancaria automatica | Base para conciliacao bancaria |
| 52 | backend/services/fiscal/reconciliacao/resolucaoAutonoma.ts | src/services/fiscal/reconciliacao/resolucaoAutonoma.ts | arquivo | EXTRACT_LOGIC_ONLY | Resolucao autonoma de divergencias | Extrair heuristicas de resolucao |

## Backend — Services: Fiscal — Workflow

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 53 | backend/services/fiscal/workflow/fiscalWorkflowService.ts | src/services/fiscal/workflow/fiscalWorkflowService.ts | arquivo | USE_AS_BASE | Workflow fiscal automatizado (obrigacoes, prazos) | Base para engine de workflow |

## Backend — Services: Governamental — Core

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 54 | backend/services/governamental/apiIntegration.ts | src/services/governamental/apiIntegration.ts | arquivo | USE_AS_BASE | Integracao com APIs governamentais | Base para gateway gov |
| 55 | backend/services/governamental/certificadosDigitaisService.ts | src/services/governamental/certificadosDigitaisService.ts | arquivo | USE_AS_BASE | Gestao de certificados digitais A1/A3 | Base para servico de certificados |
| 56 | backend/services/governamental/declaracoesSimplesNacionalService.ts | src/services/governamental/declaracoesSimplesNacionalService.ts | arquivo | USE_AS_BASE | Declaracoes do Simples Nacional (PGDAS-D, DEFIS) | Base para automacao de declaracoes SN |
| 57 | backend/services/governamental/ecacIntegration.ts | src/services/governamental/ecacIntegration.ts | arquivo | USE_AS_BASE | Integracao com e-CAC da Receita Federal | Base para conector e-CAC |
| 58 | backend/services/governamental/ecacService.ts | src/services/governamental/ecacService.ts | arquivo | USE_AS_BASE | Servico de operacoes no e-CAC | Base para consultas e-CAC |
| 59 | backend/services/governamental/estadualIntegration.ts | src/services/governamental/estadualIntegration.ts | arquivo | USE_AS_BASE | Integracao com sistemas estaduais | Base para gateway SEFAZ |
| 60 | backend/services/governamental/sefazAutomaticService.ts | src/services/governamental/sefazAutomaticService.ts | arquivo | USE_AS_BASE | Automacao de operacoes SEFAZ | Base para automacao SEFAZ |
| 61 | backend/services/governamental/sefazScraperService.ts | src/services/governamental/sefazScraperService.ts | arquivo | EXTRACT_LOGIC_ONLY | Scraping de dados da SEFAZ | Extrair logica de scraping |
| 62 | backend/services/governamental/serproIntegrationService.ts | src/services/governamental/serproIntegrationService.ts | arquivo | USE_AS_BASE | Integracao com Serpro (CNPJ, CPF) | Base para conector Serpro |
| 63 | backend/services/governamental/simplesNacionalIntegration.ts | src/services/governamental/simplesNacionalIntegration.ts | arquivo | USE_AS_BASE | Integracao com portal Simples Nacional | Base para consultas SN |

## Backend — Services: Governamental — Procuracao

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 64 | backend/services/governamental/procuracaoService/ecacProcuracao.ts | src/services/governamental/procuracaoService/ecacProcuracao.ts | arquivo | USE_AS_BASE | Gestao de procuracoes no e-CAC | Base para modulo de procuracao eletronica |
| 65 | backend/services/governamental/procuracaoService/ecacProcuracaoComprovante.ts | src/services/governamental/procuracaoService/ecacProcuracaoComprovante.ts | arquivo | USE_AS_BASE | Geracao de comprovantes de procuracao | Base para emissao de comprovantes |
| 66 | backend/services/governamental/procuracaoService/ecacProcuracaoEmissao.ts | src/services/governamental/procuracaoService/ecacProcuracaoEmissao.ts | arquivo | USE_AS_BASE | Emissao de procuracoes eletronicas | Base para fluxo de emissao |
| 67 | backend/services/governamental/procuracaoService/ecacProcuracaoProcesso.ts | src/services/governamental/procuracaoService/ecacProcuracaoProcesso.ts | arquivo | USE_AS_BASE | Acompanhamento de processos de procuracao | Base para tracking de processos |
| 68 | backend/services/governamental/procuracaoService/index.ts | src/services/governamental/procuracaoService/index.ts | arquivo | USE_AS_BASE | Barrel export do servico de procuracao | Reusar barrel exports |
| 69 | backend/services/governamental/procuracaoService/procuracaoLogger.ts | src/services/governamental/procuracaoService/procuracaoLogger.ts | arquivo | USE_AS_BASE | Logger especializado de procuracao | Base para auditoria |
| 70 | backend/services/governamental/procuracaoService/procuracaoRepository.ts | src/services/governamental/procuracaoService/procuracaoRepository.ts | arquivo | USE_AS_BASE | Repository de dados de procuracao | Base para camada de dados |
| 71 | backend/services/governamental/procuracaoService/procuracaoService.ts | src/services/governamental/procuracaoService/procuracaoService.ts | arquivo | USE_AS_BASE | Servico orquestrador de procuracoes | Base para core procuracao service |
| 72 | backend/services/governamental/procuracaoService/procuracaoStorage.ts | src/services/governamental/procuracaoService/procuracaoStorage.ts | arquivo | EXTRACT_LOGIC_ONLY | Storage de procuracoes (Supabase) | Extrair e adaptar storage |
| 73 | backend/services/governamental/procuracaoService/procuracaoValidador.ts | src/services/governamental/procuracaoService/procuracaoValidador.ts | arquivo | USE_AS_BASE | Validacao de dados de procuracao | Base para regras de validacao |
| 74 | backend/services/governamental/procuracaoService/types.ts | src/services/governamental/procuracaoService/types.ts | arquivo | USE_AS_BASE | Tipos de procuracao | Reusar tipagem de procuracao |

## Backend — Services: Governamental — SEFAZ

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 75 | backend/services/governamental/sefaz/apiIntegration.ts | src/services/governamental/sefaz/apiIntegration.ts | arquivo | USE_AS_BASE | Integracao com API SEFAZ | Base para cliente SEFAZ |
| 76 | backend/services/governamental/sefaz/common.ts | src/services/governamental/sefaz/common.ts | arquivo | USE_AS_BASE | Utilitarios comuns SEFAZ | Reusar helpers SEFAZ |
| 77 | backend/services/governamental/sefaz/estadualApiService.ts | src/services/governamental/sefaz/estadualApiService.ts | arquivo | USE_AS_BASE | API de integracoes estaduais SEFAZ | Base para servico estadual |
| 78 | backend/services/governamental/sefaz/procuracaoIntegracao.ts | src/services/governamental/sefaz/procuracaoIntegracao.ts | arquivo | USE_AS_BASE | Procuracao via SEFAZ | Base para bridge procuracao-SEFAZ |
| 79 | backend/services/governamental/sefaz/santaCatarina.ts | src/services/governamental/sefaz/santaCatarina.ts | arquivo | USE_AS_BASE | Integracao SEFAZ Santa Catarina (SAT) | Base para modulo SC especifico |
| 80 | backend/services/governamental/sefaz/types.ts | src/services/governamental/sefaz/types.ts | arquivo | USE_AS_BASE | Tipos SEFAZ | Reusar tipagem SEFAZ |
| 81 | backend/services/governamental/sefaz/xmlUploadService.ts | src/services/governamental/sefaz/xmlUploadService.ts | arquivo | EXTRACT_LOGIC_ONLY | Upload e parsing de XML SEFAZ | Extrair logica de upload |

## Frontend — Pages

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 82 | frontend/pages/ClientDocuments.tsx | src/pages/ClientDocuments.tsx | arquivo | REFERENCE_ONLY | Pagina de documentos do cliente | Referencia para gestao documental |
| 83 | frontend/pages/GerenciarClientes.tsx | src/pages/GerenciarClientes.tsx | arquivo | REFERENCE_ONLY | Pagina de gerenciamento de clientes | Referencia para CRUD de clientes |
| 84 | frontend/pages/IntegracoesEstaduais.tsx | src/pages/IntegracoesEstaduais.tsx | arquivo | REFERENCE_ONLY | Pagina de integracoes estaduais | Referencia para tela de integracoes |
| 85 | frontend/pages/IntegracoesGov.tsx | src/pages/IntegracoesGov.tsx | arquivo | REFERENCE_ONLY | Pagina de integracoes governamentais | Referencia para tela gov |
| 86 | frontend/pages/Login.tsx | src/pages/Login.tsx | arquivo | REFERENCE_ONLY | Pagina de login | Referencia para tela de auth |
| 87 | frontend/pages/RegimeFiscal.tsx | src/pages/RegimeFiscal.tsx | arquivo | REFERENCE_ONLY | Pagina de regime fiscal | Referencia para tela fiscal |
| 88 | frontend/pages/Settings.tsx | src/pages/Settings.tsx | arquivo | REFERENCE_ONLY | Pagina de configuracoes | Referencia para tela de settings |

## Frontend — Components: Auth

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 89 | frontend/components/auth/AdminRoute.tsx | src/components/auth/AdminRoute.tsx | arquivo | REFERENCE_ONLY | Rota protegida de admin | Referencia para RBAC no frontend |
| 90 | frontend/components/auth/AuthFooter.tsx | src/components/auth/AuthFooter.tsx | arquivo | REFERENCE_ONLY | Footer de telas de auth | Referencia de layout auth |
| 91 | frontend/components/auth/AuthHeader.tsx | src/components/auth/AuthHeader.tsx | arquivo | REFERENCE_ONLY | Header de telas de auth | Referencia de layout auth |
| 92 | frontend/components/auth/InviteSignupForm.tsx | src/components/auth/InviteSignupForm.tsx | arquivo | REFERENCE_ONLY | Form de signup por convite | Referencia para fluxo de onboarding |
| 93 | frontend/components/auth/LoginForm.tsx | src/components/auth/LoginForm.tsx | arquivo | REFERENCE_ONLY | Form de login | Referencia para tela de login |
| 94 | frontend/components/auth/QuickLoginButtons.tsx | src/components/auth/QuickLoginButtons.tsx | arquivo | DO_NOT_USE_NOW | Botoes de login rapido (dev only) | Nao usar — ferramenta de dev |
| 95 | frontend/components/auth/SignupForm.tsx | src/components/auth/SignupForm.tsx | arquivo | REFERENCE_ONLY | Form de cadastro | Referencia para tela de signup |

## Frontend — Components: Integracoes

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 96 | frontend/components/integracoes/EmptyClientState.tsx | src/components/integracoes/EmptyClientState.tsx | arquivo | REFERENCE_ONLY | Estado vazio quando sem cliente selecionado | Referencia de UX empty state |
| 97 | frontend/components/integracoes/EstadoSelector.tsx | src/components/integracoes/EstadoSelector.tsx | arquivo | REFERENCE_ONLY | Seletor de UF | Referencia de selecao de estado |
| 98 | frontend/components/integracoes/IntegracaoEstadualForm.tsx | src/components/integracoes/IntegracaoEstadualForm.tsx | arquivo | REFERENCE_ONLY | Form de integracao estadual | Referencia para formulario estadual |
| 99 | frontend/components/integracoes/IntegracaoEstadualFormWithUpload.tsx | src/components/integracoes/IntegracaoEstadualFormWithUpload.tsx | arquivo | REFERENCE_ONLY | Form estadual com upload de certificado | Referencia para upload de certificados |
| 100 | frontend/components/integracoes/IntegracaoFormsContainer.tsx | src/components/integracoes/IntegracaoFormsContainer.tsx | arquivo | REFERENCE_ONLY | Container de formularios de integracao | Referencia de layout |
| 101 | frontend/components/integracoes/IntegracaoGovForm.tsx | src/components/integracoes/IntegracaoGovForm.tsx | arquivo | REFERENCE_ONLY | Form de integracao governamental | Referencia para form gov |
| 102 | frontend/components/integracoes/IntegracaoStatus.tsx | src/components/integracoes/IntegracaoStatus.tsx | arquivo | REFERENCE_ONLY | Status de integracao individual | Referencia para feedback visual |
| 103 | frontend/components/integracoes/IntegracaoStatusGrid.tsx | src/components/integracoes/IntegracaoStatusGrid.tsx | arquivo | REFERENCE_ONLY | Grid de status de integracoes | Referencia para dashboard de status |
| 104 | frontend/components/integracoes/IntegracoesStatusGrid.tsx | src/components/integracoes/IntegracoesStatusGrid.tsx | arquivo | REFERENCE_ONLY | Grid alternativo de status | Referencia de UX |
| 105 | frontend/components/integracoes/ProcuracaoEletronicaForm.tsx | src/components/integracoes/ProcuracaoEletronicaForm.tsx | arquivo | REFERENCE_ONLY | Form de procuracao eletronica | Referencia para fluxo de procuracao |
| 106 | frontend/components/integracoes/SantaCatarinaIntegracao.tsx | src/components/integracoes/SantaCatarinaIntegracao.tsx | arquivo | REFERENCE_ONLY | Integracao especifica SC | Referencia para UX estadual |
| 107 | frontend/components/integracoes/SefazScrapedDataTable.tsx | src/components/integracoes/SefazScrapedDataTable.tsx | arquivo | REFERENCE_ONLY | Tabela de dados scrapeados da SEFAZ | Referencia para visualizacao |
| 108 | frontend/components/integracoes/SefazScraperButton.tsx | src/components/integracoes/SefazScraperButton.tsx | arquivo | REFERENCE_ONLY | Botao de trigger do scraper | Referencia para acao de scraping |
| 109 | frontend/components/integracoes/SefazXmlUploader.tsx | src/components/integracoes/SefazXmlUploader.tsx | arquivo | REFERENCE_ONLY | Uploader de XML SEFAZ | Referencia para upload |
| 110 | frontend/components/integracoes/SimplesNacionalForm.tsx | src/components/integracoes/SimplesNacionalForm.tsx | arquivo | REFERENCE_ONLY | Form de Simples Nacional | Referencia para form SN |
| 111 | frontend/components/integracoes/UfTabs.tsx | src/components/integracoes/UfTabs.tsx | arquivo | REFERENCE_ONLY | Tabs por UF | Referencia de navegacao |
| 112 | frontend/components/integracoes/constants.ts | src/components/integracoes/constants.ts | arquivo | USE_AS_BASE | Constantes de integracoes (UFs, URLs, configs) | Reusar constantes |

## Frontend — Components: Layout

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 113 | frontend/components/layout/ClientSelector.tsx | src/components/layout/ClientSelector.tsx | arquivo | REFERENCE_ONLY | Seletor de cliente no header | Referencia para UX multi-tenant |
| 114 | frontend/components/layout/DashboardHeader.tsx | src/components/layout/DashboardHeader.tsx | arquivo | REFERENCE_ONLY | Header do dashboard | Referencia de layout |
| 115 | frontend/components/layout/DashboardLayout.tsx | src/components/layout/DashboardLayout.tsx | arquivo | REFERENCE_ONLY | Layout principal do dashboard | Referencia para shell da aplicacao |
| 116 | frontend/components/layout/DashboardSidebar.tsx | src/components/layout/DashboardSidebar.tsx | arquivo | REFERENCE_ONLY | Sidebar do dashboard | Referencia para navegacao |
| 117 | frontend/components/layout/GlobalErrorBoundary.tsx | src/components/layout/GlobalErrorBoundary.tsx | arquivo | REFERENCE_ONLY | Error boundary global | Referencia para tratamento de erros |
| 118 | frontend/components/layout/GlobalLoadingIndicator.tsx | src/components/layout/GlobalLoadingIndicator.tsx | arquivo | REFERENCE_ONLY | Indicador de loading global | Referencia de UX |
| 119 | frontend/components/layout/VoiceAssistantButton.tsx | src/components/layout/VoiceAssistantButton.tsx | arquivo | DO_NOT_USE_NOW | Botao de assistente de voz | Funcionalidade futura — nao priorizar |

## Frontend — Components: Layout — Sidebar

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 120 | frontend/components/layout/sidebar/AccountantSection.tsx | src/components/layout/sidebar/AccountantSection.tsx | arquivo | REFERENCE_ONLY | Secao do contador na sidebar | Referencia para menu por role |
| 121 | frontend/components/layout/sidebar/AdminSection.tsx | src/components/layout/sidebar/AdminSection.tsx | arquivo | REFERENCE_ONLY | Secao admin na sidebar | Referencia para RBAC visual |
| 122 | frontend/components/layout/sidebar/CommonSection.tsx | src/components/layout/sidebar/CommonSection.tsx | arquivo | REFERENCE_ONLY | Secao comum na sidebar | Referencia para menu |
| 123 | frontend/components/layout/sidebar/FooterSection.tsx | src/components/layout/sidebar/FooterSection.tsx | arquivo | REFERENCE_ONLY | Footer da sidebar | Referencia de layout |
| 124 | frontend/components/layout/sidebar/HeaderSection.tsx | src/components/layout/sidebar/HeaderSection.tsx | arquivo | REFERENCE_ONLY | Header da sidebar | Referencia de layout |
| 125 | frontend/components/layout/sidebar/useSidebarPermissions.tsx | src/components/layout/sidebar/useSidebarPermissions.tsx | arquivo | EXTRACT_LOGIC_ONLY | Hook de permissoes da sidebar | Extrair logica de permissoes |

## Frontend — Components: Shell

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 126 | frontend/components/shell/BackButton.tsx | src/components/shell/BackButton.tsx | arquivo | REFERENCE_ONLY | Botao de voltar | Referencia de navegacao |

## Frontend — Services

| # | Caminho no Staging | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 127 | frontend/services/authStore-index.ts | src/lib/authStore-index.ts | arquivo | EXTRACT_LOGIC_ONLY | Store de autenticacao (Zustand/similar) | Extrair estado de auth |
| 128 | frontend/services/supabaseClient.ts | src/integrations/supabase/client.ts | arquivo | EXTRACT_LOGIC_ONLY | Cliente Supabase configurado | Extrair config de conexao |
| 129 | frontend/services/supabaseService.ts | src/integrations/supabase/supabaseService.ts | arquivo | EXTRACT_LOGIC_ONLY | Servico de operacoes Supabase | Extrair helpers de data layer |
| 130 | frontend/services/supabaseTypes.ts | src/integrations/supabase/types.ts | arquivo | EXTRACT_LOGIC_ONLY | Tipos gerados do Supabase | Extrair schema types |
| 131 | frontend/services/useAuth.tsx | src/contexts/auth/useAuth.tsx | arquivo | EXTRACT_LOGIC_ONLY | Hook useAuth | Extrair interface de auth |

---

## Resumo por Tag

| Tag | Qtd | % |
|-----|-----|---|
| USE_AS_BASE | 65 | 49.6% |
| EXTRACT_LOGIC_ONLY | 28 | 21.4% |
| REFERENCE_ONLY | 36 | 27.5% |
| DO_NOT_USE_NOW | 2 | 1.5% |
| **TOTAL** | **131** | **100%** |

## Resumo por Area

| Area | Qtd |
|------|-----|
| backend/routes/ | 6 |
| backend/ (seguranca, docs) | 8 |
| backend/tasks/ | 6 |
| backend/services/bancario/ | 6 |
| backend/services/email/ | 7 |
| backend/services/send-email.ts | 1 |
| backend/services/fiscal/ | 19 |
| backend/services/governamental/ | 28 |
| frontend/pages/ | 7 |
| frontend/components/auth/ | 7 |
| frontend/components/integracoes/ | 17 |
| frontend/components/layout/ | 13 |
| frontend/components/shell/ | 1 |
| frontend/services/ | 5 |
| **TOTAL** | **131** |
