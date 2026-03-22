# 05 - Inventario Mestre Consolidado

> **Data de consolidacao**: 2026-03-20
> **Fontes inventariadas**: 3
> **Total geral de itens**: 150 (131 arquivos + 9 arquivos planejados + 10 modulos/pastas)

---

## 1. Visao Geral por Origem

| # | Origem | Repositorio/Fonte | Itens | Status | Inventario |
|---|--------|-------------------|-------|--------|------------|
| 1 | Repo2 | aura-contabilidade-autom | 131 arquivos | Extraido e classificado | 02_inventario_repo2.md |
| 2 | Repo1 | Conectores ERP (TypeScript) | 9 arquivos (planejados) | Nao acessivel | 03_inventario_repo1.md |
| 3 | OCA | OCA/l10n-brazil (GitHub) | 10 modulos (~480 arquivos) | Nao acessivel, somente referencia | 04_inventario_oca.md |
| | **TOTAL** | | **150 itens** | | |

---

## 2. Consolidado por Tag

| Tag | Repo2 | Repo1 | OCA | Total |
|-----|-------|-------|-----|-------|
| USE_AS_BASE | 65 | 0 | 0 | **65** |
| EXTRACT_LOGIC_ONLY | 28 | 0 | 0 | **28** |
| REFERENCE_ONLY | 36 | 9 | 10 | **55** |
| DO_NOT_USE_NOW | 2 | 0 | 0 | **2** |
| LICENSE_REVIEW_REQUIRED | 0 | 0 | 10 | **10** |
| **TOTAL** | **131** | **9** | **10** | **150** |

> Nota: Os 10 modulos OCA possuem dupla tag (REFERENCE_ONLY + LICENSE_REVIEW_REQUIRED).

---

## 3. Distribuicao por Tag (%)

| Tag | Qtd | % do Total |
|-----|-----|------------|
| USE_AS_BASE | 65 | 43.3% |
| EXTRACT_LOGIC_ONLY | 28 | 18.7% |
| REFERENCE_ONLY | 55 | 36.7% |
| DO_NOT_USE_NOW | 2 | 1.3% |
| LICENSE_REVIEW_REQUIRED | 10 | 6.7% |

---

## 4. Consolidado por Area Funcional — Repo2

| Area | Qtd | Tag Predominante |
|------|-----|------------------|
| backend/routes/ (auth, integracoes) | 6 | USE_AS_BASE |
| backend/ raiz (seguranca, docs) | 8 | USE_AS_BASE / EXTRACT_LOGIC_ONLY |
| backend/tasks/ (edge functions) | 6 | EXTRACT_LOGIC_ONLY |
| backend/services/bancario/ | 6 | USE_AS_BASE |
| backend/services/email/ | 7 | USE_AS_BASE |
| backend/services/send-email.ts | 1 | REFERENCE_ONLY |
| backend/services/fiscal/calculadores/ | 4 | USE_AS_BASE |
| backend/services/fiscal/core + types | 3 | USE_AS_BASE |
| backend/services/fiscal/integration/ | 5 | USE_AS_BASE |
| backend/services/fiscal/processadores/ | 2 | USE_AS_BASE |
| backend/services/fiscal/reconciliacao/ | 4 | EXTRACT_LOGIC_ONLY |
| backend/services/fiscal/workflow/ | 1 | USE_AS_BASE |
| backend/services/governamental/ (core) | 10 | USE_AS_BASE |
| backend/services/governamental/procuracaoService/ | 11 | USE_AS_BASE |
| backend/services/governamental/sefaz/ | 7 | USE_AS_BASE |
| frontend/pages/ | 7 | REFERENCE_ONLY |
| frontend/components/auth/ | 7 | REFERENCE_ONLY |
| frontend/components/integracoes/ | 17 | REFERENCE_ONLY |
| frontend/components/layout/ | 13 | REFERENCE_ONLY |
| frontend/components/shell/ | 1 | REFERENCE_ONLY |
| frontend/services/ | 5 | EXTRACT_LOGIC_ONLY |
| **TOTAL Repo2** | **131** | |

## 5. Consolidado por Area Funcional — Repo1

| Area | Qtd | Tag |
|------|-----|-----|
| core/erp/ (interface + servico) | 2 | REFERENCE_ONLY |
| core/erp/mappers/ (normalizadores) | 3 | REFERENCE_ONLY |
| core/erp/providers/ (Bling, ContaAzul, Omie, Tiny) | 4 | REFERENCE_ONLY |
| **TOTAL Repo1** | **9** | |

## 6. Consolidado por Area Funcional — OCA

| Area | Qtd | Tag |
|------|-----|-----|
| Motor Fiscal (l10n_br_fiscal, fiscal_edi, fiscal_certificate) | 3 | REFERENCE_ONLY + LICENSE_REVIEW_REQUIRED |
| Documentos Eletronicos (fiscal_dfe, nfse) | 2 | REFERENCE_ONLY + LICENSE_REVIEW_REQUIRED |
| Infraestrutura (spec_driven_model, sped_base, cnpj_search) | 3 | REFERENCE_ONLY + LICENSE_REVIEW_REQUIRED |
| RH/Trabalhista (hr, hr_contract) | 2 | REFERENCE_ONLY + LICENSE_REVIEW_REQUIRED |
| **TOTAL OCA** | **10** | |

