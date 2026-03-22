# Mapa de Aplicacao - 2 Esteiras (REVISADO)

> **Objetivo**: Classificar cada item do staging conforme sua aplicacao nas duas esteiras
> do produto novo.
>
> **REVISAO 2026-03-20**: Corrigido para refletir que o Produto Novo NAO e o motor fiscal.
> A ContaFlux e o cerebro fiscal-contabil. O Produto Novo captura, estrutura e envia dados.

## Contexto (DEFINICAO CORRIGIDA)

O Produto Novo opera em duas esteiras complementares:

- **Esteira 1 - Diagnostico de Migracao**: Avalia se o cliente deve migrar de
  Simples Nacional/Presumido para Lucro Real. Diagnostico completo com 6 dimensoes:
  elegibilidade legal, viabilidade economica, prontidao operacional, qualidade
  documental, custos de pessoal, readiness. Produto de entrada (MVP).

- **Esteira 2 - Camada Operacional Continua**: Captura dados operacionais (ERP, banco,
  documentos, notas, folha) e prepara/envia estruturados para a **ContaFlux**, que faz
  apuracao fiscal, escrituracao e obrigacoes acessorias do Lucro Real.

### O que NAO e responsabilidade do Produto Novo

| Funcao | Pertence a |
|--------|------------|
| Motor principal IRPJ/CSLL/PIS/COFINS | **ContaFlux** |
| LALUR/LACS | **ContaFlux** |
| SPED ECF | **ContaFlux** |
| Escrituracao contabil definitiva | **ContaFlux** |
| Elegibilidade fiscal e regras tributarias | **ContaFlux** |

O Produto Novo precisa **conhecer a estrutura** desses dados para preparar os insumos,
mas **NAO implementa** a logica de apuracao ou escrituracao.

Cada item do staging recebe uma das seguintes classificacoes:

| Classificacao | Significado |
|---------------|-------------|
| **Entra no diagnostico** | Usado diretamente na Esteira 1 |
| **Entra no operacional** | Usado diretamente na Esteira 2 |
| **Vira referencia de dominio** | Serve como estudo de dominio, taxonomia ou arquitetura |
| **Aguarda revisao de licenca** | Uso bloqueado ate esclarecimento de licenca |
| **Descartado por enquanto** | Nao relevante para nenhuma esteira no momento |
| **Pertence a ContaFlux** | Funcionalidade que deve ser implementada pela ContaFlux, nao pelo Produto Novo |

---

## Esteira 1: Diagnostico de Migracao Presumido -> Lucro Real

### O que a esteira precisa (AMPLIADO)

1. **Elegibilidade legal**: CNAE, faturamento, vedacoes legais, obrigatoriedade
2. **Viabilidade economica**: Simulacao comparativa de carga tributaria (estimativa)
3. **Prontidao operacional**: ERP configurado, plano de contas, centro de custos, certificado digital
4. **Qualidade documental**: Completude de notas, organizacao, gaps detectados
5. **Custos de pessoal**: Folha, encargos, provisoes, impacto no Lucro Real
6. **Readiness**: Capacidade de sustentar a operacao no Lucro Real
7. **Plano de implantacao**: Etapas, prazos, pre-requisitos, checklist
8. Integracao com ERP para puxar dados reais
9. Cadastro basico (auth, empresa, usuarios)
10. Relatorio de diagnostico para apresentar ao cliente

### Itens do staging que servem esta esteira

