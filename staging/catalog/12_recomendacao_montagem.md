# 12 - Recomendacao de Montagem (REVISADO)

> **REVISAO 2026-03-20**: Corrigido para refletir a definicao real do produto.
> O Produto Novo NAO e o motor fiscal. A ContaFlux e o cerebro fiscal-contabil.
> Removidos modulos de apuracao/LALUR/SPED que pertencem a ContaFlux.
> Diagnostico ampliado para 6 dimensoes. Ponte ContaFlux priorizada.

Ordem recomendada de montagem para o novo repositorio do produto, justificada por
dependencias tecnicas e impacto de negocio.

---

## Fase 1: Fundacao (Semanas 1-2)

### 1. Base Backend
Framework, schema de banco de dados, configuracao, gerenciamento de variaveis de ambiente.

| Aspecto | Detalhe |
|---------|---------|
| Referencia | secure-api.ts, padroes de infraestrutura Supabase |
| Complexidade | Media |
| Justificativa | Tudo depende da base. Sem backend funcional, nenhum modulo pode ser desenvolvido ou testado. |
| Entregavel | API funcional com migrations, seed data, health check, logging estruturado. |

### 2. Auth & Security
Autenticacao, autorizacao, papeis (contador, cliente, admin), Row Level Security.

| Aspecto | Detalhe |
|---------|---------|
| Referencia | AuthProvider, authService, securityService, rlsValidator |
| Complexidade | Media |
| Justificativa | Seguranca e pre-requisito para qualquer funcionalidade multi-tenant. |
| Entregavel | Login/logout, RBAC funcional, RLS configurado, tokens JWT, refresh flow. |

---

## Fase 2: Shell (Semanas 3-4)

### 3. Cadastro de Empresas + Framework de Integracoes
CRUD de empresas clientes, upload de documentos, framework de integracoes ERP.

| Aspecto | Detalhe |
|---------|---------|
| Referencia | GerenciarClientes, ClientDocuments, componentes de integracoes |
| Complexidade | Media |
| Justificativa | Estrutura minima para cadastrar empresas e preparar terreno para conectores ERP e modulo de diagnostico. |
| Entregavel | Cadastro de empresas com CNPJ, upload/classificacao de documentos, interface de configuracao de integracoes. |

---

## Fase 3: Core MVP - Diagnostico (Semanas 5-10)

### 4. Conectores ERP
Integracoes com Bling, Omie (prioridade), ContaAzul, Tiny.

| Aspecto | Detalhe |
|---------|---------|
| Referencia | Conectores do Repo1 (quando disponivel) |
| Complexidade | Alta |
| Justificativa | Sem dados do ERP, o diagnostico nao tem insumo. Os conectores alimentam todo o produto. |
| Entregavel | Pelo menos 2 conectores funcionais (Bling + Omie). Importacao de NF-e, financeiro, plano de contas. |
| Dependencia | Fase 2 (shell de integracoes). Acesso ao Repo1. |

### 5. Motor de Diagnostico (6 dimensoes)
Motor de scoring multidimensional para avaliacao de migracao.

| Aspecto | Detalhe |
|---------|---------|
| Referencia | calculoFiscal.ts (somente pattern), compliance-automation.ts (pattern de verificacao), validation-service.ts (pattern de checklist) |
| Complexidade | Alta (CONSTRUIR DO ZERO) |
| Justificativa | Core do MVP. O diagnostico completo — nao apenas comparacao tributaria — e o diferencial competitivo. Inclui 6 dimensoes: elegibilidade legal, viabilidade economica, prontidao operacional, qualidade documental, custos de pessoal, readiness. |
| Dimensoes | 1) Elegibilidade legal (CNAE, vedacoes, obrigatoriedade, faturamento). 2) Viabilidade economica (simulacao comparativa ESTIMATIVA — nao apuracao real). 3) Prontidao operacional (ERP, plano de contas, centro de custos, certificado). 4) Qualidade documental (completude de notas, gaps, organizacao). 5) Custos de pessoal (folha, encargos, provisoes). 6) Readiness (capacidade de sustentar LR). |
| Entregavel | Score multidimensional, simulacao comparativa estimativa, relatorio de diagnostico, plano de implantacao personalizado. |
| Dependencia | Fase 3 item 4 (conectores ERP para dados reais). |
| ALERTA | O simulador comparativo faz ESTIMATIVAS para projecao. A apuracao REAL e definitiva e responsabilidade da ContaFlux. NAO tentar replicar a ContaFlux. |

---

## Fase 4: Operacional (Semanas 11-16)

### 6. Captura Documental + Recovery
Captura, classificacao, OCR, armazenamento de documentos. Recovery de notas faltantes.

| Aspecto | Detalhe |
|---------|---------|
| Referencia | classify-document, process-ocr-documents, sefaz services |
| Complexidade | Alta |
| Justificativa | Dados documentais completos sao essenciais para alimentar a ContaFlux. |
| Entregavel | Classificacao automatica, OCR, recovery via DFe (nao scraping), normalizacao para envio a ContaFlux. |
| Dependencia | Fase 2 (documentos), Fase 3 (conectores para identificar gaps). |

