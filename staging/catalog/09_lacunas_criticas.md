# CARD 013 - Identificacao de Lacunas Criticas (REVISADO)

> **Objetivo**: Identificar o que o Produto Novo precisa e que NAO existe (ou existe apenas
> parcialmente) no staging extraido, classificando por criticidade e complexidade.
>
> **REVISAO 2026-03-20**: Documento corrigido para refletir a definicao real do produto.
> O Produto Novo NAO e o motor fiscal principal. A ContaFlux e o cerebro fiscal-contabil
> (elegibilidade fiscal, regras tributarias, apuracao, escrituracao, LALUR/LACS, SPED ECF).
> O Produto Novo e a camada de diagnostico + operacional que alimenta a ContaFlux.

## Contexto do Novo Produto (DEFINICAO CORRIGIDA)

O produto tem dois pilares:

1. **Diagnostico de migracao** Presumido/Simples Nacional -> Lucro Real
   - Elegibilidade legal
   - Viabilidade economica
   - Prontidao operacional
   - Qualidade documental
   - Custos de pessoal
   - Readiness para sustentar Lucro Real
   - Plano de implantacao

2. **Camada operacional continua** que alimenta a ContaFlux
   - Integracao ERP (Bling, Omie, ContaAzul, Tiny)
   - Integracao bancaria
   - Emissao de notas
   - Captura documental
   - Recovery de notas faltantes
   - Pendencias e workflows
   - Custos de pessoal
   - Reconciliacao operacional
   - Preparacao e envio estruturado de dados para a ContaFlux

### O que NAO e responsabilidade do Produto Novo

| Responsabilidade | Pertence a |
|------------------|------------|
| Motor principal de IRPJ/CSLL/PIS/COFINS | **ContaFlux** |
| LALUR/LACS como nucleo proprio | **ContaFlux** |
| SPED ECF como responsabilidade principal | **ContaFlux** |
| Escrituracao principal do Lucro Real | **ContaFlux** |
| Elegibilidade fiscal e regras tributarias | **ContaFlux** |

O Produto Novo precisa **conhecer** esses dados para prepara-los e envia-los,
mas NAO precisa implementar a logica de apuracao.

---

## Classificacao de Prioridade

| Prioridade | Significado |
|------------|-------------|
| **GAP CRITICO** | Deve ser construido; bloqueia o lancamento do produto |
| **GAP IMPORTANTE** | Impacta significativamente o valor do produto |
| **GAP SECUNDARIO** | Desejavel, pode ser adiado para versoes futuras |

## Classificacao de Complexidade

| Complexidade | Significado |
|--------------|-------------|
| **Alta** | Requer conhecimento especializado, multiplas integracoes, ou logica de negocios complexa. Estimativa: 4-8 semanas |
| **Media** | Logica moderada, integracoes pontuais. Estimativa: 2-4 semanas |
| **Baixa** | Logica simples, CRUD ou adaptacao de componentes existentes. Estimativa: 1-2 semanas |

---

## PILAR 1: DIAGNOSTICO DE MIGRACAO

### 1. Motor de Diagnostico Completo

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Engine de diagnostico multidimensional que avalia se o cliente deve migrar para Lucro Real. Nao e apenas um comparador tributario — inclui 6 dimensoes: elegibilidade legal, viabilidade economica, prontidao operacional, qualidade documental, custos de pessoal e readiness operacional |
| **Por que e necessario** | E o nucleo do Pilar 1 e o diferencial competitivo do produto. O contador precisa de um diagnostico completo que va alem da simples conta de "quanto pago vs quanto pagaria" |
| **Prioridade** | GAP CRITICO |
| **Complexidade** | Alta |
| **Dimensoes do diagnostico** | 1) Elegibilidade legal: CNAE, faturamento, vedacoes, obrigatoriedade. 2) Viabilidade economica: simulacao comparativa de carga tributaria. 3) Prontidao operacional: ERP configurado, plano de contas, centro de custos, certificado digital. 4) Qualidade documental: completude de notas, organizacao, gaps. 5) Custos de pessoal: folha, encargos, provisoes, impacto no LR. 6) Readiness: capacidade de sustentar a operacao no Lucro Real |
| **Item no staging que ajuda parcialmente** | `calculoFiscal.ts`, `tributosBase.ts`, `simplesNacional.ts` (estrutura de calculo), `compliance-automation.ts` (pattern de verificacao), `validation-service.ts` (validacao). Nenhum implementa diagnostico multidimensional |
| **Recomendacao** | Construir do zero. Definir modelo de scoring com contadores especialistas. Cada dimensao gera um sub-score; o score geral e a media ponderada |

