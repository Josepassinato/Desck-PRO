# CARD 012 - Mapa Funcional dos Modulos do Produto Novo (REVISADO)

> **REVISAO 2026-03-20**: Corrigido para refletir que o Produto Novo NAO e o motor fiscal.
> A ContaFlux e o cerebro fiscal-contabil. O Produto Novo e a camada de diagnostico
> + operacional que captura, estrutura e envia dados para a ContaFlux.

## Contexto

O **Produto Novo** e um SaaS para escritorios contabeis com dois papeis:

1. **Diagnostico de migracao**: Avalia se o cliente deve migrar de Simples Nacional /
   Presumido para Lucro Real. Diagnostico completo com 6 dimensoes (elegibilidade legal,
   viabilidade economica, prontidao operacional, qualidade documental, custos de pessoal,
   readiness).

2. **Camada operacional continua**: Captura dados operacionais (ERP, banco, documentos,
   notas, folha) e prepara/envia estruturados para a **ContaFlux**, que faz a apuracao
   fiscal, escrituracao e obrigacoes acessorias do Lucro Real.

### O que NAO e modulo do Produto Novo

- Motor de calculo IRPJ/CSLL/PIS/COFINS -> **ContaFlux**
- LALUR/LACS -> **ContaFlux**
- SPED ECF -> **ContaFlux**
- Escrituracao contabil definitiva -> **ContaFlux**
- Apuracao tributaria -> **ContaFlux**

---

## Fontes de Staging Disponíveis

| Fonte | Caminho | Status |
|-------|---------|--------|
| Repo2 - Backend base | `staging/repo2_base_candidates/backend/` | Extraido |
| Repo2 - Frontend base | `staging/repo2_base_candidates/frontend/` | Extraido |
| Repo1 - Conectores ERP | `staging/repo1_connector_candidates/` | Pendente de acesso |
| OCA l10n-brazil | `staging/oca_reference_candidates/` | Pendente de acesso (REFERENCE_ONLY) |

---

## Mapa por Modulo

### 1. Diagnostico de Migracao (6 dimensoes)

Motor de diagnostico multidimensional — o diferencial competitivo do produto.

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Diagnostico | `services/fiscal/calculoFiscal.ts`, `services/fiscal/calculadores/simplesNacional.ts`, `services/fiscal/calculadores/tributosBase.ts`, `services/fiscal/calculadores/tributosEstadual.ts`, `services/fiscal/calculadores/tributosTrabalhistas.ts`, `frontend/pages/RegimeFiscal.tsx`, `compliance-automation.ts`, `validation-service.ts` | OCA `l10n_br_fiscal` (taxonomia) | Motor de scoring 6-dimensional, avaliacao de elegibilidade legal (CNAE, vedacoes, obrigatoriedade), avaliacao de prontidao operacional (ERP, plano de contas, certificado), avaliacao de qualidade documental, projecao de custos de pessoal para LR, plano de implantacao personalizado, relatorio de diagnostico |

### 2. Cadastro Mestre

Cadastro de escritorios, empresas clientes, usuarios e configuracoes.

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Cadastro Mestre | `backend/routes/authService.ts`, `backend/routes/authUtils.ts`, `backend/routes/AuthContext.tsx`, `backend/routes/AuthProvider.tsx`, `backend/authSecurityValidator.ts`, `backend/rlsValidator.ts`, `frontend/components/auth/*`, `frontend/pages/GerenciarClientes.tsx`, `frontend/pages/Settings.tsx`, `frontend/services/supabaseClient.ts` | OCA `l10n_br_cnpj_search` | Multi-tenant por escritorio, gestao de planos/assinatura, CNPJ auto-fill via ReceitaWS, onboarding wizard |

### 3. Integracoes ERP

Conectores para Bling, Omie, ContaAzul, Tiny.

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Integracoes ERP | `repo1_connector_candidates/` (BlingProvider, OmieProvider, ContaAzulProvider, TinyProvider, ERPProvider, ERPService, normalizeInvoice, normalizeNFeXML, normalizeServiceInvoice) | - | Webhook receivers para sync bidirecional, rate-limiting e retry, dashboard de status, testes de contrato por ERP |

> **Nota**: Os conectores do Repo1 estao pendentes de acesso.

### 4. Integracao Bancaria

Importacao de extratos, categorizacao, reconciliacao operacional (pre-ContaFlux).

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Integracao Bancaria | `services/bancario/automacaoBancaria.ts`, `services/bancario/openBankingService.ts`, `services/bancario/pagamentoAutomatico.ts`, `services/bancario/pagamentoService.ts`, `services/bancario/pixService.ts`, `services/fiscal/reconciliacao/reconciliacaoBancaria.ts`, `services/fiscal/reconciliacao/detecaoPadroes.ts`, `services/fiscal/reconciliacao/aprendizadoMaquina.ts`, `services/fiscal/reconciliacao/resolucaoAutonoma.ts` | - | Import OFX/OFC, conectores bancarios Open Finance, pre-classificacao para envio a ContaFlux |

### 5. Captura Documental

Captura, classificacao, OCR, armazenamento de documentos fiscais.

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Captura Documental | `backend/classify-document.ts`, `backend/process-ocr-documents.ts`, `backend/nlp-document-analysis.ts`, `services/fiscal/integration/notasFiscaisService.ts`, `services/fiscal/processadores/notasFiscaisProcessor.ts`, `services/governamental/sefaz/*`, `frontend/components/integracoes/SefazXmlUploader.tsx`, `frontend/pages/ClientDocuments.tsx` | OCA `l10n_br_fiscal_dfe`, `l10n_br_fiscal_edi`, `l10n_br_fiscal_certificate` | Armazenamento estruturado de XMLs, parser robusto para todos eventos NFe, validacao de schema, timeline de eventos, normalizacao para envio a ContaFlux |