### 7. Integracao Bancaria
Importacao de extratos, categorizacao, reconciliacao operacional (pre-ContaFlux).

| Aspecto | Detalhe |
|---------|---------|
| Referencia | reconciliacaoBancaria.ts, automacaoBancaria.ts, pixService.ts, openBankingService.ts |
| Complexidade | Media-Alta |
| Justificativa | Dados bancarios pre-classificados reduzem trabalho manual e alimentam a ContaFlux. |
| Entregavel | Import OFX/OFC, categorizacao automatica, reconciliacao operacional, dados estruturados para ContaFlux. |
| NOTA | Esta e reconciliacao OPERACIONAL (pré-contábil). A conciliacao contabil final e da ContaFlux. |

### 8. Ponte com ContaFlux
Preparacao e envio estruturado de dados para a ContaFlux.

| Aspecto | Detalhe |
|---------|---------|
| Referencia | contabilService.ts, integracoesConfig.ts |
| Complexidade | Alta |
| Justificativa | Conexao vital. Sem ela, o produto coleta dados mas nao gera valor contabil. A ContaFlux depende dos dados bem estruturados que o Produto Novo envia. |
| Entregavel | Contrato de dados definido, normalizacao por tipo, validacao pre-envio, monitoramento de entregas, retry com backoff, feedback da ContaFlux. |
| Dependencia | Definicao da API/documentacao da ContaFlux. |

---

## Fase 5: Complementar (Semanas 17-20)

### 9. Custos de Pessoal
Import de folha, encargos, provisoes, rateio por centro de custo.

| Aspecto | Detalhe |
|---------|---------|
| Referencia | tributosTrabalhistas.ts, OCA l10n_br_hr (SOMENTE ESTUDO) |
| Complexidade | Alta |
| Justificativa | Custos de pessoal sao dados essenciais que o Produto Novo captura e envia a ContaFlux para deducao na apuracao. |
| Entregavel | Import de resumo de folha (CSV), calculo de encargos, provisoes, rateio, envio estruturado a ContaFlux. |

### 10. Workflow de Pendencias + Portal do Cliente
Cobranca documental automatizada, portal de upload, notificacoes multicanal.

| Aspecto | Detalhe |
|---------|---------|
| Referencia | fiscalWorkflowService.ts, queue-processor.ts, emailService.ts |
| Complexidade | Media |
| Justificativa | Diferencial competitivo operacional. Resolve o problema #1 dos escritorios. |
| Entregavel | Portal do cliente para upload, SLA tracking, notificacoes email + WhatsApp, escalation automatico. |

---

## O que NAO fazer na montagem

| Regra | Motivo |
|-------|--------|
| NAO implementar motor de apuracao IRPJ/CSLL/PIS/COFINS | Pertence a ContaFlux. O Produto Novo faz simulacao ESTIMATIVA para diagnostico, nao apuracao real |
| NAO implementar LALUR/LACS | Pertence a ContaFlux |
| NAO implementar SPED ECF | Pertence a ContaFlux |
| NAO implementar escrituracao contabil definitiva | Pertence a ContaFlux |
| NAO copiar codigo OCA (AGPL-3.0) | Licenca AGPL contamina produto fechado |
| NAO adaptar calculadores fiscais para apuracao real | Sao para Simples Nacional e servem apenas como REFERENCIA de pattern |
| NAO implementar SEFAZ por scraping | Usar APIs oficiais (DFe) |
| NAO confundir simulacao estimativa com apuracao real | Simulador do diagnostico faz projecoes; ContaFlux faz apuracao definitiva |
| NAO construir tudo simultaneamente | Respeitar dependencias e sequencia |
| NAO ignorar revisao de licenca | Revisao juridica antes de referenciar OCA |

---

## Visao Geral do Cronograma (REVISADO)

```
Semana:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
Fase 1:  ██ ██
Fase 2:        ██ ██
Fase 3:              ██ ██ ██ ██ ██ ██
Fase 4:                                ██ ██ ██ ██ ██ ██
Fase 5:                                                  ██ ██ ██ ██
```

| Fase | Semanas | Itens | Risco Principal |
|------|---------|-------|-----------------|
| 1 - Fundacao | 1-2 | Base Backend, Auth | Baixo |
| 2 - Shell | 3-4 | Cadastro, Documentos, Integracoes | Baixo |
| 3 - Core MVP | 5-10 | Conectores ERP, Diagnostico 6D | Alto — construcao do zero, acesso Repo1 |
| 4 - Operacional | 11-16 | Captura doc, Bancario, Ponte ContaFlux | Alto — depende API ContaFlux |
| 5 - Complementar | 17-20 | Custos pessoal, Workflow, Portal | Medio |

> **NOTA**: O cronograma anterior era de 18 semanas. Revisado para 20 semanas
> porque o diagnostico e mais complexo (6 dimensoes) e a Ponte ContaFlux e
> um modulo novo que nao existia como item critico antes.