---

### 2. Simulador Comparativo Tributario

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Simulador lado-a-lado que projeta carga tributaria nos regimes Simples Nacional, Presumido e Lucro Real para os proximos 12-36 meses, com cenarios otimista/pessimista. E uma das 6 dimensoes do diagnostico, nao o diagnostico inteiro |
| **Por que e necessario** | O cliente e o contador precisam visualizar a economia (ou nao) em numeros concretos. Este simulador alimenta a dimensao "viabilidade economica" do diagnostico |
| **Prioridade** | GAP CRITICO |
| **Complexidade** | Alta |
| **Item no staging que ajuda parcialmente** | `simplesNacional.ts` (calculo Simples), `tributosEstadual.ts` (ICMS), `tributosBase.ts` (PIS/COFINS base). Faltam: calculo simplificado de IRPJ/CSLL Lucro Real para simulacao, creditos de PIS/COFINS nao-cumulativo, projecao temporal |
| **Nota sobre ContaFlux** | O simulador faz calculos ESTIMATIVOS para projecao. A apuracao REAL e definitiva e feita pela ContaFlux. O simulador nao precisa ter a precisao de um motor de apuracao — precisa ser suficiente para decisao de migrar ou nao |
| **Recomendacao** | Construir do zero com formulas simplificadas de projecao. Validar com contadores. Nao tentar replicar a ContaFlux — e uma simulacao, nao uma apuracao |

---

### 3. Gerador de Plano de Implantacao

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | A partir do resultado do diagnostico, gera um plano de implantacao personalizado: etapas, prazos, pre-requisitos, responsabilidades, checklist de acao |
| **Por que e necessario** | O diagnostico so tem valor se resultar em um plano acionavel. O contador entrega ao cliente nao so "voce deve migrar" mas "aqui esta como vamos fazer" |
| **Prioridade** | GAP CRITICO |
| **Complexidade** | Media |
| **Item no staging que ajuda parcialmente** | Nenhum item gera plano de implantacao. `fiscalWorkflowService.ts` como referencia de orquestracao de etapas |
| **Recomendacao** | Construir como output do Motor de Diagnostico. Template configuravel por tipo de empresa (servicos, comercio, industria) |

---

## PILAR 2: CAMADA OPERACIONAL CONTINUA

### 4. Conectores ERP (Bling, Omie, ContaAzul, Tiny)

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Integracoes com os principais ERPs do mercado brasileiro para importacao automatica de dados: notas fiscais, financeiro, plano de contas, clientes/fornecedores, estoque |
| **Por que e necessario** | Sem dados do ERP, o Produto Novo nao tem insumo para operar. Os conectores alimentam tanto o diagnostico (Pilar 1) quanto a operacao continua (Pilar 2) |
| **Prioridade** | GAP CRITICO |
| **Complexidade** | Alta |
| **Item no staging que ajuda parcialmente** | `repo1_connector_candidates/` (BlingProvider, OmieProvider, ContaAzulProvider, TinyProvider, ERPProvider) — PENDENTE DE ACESSO. Integracao shell existe no Repo2 |
| **Recomendacao** | Obter acesso ao Repo1 urgente. Priorizar Bling + Omie. Implementar webhook receivers para sync bidirecional |

---