---

## 7. Tabela de Referencia Cruzada por Dominio

| Dominio Funcional | Repo2 (Staging) | Repo1 (Planejado) | OCA (Referencia) |
|-------------------|-----------------|-------------------|------------------|
| **Motor Fiscal / Calculos** | fiscal/calculadores/ (4), calculoFiscal.ts, types.ts | — | l10n_br_fiscal |
| **Tributos Federais** | tributosBase.ts (IRPJ, CSLL, PIS, COFINS) | — | l10n_br_fiscal |
| **Simples Nacional** | simplesNacional.ts, declaracoesSN | — | l10n_br_fiscal |
| **Tributos Estaduais (ICMS)** | tributosEstadual.ts | — | l10n_br_fiscal |
| **Tributos Trabalhistas** | tributosTrabalhistas.ts | — | l10n_br_hr, l10n_br_hr_contract |
| **DARF / Guias** | darfService.ts | — | — |
| **Notas Fiscais (NF-e)** | notasFiscaisProcessor.ts, notasFiscaisService.ts | normalizeNFeXML.ts | l10n_br_fiscal_edi |
| **NFS-e** | — | normalizeServiceInvoice.ts | l10n_br_nfse |
| **Documentos Fiscais (DF-e)** | — | — | l10n_br_fiscal_dfe |
| **Certificados Digitais** | certificadosDigitaisService.ts | — | l10n_br_fiscal_certificate |
| **SEFAZ** | sefaz/ (7 arqs), sefazAutomatic, sefazScraper | — | l10n_br_fiscal_dfe |
| **e-CAC / Receita Federal** | ecacIntegration.ts, ecacService.ts | — | — |
| **SERPRO / CNPJ** | serproIntegrationService.ts | — | l10n_br_cnpj_search |
| **Procuracoes** | procuracaoService/ (11 arqs) | — | — |
| **SPED** | — | — | l10n_br_sped_base |
| **Reconciliacao Bancaria** | reconciliacao/ (4 arqs) | — | — |
| **Automacao Bancaria / Pix** | bancario/ (6 arqs) | — | — |
| **Email / Notificacoes** | email/ (7 arqs), send-email.ts | — | — |
| **Integracao ERP** | — | ERPProvider, ERPService, 4 providers | — |
| **Normalizacao de Documentos** | — | normalizeInvoice.ts, normalizeNFeXML.ts | spec_driven_model |
| **OCR / Classificacao / NLP** | classify-document, process-ocr, nlp-analysis | — | — |
| **Autenticacao** | routes/ (6 arqs), services/ (5 arqs frontend) | — | — |
| **Seguranca / RBAC** | securityService, authSecurityValidator, rlsValidator | — | — |
| **Compliance** | compliance-automation.ts | — | — |
| **Workflow Fiscal** | fiscalWorkflowService.ts | — | — |
| **Frontend - UI** | pages/ (7), components/ (38) | — | — |

---

## 8. Metricas de Aproveitamento

| Metrica | Valor | % |
|---------|-------|---|
| Itens prontos para uso direto (USE_AS_BASE) | 65 | 43.3% |
| Itens que precisam extracao de logica (EXTRACT_LOGIC_ONLY) | 28 | 18.7% |
| Itens somente referencia (REFERENCE_ONLY) | 55 | 36.7% |
| Itens bloqueados (DO_NOT_USE_NOW) | 2 | 1.3% |
| Itens com restricao de licenca (LICENSE_REVIEW_REQUIRED) | 10 | 6.7% |
| **Itens acionaveis imediatamente** (USE_AS_BASE + EXTRACT_LOGIC_ONLY) | **93** | **62.0%** |
| **Itens pendentes de acesso** (Repo1 + OCA) | **19** | **12.7%** |

---

## 9. Alertas de Licenca

| Fonte | Licenca | Risco | Acao Requerida |
|-------|---------|-------|----------------|
| Repo2 (aura-contabilidade-autom) | Proprietario (proprio) | Nenhum | Uso livre interno |
| Repo1 (Conectores ERP) | A verificar | Baixo | Verificar ao obter acesso |
| OCA (l10n-brazil) | AGPL-3.0 / LGPL-3.0 | **ALTO** | Somente referencia; NAO copiar codigo; consultar juridico |

---

## 10. Proximas Acoes

| Prioridade | Acao | Itens Afetados |
|------------|------|----------------|
| 1 | Iniciar uso dos 65 itens USE_AS_BASE do Repo2 | 65 |
| 2 | Extrair logica dos 28 itens EXTRACT_LOGIC_ONLY do Repo2 | 28 |
| 3 | Obter acesso ao Repo1 para os 9 conectores ERP | 9 |
| 4 | Clonar OCA/l10n-brazil para referencia local | 10 modulos |
| 5 | Consultar juridico sobre uso de tabelas de dados publicos OCA (NCM, CFOP, CST) | 10 modulos |
| 6 | Reavaliar tags do Repo1 apos obtencao de acesso | 9 |