### 6. Recovery de Notas Faltantes

Deteccao e recuperacao de notas fiscais ausentes via DFe.

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Recovery | `services/governamental/sefazAutomaticService.ts`, `services/governamental/sefazScraperService.ts`, `services/governamental/ecacIntegration.ts`, `services/governamental/sefaz/estadualApiService.ts` | OCA `l10n_br_fiscal_dfe` | Consulta DFe via API oficial (nao scraping), deteccao automatica de gaps, relatorio de notas faltantes, retry com certificado digital |

### 7. Custos de Pessoal

Import de folha, encargos, provisoes, rateio por centro de custo.

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Custos de Pessoal | `services/fiscal/calculadores/tributosTrabalhistas.ts` | OCA `l10n_br_hr`, `l10n_br_hr_contract` | Import de folha (CSV/planilha), rateio por centro de custo, provisoes trabalhistas (ferias, 13o, FGTS), envio estruturado a ContaFlux |

### 8. Pendencias e Workflow

Cobranca documental, gestao de tarefas, portal do cliente.

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Pendencias e Workflow | `services/fiscal/workflow/fiscalWorkflowService.ts`, `backend/tasks/queue-processor.ts`, `backend/tasks/validation-service.ts`, `backend/tasks/compliance-automation.ts`, `backend/tasks/process-data-ingestion.ts`, `services/email/emailService.ts`, `services/email/scheduleEmailService.ts`, `services/email/templateEmailService.ts` | - | Portal do cliente para upload, notificacoes WhatsApp, SLA tracking, dashboard de pendencias por cliente, escalation automatico |

### 9. Ponte com ContaFlux

Preparacao e envio estruturado de dados para a ContaFlux.

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Ponte ContaFlux | `services/fiscal/integration/contabilService.ts`, `services/fiscal/integration/integracoesConfig.ts`, `services/fiscal/integration/types.ts` | - | Contrato de dados (schema), normalizacao de dados por tipo, validacao pre-envio, message broker, monitoramento de entregas, dead-letter queue, idempotencia, feedback da ContaFlux, retry com backoff |

### 10. Emissao de Notas (v2)

Emissao de NF-e e NFS-e — adiavel para v2.

| Modulo | Itens que Ajudam (staging) | Apenas Referencia | Ainda Faltam |
|--------|---------------------------|-------------------|-------------|
| Emissao de Notas | `services/governamental/sefaz/xmlUploadService.ts`, `services/governamental/certificadosDigitaisService.ts` | OCA `l10n_br_nfse`, `spec_driven_model` | Integracao ABRASF/padrao nacional, templates por municipio, assinatura digital, consulta de lote, cancelamento |

---

## Matriz Visual: ABUNDANCIA vs GAP (REVISADA)

| # | Modulo | Nivel | Justificativa |
|---|--------|-------|---------------|
| 1 | Diagnostico de Migracao | [+] | Calculadores existem mas nao ha diagnostico multidimensional |
| 2 | Cadastro Mestre | [++] | Auth, RLS, clientes ja extraidos; falta multi-tenancy |
| 3 | Integracoes ERP | [++] | Conectores do Repo1 pendentes de acesso |
| 4 | Integracao Bancaria | [+++] | Modulo mais completo com PIX, Open Banking, reconciliacao, ML |
| 5 | Captura Documental | [++] | OCR, NLP, classify existem; falta estruturacao para ContaFlux |
| 6 | Recovery de Notas | [+] | SEFAZ scraper existe mas e fragil; reimplementar via API |
| 7 | Custos de Pessoal | [--] | Apenas calculador basico de encargos |
| 8 | Pendencias/Workflow | [++] | Workflow, tasks, queue, email existem; falta portal e WhatsApp |
| 9 | Ponte ContaFlux | [+] | Integracao contabil generica; falta contrato e bridge real |
| 10 | Emissao de Notas | [-] | Apenas upload de XML e certificados; modulo por construir (v2) |

### Legenda

```
[+++] Material abundante no staging - modulo pode ser montado rapidamente
[++]  Boa cobertura - base solida, precisa complementos
[+]   Algum material - ponto de partida existe mas ha trabalho significativo
[-]   Pouco material - apenas fragmentos, maior parte deve ser construida
[--]  Lacuna grande - quase nada existe, construcao quase do zero
```

### Resumo Visual

```
Bancario        [+++] ████████████████████
Cadastro        [++]  ██████████████
ERP             [++]  ██████████████  (pendente acesso)
Captura Doc     [++]  ██████████████
Workflow        [++]  ██████████████
Diagnostico     [+]   ████████
ContaFlux       [+]   ████████
Recovery        [+]   ████████
Emissao Notas   [-]   ████
Custos Pessoal  [--]  ██
```

---

## Conclusoes (REVISADAS)

1. **O modulo bancario e o mais completo** no staging — pode ser adaptado rapidamente
2. **Cadastro, Captura Documental e Workflow** tem boa base — precisam complementos
3. **Diagnostico de Migracao** (core do MVP) e muito mais amplo que um comparador — 6 dimensoes, construir do zero
4. **A Ponte com ContaFlux e vital** — sem ela, o produto coleta dados mas nao gera valor contabil
5. **Emissao de Notas e Custos de Pessoal** sao as maiores lacunas — adiar emissao para v2
6. **Itens OCA sao REFERENCE_ONLY** — nao copiar codigo
7. **Motor fiscal (IRPJ, CSLL, LALUR, SPED) NAO e modulo do Produto Novo** — pertence a ContaFlux