### 5. Captura e Gestao Documental

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Sistema completo de captura, classificacao, armazenamento e rastreabilidade de documentos fiscais (NF-e, NFS-e, CT-e, extratos, contratos, comprovantes) |
| **Por que e necessario** | A operacao no Lucro Real exige documentacao fiscal completa. O Produto Novo e responsavel por capturar e organizar; a ContaFlux processa para escrituracao |
| **Prioridade** | GAP CRITICO |
| **Complexidade** | Media |
| **Item no staging que ajuda parcialmente** | `classify-document.ts` (classificacao automatica), `process-ocr-documents.ts` (OCR), `nlp-document-analysis.ts` (NLP), `ClientDocuments.tsx` (UI de documentos). Boa base. Falta: armazenamento estruturado de XMLs, timeline de eventos por documento, validacao de schema |
| **Recomendacao** | Adaptar modulo existente. Adicionar estruturacao para envio a ContaFlux |

---

### 6. Recovery de Notas Fiscais Faltantes

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Sistema automatizado para detectar gaps na sequencia de notas fiscais e recuperar faltantes via consulta DFe (SEFAZ), com retry automatico |
| **Por que e necessario** | Notas faltantes causam inconsistencias na escrituracao. A completude dos dados e essencial para que a ContaFlux faca a apuracao correta |
| **Prioridade** | GAP IMPORTANTE |
| **Complexidade** | Media |
| **Item no staging que ajuda parcialmente** | `sefazAutomaticService.ts`, `sefazScraperService.ts`, `ecacIntegration.ts` (fluxo existe mas via scraping fragil). OCA `l10n_br_fiscal_dfe` como referencia para DFe via API |
| **Recomendacao** | Reimplementar usando API DFe oficial. Base de fluxo existe no staging |

---

### 7. Integracao Bancaria e Reconciliacao Operacional

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Importacao de extratos bancarios (OFX/OFC), categorizacao de transacoes, reconciliacao operacional entre extratos e notas/pagamentos. NAO e a conciliacao contabil final (que e da ContaFlux) |
| **Por que e necessario** | Alimenta a ContaFlux com dados bancarios estruturados e pre-classificados. Reduz trabalho manual do contador |
| **Prioridade** | GAP IMPORTANTE |
| **Complexidade** | Alta |
| **Item no staging que ajuda parcialmente** | `reconciliacaoBancaria.ts`, `detecaoPadroes.ts`, `aprendizadoMaquina.ts`, `automacaoBancaria.ts`, `openBankingService.ts`, `pixService.ts` - modulo mais completo no staging [+++] |
| **Recomendacao** | Adaptar modulo existente. Foco em pre-classificacao e estruturacao para envio a ContaFlux. Reconciliacao contabil final fica com ContaFlux |

---

### 8. Workflow de Pendencias e Cobranca Documental

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Sistema de solicitacao, rastreamento e cobranca automatizada de documentos pendentes. Portal do cliente para upload. Notificacoes multicanal. SLA tracking |
| **Por que e necessario** | Problema #1 dos escritorios contabeis: clientes nao enviam documentos no prazo. Automacao e diferencial competitivo |
| **Prioridade** | GAP IMPORTANTE |
| **Complexidade** | Media |
| **Item no staging que ajuda parcialmente** | `fiscalWorkflowService.ts` (orquestracao), `queue-processor.ts` (fila), `emailService.ts` + `scheduleEmailService.ts` (envio agendado), `templateEmailService.ts` (templates). Boa base. Falta: portal do cliente, WhatsApp, SLA |
| **Recomendacao** | Boa base no staging. Construir portal de upload do cliente. Adicionar WhatsApp |

---