| # | Item | Codigo | Como Serve |
|---|------|--------|------------|
| C01 | AuthProvider + AuthContext | `repo2_base_candidates/backend/routes/AuthProvider.tsx` | Infraestrutura de login para acesso ao diagnostico |
| C02 | authService + authUtils | `repo2_base_candidates/backend/routes/authService.ts` | Login/logout necessario desde o dia 1 |
| C03 | useAuth hook | `repo2_base_candidates/frontend/services/useAuth.tsx` | Hook de auth no frontend |
| C04 | authStore-index | `repo2_base_candidates/frontend/services/authStore-index.ts` | Estado de auth |
| C05 | Componentes Auth UI | `repo2_base_candidates/frontend/components/auth/*` | Telas de login/signup |
| C06 | Security Services | `repo2_base_candidates/backend/securityService.ts` etc. | Seguranca basica |
| C07 | DashboardLayout + Sidebar | `repo2_base_candidates/frontend/components/layout/*` | Shell da aplicacao |
| C08 | GlobalErrorBoundary + LoadingIndicator | `repo2_base_candidates/frontend/components/layout/Global*.tsx` | UX basico |
| C09 | ClientSelector | `repo2_base_candidates/frontend/components/layout/ClientSelector.tsx` | Selecao de cliente para diagnostico |
| C11 | Supabase Client + Types | `repo2_base_candidates/frontend/services/supabase*.ts` | Camada de dados |
| C17 | Tributos Base | `repo2_base_candidates/backend/services/fiscal/calculadores/tributosBase.ts` | Referencia de aliquotas para simulacao comparativa (nao apuracao) |
| C18 | Compliance Automation | `repo2_base_candidates/backend/tasks/compliance-automation.ts` | Pattern para avaliacao de prontidao operacional |
| C19 | Validation Service | `repo2_base_candidates/backend/tasks/validation-service.ts` | Pattern para checklist de readiness |
| S01 | Calculador Simples Nacional | `repo2_base_candidates/backend/services/fiscal/calculadores/simplesNacional.ts` | Referencia para estimar cenario "ficar no Simples" |
| S02 | Tributos Estadual | `repo2_base_candidates/backend/services/fiscal/calculadores/tributosEstadual.ts` | ICMS na simulacao |
| S03 | Tributos Trabalhistas | `repo2_base_candidates/backend/services/fiscal/calculadores/tributosTrabalhistas.ts` | Custos de pessoal na avaliacao |
| S14 | Calculo Fiscal + DARF | `repo2_base_candidates/backend/services/fiscal/calculoFiscal.ts` | Referencia de pattern de calculo (nao para apuracao real) |
| S33 | Repo1 ERP Connectors | `repo1_connector_candidates/` | Puxar dados reais do cliente via ERP para alimentar diagnostico |

---

## Esteira 2: Camada Operacional Continua

### O que a esteira precisa (REVISADO)

A esteira operacional captura, estrutura e envia dados para a ContaFlux.
**NAO faz apuracao, escrituracao ou obrigacoes acessorias.**

1. Integracao ERP (Bling, Omie, ContaAzul, Tiny)
2. Integracao bancaria (extratos, categorizacao, reconciliacao operacional)
3. Captura documental (NF-e, NFS-e, CT-e, contratos)
4. Recovery de notas faltantes (DFe)
5. Emissao de notas (v2)
6. Custos de pessoal (import folha, encargos, provisoes)
7. Workflow de pendencias e cobranca documental
8. Reconciliacao operacional (pre-ContaFlux)
9. **Preparacao e envio estruturado de dados para a ContaFlux**

### Itens do staging que servem esta esteira