### 9. Custos de Pessoal

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Import e processamento de dados de folha de pagamento: calculo de encargos, provisoes trabalhistas, rateio por centro de custo. Dados estruturados enviados a ContaFlux para deducao na apuracao |
| **Por que e necessario** | Custos de pessoal sao a maior despesa dedutivel no Lucro Real. O Produto Novo captura e estrutura; a ContaFlux aplica na apuracao |
| **Prioridade** | GAP IMPORTANTE |
| **Complexidade** | Alta |
| **Item no staging que ajuda parcialmente** | `tributosTrabalhistas.ts` (calculo basico de encargos). OCA `l10n_br_hr` como referencia. Falta: import eSocial/REINF, provisoes, rateio |
| **Recomendacao** | Iniciar com import de resumo de folha (planilha/CSV). Integracao eSocial para v2 |

---

### 10. Emissao de Notas Fiscais

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Emissao de NF-e e NFS-e integrada. Para NFS-e, seguir padrao ABRASF ou padrao nacional |
| **Por que e necessario** | Empresas precisam emitir notas. Integrar no produto evita sistemas paralelos |
| **Prioridade** | GAP SECUNDARIO (v2) |
| **Complexidade** | Alta |
| **Item no staging que ajuda parcialmente** | `xmlUploadService.ts`, `certificadosDigitaisService.ts`. OCA `l10n_br_nfse` como referencia (AGPL, nao copiar) |
| **Recomendacao** | Na v1, suportar apenas upload de notas ja emitidas. Emissao propria na v2 |

---

### 11. Ponte de Dados com ContaFlux

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Camada de preparacao e envio estruturado de dados para a ContaFlux. Inclui: normalizacao de dados, validacao pre-envio, contrato de dados, monitoramento de entregas, feedback da ContaFlux |
| **Por que e necessario** | E a conexao vital entre o Produto Novo e o cerebro fiscal. Sem ela, o Produto Novo coleta dados mas nao gera valor contabil. A ContaFlux depende dos dados bem estruturados que o Produto Novo envia |
| **Prioridade** | GAP CRITICO |
| **Complexidade** | Alta |
| **Item no staging que ajuda parcialmente** | `contabilService.ts`, `integracoesConfig.ts` (integracao contabil generica). Falta: contrato de dados definido, validacao de schema, monitoramento, retry, dead-letter |
| **Recomendacao** | Depende da API/documentacao da ContaFlux. Prioridade maxima — sem esta ponte, o produto nao entrega valor completo. Definir contrato de dados cedo |

---

### 12. Painel da Contabilidade

| Atributo | Detalhe |
|----------|---------|
| **Descricao** | Dashboard consolidado para o escritorio: status de todos os clientes, pendencias, prazos, alertas, KPIs |
| **Por que e necessario** | O cockpit do escritorio. Precisa consolidar dados do Produto Novo E feedback da ContaFlux |
| **Prioridade** | GAP IMPORTANTE |
| **Complexidade** | Media |
| **Item no staging que ajuda parcialmente** | `DashboardLayout`, `Sidebar`, `ClientSelector`, `GerenciarClientes.tsx`. Falta: metricas consolidadas, KPIs, timeline |
| **Recomendacao** | Layout base existe. Construir metricas e alertas |

---

## Tabela Resumo (REVISADA)

| # | Lacuna | Pilar | Prioridade | Complexidade | Cobertura Staging | Bloqueia? |
|---|--------|-------|------------|--------------|-------------------|-----------|
| 1 | Motor de Diagnostico Completo | Diagnostico | CRITICO | Alta | Parcial (calculadores, compliance) | Sim |
| 2 | Simulador Comparativo Tributario | Diagnostico | CRITICO | Alta | Parcial (calculadores por regime) | Sim |
| 3 | Gerador de Plano de Implantacao | Diagnostico | CRITICO | Media | Nenhuma | Sim |
| 4 | Conectores ERP | Operacional | CRITICO | Alta | Pendente (Repo1) | Sim |
| 5 | Captura e Gestao Documental | Operacional | CRITICO | Media | Boa (OCR, NLP, classify) | Sim |
| 6 | Ponte de Dados com ContaFlux | Operacional | CRITICO | Alta | Parcial (integracao generica) | Sim |
| 7 | Recovery de Notas Faltantes | Operacional | IMPORTANTE | Media | Parcial (SEFAZ, fragil) | Nao |
| 8 | Integracao Bancaria/Reconciliacao | Operacional | IMPORTANTE | Alta | Boa [+++] | Nao |
| 9 | Workflow Pendencias/Cobranca | Operacional | IMPORTANTE | Media | Boa (workflow, email, queue) | Nao |
| 10 | Custos de Pessoal | Operacional | IMPORTANTE | Alta | Minima (tributos trab.) | Nao |
| 11 | Painel da Contabilidade | Operacional | IMPORTANTE | Media | Parcial (layout, clients) | Nao |
| 12 | Emissao de Notas | Operacional | SECUNDARIO | Alta | Minima (ref OCA) | Nao |

---

## Itens REMOVIDOS desta lista (pertencem a ContaFlux)

Os seguintes itens estavam na versao anterior deste documento como gaps criticos
do Produto Novo, mas na definicao correta pertencem a **ContaFlux**:

| Item removido | Por que foi removido |
|---------------|----------------------|
| Motor de Calculo Lucro Real (IRPJ/CSLL/PIS/COFINS) | ContaFlux e o motor fiscal principal |
| Geracao de LALUR/LACS | ContaFlux faz escrituracao e apuracao |
| Apuracao IRPJ/CSLL Lucro Real | ContaFlux faz apuracao definitiva |
| Integracao com SPED ECF | ContaFlux gera obrigacoes acessorias |

> **NOTA**: O Produto Novo precisa conhecer a ESTRUTURA desses dados para preparar
> os insumos que a ContaFlux consome, mas NAO implementa a logica de calculo.
> O Simulador Comparativo (item 2) faz estimativas simplificadas para projecao,
> nao apuracao real.

---

## Analise por Pilar (REVISADA)

### Pilar 1: Diagnostico de Migracao

| Lacuna | Prioridade |
|--------|------------|
| Motor de Diagnostico Completo (6 dimensoes) | CRITICO |
| Simulador Comparativo Tributario | CRITICO |
| Gerador de Plano de Implantacao | CRITICO |

**Situacao**: 3 gaps criticos. O diagnostico e muito mais amplo que um simples
comparador tributario. Inclui elegibilidade legal, prontidao operacional,
qualidade documental, custos de pessoal e readiness.

### Pilar 2: Camada Operacional Continua

| Lacuna | Prioridade |
|--------|------------|
| Conectores ERP | CRITICO |
| Captura e Gestao Documental | CRITICO |
| Ponte de Dados com ContaFlux | CRITICO |
| Recovery de Notas | IMPORTANTE |
| Integracao Bancaria | IMPORTANTE |
| Workflow Pendencias | IMPORTANTE |
| Custos de Pessoal | IMPORTANTE |
| Painel Contabilidade | IMPORTANTE |
| Emissao de Notas | SECUNDARIO |

**Situacao**: 3 gaps criticos no operacional. A Ponte com ContaFlux sobe para
CRITICO porque sem ela o produto coleta dados mas nao gera valor contabil.
Os gaps importantes tem boa cobertura no staging.

---

## Conclusoes (REVISADAS)

1. **6 gaps criticos** bloqueiam o lancamento (3 no diagnostico, 3 no operacional)
2. O **motor fiscal de Lucro Real NAO e gap** do Produto Novo — pertence a ContaFlux
3. A **Ponte com ContaFlux** e CRITICA — sem ela, o produto coleta mas nao entrega
4. O **diagnostico e multidimensional** (6 dimensoes), nao apenas comparacao tributaria
5. O **modulo bancario** e o mais completo no staging [+++] — menor esforco de adaptacao
6. **Conectores ERP** continuam bloqueados por falta de acesso ao Repo1
7. **Captura documental** tem boa base (OCR, NLP, classify) mas precisa estruturacao para ContaFlux
8. **Emissao de notas** pode ser adiada para v2 sem impacto no lancamento