| # | Item | Codigo | Como Serve |
|---|------|--------|------------|
| C10 | Email Services | `repo2_base_candidates/backend/services/email/*` | Notificacoes de pendencias, lembretes |
| C12 | Queue Processor | `repo2_base_candidates/backend/tasks/queue-processor.ts` | Processamento assincrono |
| C13 | Validation Service | `repo2_base_candidates/backend/tasks/validation-service.ts` | Validacao de documentos |
| C14 | Data Ingestion Task | `repo2_base_candidates/backend/tasks/process-data-ingestion.ts` | Pipeline de ingestao |
| C16 | Certificados Digitais | `repo2_base_candidates/backend/services/governamental/certificadosDigitaisService.ts` | Gestao de certificados |
| S04 | SEFAZ Scraper Service | `repo2_base_candidates/backend/services/governamental/sefazScraperService.ts` | Referencia de fluxo (reimplementar via API) |
| S05 | SEFAZ Automatic Service | `repo2_base_candidates/backend/services/governamental/sefazAutomaticService.ts` | Referencia de automacao |
| S06 | SEFAZ API/XML Services | `repo2_base_candidates/backend/services/governamental/sefaz/*` | Integracao SEFAZ |
| S07 | Procuracao Service | `repo2_base_candidates/backend/services/governamental/procuracaoService/*` | Procuracao eletronica |
| S08 | e-CAC Integration | `repo2_base_candidates/backend/services/governamental/ecac*.ts` | Consultas e-CAC |
| S11 | Automacao Bancaria | `repo2_base_candidates/backend/services/bancario/*` | Base para integracao bancaria |
| S12 | Reconciliacao Bancaria | `repo2_base_candidates/backend/services/fiscal/reconciliacao/*` | Reconciliacao operacional (pre-ContaFlux) |
| S13 | Fiscal Workflow Service | `repo2_base_candidates/backend/services/fiscal/workflow/fiscalWorkflowService.ts` | Orquestracao de tarefas |
| S15 | Notas Fiscais Service | `repo2_base_candidates/backend/services/fiscal/integration/notasFiscaisService.ts` | Pipeline de captura de notas |
| S17 | Contabil Service | `repo2_base_candidates/backend/services/fiscal/integration/contabilService.ts` | Base para ponte ContaFlux |
| S18 | Classify Document + OCR + NLP | `repo2_base_candidates/backend/classify-document.ts` etc. | Captura e classificacao documental |
| S19 | Compliance Automation | `repo2_base_candidates/backend/tasks/compliance-automation.ts` | Automacao de verificacoes |
| S33 | Repo1 ERP Connectors | `repo1_connector_candidates/` | Conectores ERP |

---

## Classificacao Completa por Item

### Entra no Diagnostico (Esteira 1)

- **C01** AuthProvider + AuthContext
- **C02** authService + authUtils
- **C03** useAuth hook
- **C04** authStore-index
- **C05** Componentes Auth UI
- **C06** Security Services
- **C07** DashboardLayout + Sidebar
- **C08** GlobalErrorBoundary + GlobalLoadingIndicator
- **C09** ClientSelector
- **C11** Supabase Client + Types
- **C15** BackButton
- **C17** Tributos Base (referencia para simulacao)
- **C18** Compliance Automation (pattern para prontidao)
- **C19** Validation Service (pattern para readiness)

> **Nota**: C01-C09, C11, C15 sao infraestrutura compartilhada entre ambas esteiras.

### Entra no Operacional (Esteira 2)

- **C10** Email Services
- **C12** Queue Processor
- **C13** Validation Service
- **C14** Data Ingestion Task
- **C16** Certificados Digitais Service
- **S04** SEFAZ Scraper (referencia, reimplementar)
- **S05** SEFAZ Automatic (reimplementar)
- **S06** SEFAZ API/XML Services (adaptar)
- **S07** Procuracao Service
- **S08** e-CAC Integration (reimplementar)
- **S11** Automacao Bancaria (adaptar para reconciliacao operacional)
- **S12** Reconciliacao Bancaria (adaptar — operacional, nao contabil)
- **S13** Fiscal Workflow Service (redesenhar)
- **S15** Notas Fiscais Service (adaptar para captura)
- **S17** Contabil Service (base para ponte ContaFlux)
- **S18** Classify Document + OCR + NLP (adaptar)
- **S19** Compliance Automation (adaptar)
- **S33** Repo1 ERP Connectors (quando disponivel)

### Vira Referencia de Dominio

Itens que fornecem conhecimento de dominio mas nao entram diretamente.

- **S01** Calculador Simples Nacional - Entender regime de origem
- **S02** Tributos Estadual - Modelo de ICMS
- **S03** Tributos Trabalhistas - Estrutura de custos de pessoal
- **S14** Calculo Fiscal + DARF - Pattern de calculo (nao logica de apuracao)
- **S24** OCA l10n_br_fiscal - Taxonomia fiscal (REFERENCE_ONLY)
- **S25** OCA l10n_br_fiscal_dfe - Fluxo DFe (REFERENCE_ONLY)
- **S26** OCA l10n_br_nfse - Modelo NFS-e (REFERENCE_ONLY)
- **S27** OCA l10n_br_sped_base - Estrutura SPED (REFERENCE_ONLY)
- **S28** OCA spec_driven_model - Geracao de tipos a partir de XSD (REFERENCE_ONLY)
- **S29** OCA l10n_br_hr + hr_contract - Modelo de custos de pessoal (REFERENCE_ONLY)
- **S30** OCA l10n_br_cnpj_search - Validacao cadastral (REFERENCE_ONLY)
- **S31** OCA l10n_br_fiscal_certificate - Certificados digitais (REFERENCE_ONLY)
- **S32** OCA l10n_br_fiscal_edi - Protocolos SEFAZ (REFERENCE_ONLY)

### Pertence a ContaFlux (NAO implementar no Produto Novo)

Itens cuja funcionalidade pertence a ContaFlux, nao ao Produto Novo:

- **Apuracao IRPJ/CSLL** - Motor de calculo e apuracao -> ContaFlux
- **LALUR/LACS** - Escrituracao do lucro real -> ContaFlux
- **SPED ECF** - Geracao de obrigacao acessoria -> ContaFlux
- **Escrituracao contabil definitiva** - Lancamentos contabeis finais -> ContaFlux
- **S16** Lancamentos Processor - Lancamentos contabeis finais -> ContaFlux
- **S20** Accounting Entry/Automation - Automacao contabil -> ContaFlux

> **NOTA**: O Produto Novo precisa entender o FORMATO desses dados para preparar
> os pacotes que envia a ContaFlux, mas NAO precisa implementar a logica.
> Exemplo: o Produto Novo prepara os dados de notas classificadas e envia;
> a ContaFlux faz o lancamento contabil e a apuracao.

### Aguarda Revisao de Licenca

- **S24-S32** OCA modules - AGPL-3.0 (REFERENCE_ONLY, nao copiar)
- **S33** Repo1 ERP Connectors - Licenca desconhecida (verificar)

> **Regra**: Itens OCA podem ser estudados para entender dominio,
> mas **nenhum codigo pode ser copiado**. Reimplementacao limpa obrigatoria.

### Descartado por Enquanto

- **VoiceAssistantButton** - Voz nao e prioridade para MVP
- Componentes UI muito acoplados ao branding/UX original

---

## Resumo Quantitativo por Classificacao

| Classificacao | Qtd Itens | Observacao |
|---------------|-----------|------------|
| Entra no diagnostico | 14 | Infraestrutura (auth, layout) + calculadores como referencia |
| Entra no operacional | 18 | Maior volume; muitos precisam adaptacao |
| Referencia de dominio | 13 | OCA + calculadores fiscais |
| Pertence a ContaFlux | 4 | Motor fiscal, LALUR, SPED, escrituracao |
| Aguarda revisao de licenca | 10 | 9 OCA (AGPL) + 1 Repo1 (desconhecida) |
| Descartado | 1-2 | Funcionalidades irrelevantes |

---

## Sobreposicao entre Esteiras

```
Auth (C01-C06)          -> Esteira 1 primeiro, Esteira 2 herda
Layout (C07-C09, C15)   -> Esteira 1 primeiro, Esteira 2 herda
Supabase (C11)          -> Compartilhado
Tributos Base (C17)     -> Referencia para simulacao (diagnostico)
Email (C10)             -> Operacional, diagnostico pode usar para relatorios
Queue (C12)             -> Operacional, diagnostico pode usar para batch
ERP Connectors (S33)    -> Alimenta ambas esteiras
```

### Sequencia Recomendada

1. Construir infraestrutura compartilhada (auth, layout, dados) - serve ambas esteiras
2. Construir Esteira 1 (diagnostico 6-dimensional) - MVP, valida o produto
3. Expandir para Esteira 2 (operacional + ponte ContaFlux) - complementa o ciclo
4. A ContaFlux recebe dados estruturados e faz apuracao/escrituracao/SPED
