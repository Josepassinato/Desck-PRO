# 03 - Inventario Repo1: Conectores ERP

> **Fonte**: Repositorio de conectores ERP (TypeScript)
> **Data do inventario**: 2026-03-20
> **Diretorio staging**: `staging/repo1_connector_candidates/`
> **Status**: NAO ACESSIVEL — arquivos planejados, nenhum extraido
> **Total de arquivos planejados**: 9
> **Descricao**: Conectores ERP para Bling, Omie, ContaAzul e Tiny com normalizadores de documentos fiscais

---

## Aviso de Acesso

O repositorio fonte nao esta acessivel no ambiente atual.
Os 9 arquivos abaixo sao **planejados** com base na estrutura conhecida do repo.
Todos estao marcados como **REFERENCE_ONLY** ate que o acesso seja concedido e o codigo analisado.

---

## Inventario Planejado

| # | Caminho no Staging (planejado) | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 1 | repo1_connector_candidates/core/erp/ERPProvider.ts | core/erp/ERPProvider.ts | arquivo | REFERENCE_ONLY | Interface base abstrata para provedores ERP — define contrato generico | Referencia para design da interface IERPProvider no produto novo |
| 2 | repo1_connector_candidates/core/erp/ERPService.ts | core/erp/ERPService.ts | arquivo | REFERENCE_ONLY | Servico orquestrador de chamadas ERP — seleciona provider por config | Referencia para servico orquestrador de ERP |
| 3 | repo1_connector_candidates/core/erp/mappers/normalizeInvoice.ts | core/erp/mappers/normalizeInvoice.ts | arquivo | REFERENCE_ONLY | Normalizador de faturas entre diferentes ERPs | Referencia para normalizacao de invoices multi-ERP |
| 4 | repo1_connector_candidates/core/erp/mappers/normalizeNFeXML.ts | core/erp/mappers/normalizeNFeXML.ts | arquivo | REFERENCE_ONLY | Parser e normalizador de XML de NF-e | Referencia para parsing de XML NF-e |
| 5 | repo1_connector_candidates/core/erp/mappers/normalizeServiceInvoice.ts | core/erp/mappers/normalizeServiceInvoice.ts | arquivo | REFERENCE_ONLY | Normalizador de notas de servico (NFS-e) | Referencia para normalizacao de NFS-e |
| 6 | repo1_connector_candidates/core/erp/providers/BlingProvider.ts | core/erp/providers/BlingProvider.ts | arquivo | REFERENCE_ONLY | Conector especifico para ERP Bling (API v3) | Referencia para integracao Bling |
| 7 | repo1_connector_candidates/core/erp/providers/ContaAzulProvider.ts | core/erp/providers/ContaAzulProvider.ts | arquivo | REFERENCE_ONLY | Conector especifico para ERP Conta Azul | Referencia para integracao Conta Azul |
| 8 | repo1_connector_candidates/core/erp/providers/OmieProvider.ts | core/erp/providers/OmieProvider.ts | arquivo | REFERENCE_ONLY | Conector especifico para ERP Omie | Referencia para integracao Omie |
| 9 | repo1_connector_candidates/core/erp/providers/TinyProvider.ts | core/erp/providers/TinyProvider.ts | arquivo | REFERENCE_ONLY | Conector especifico para ERP Tiny | Referencia para integracao Tiny |

---

## Resumo por Tag

| Tag | Qtd | % |
|-----|-----|---|
| REFERENCE_ONLY | 9 | 100% |
| **TOTAL** | **9** | **100%** |

## Resumo por Categoria

| Categoria | Arquivos | Descricao |
|-----------|----------|-----------|
| Interface/Servico Core | ERPProvider.ts, ERPService.ts | Contrato generico e orquestrador |
| Mappers/Normalizadores | normalizeInvoice.ts, normalizeNFeXML.ts, normalizeServiceInvoice.ts | Parsing e normalizacao de documentos fiscais |
| Providers ERP | BlingProvider.ts, ContaAzulProvider.ts, OmieProvider.ts, TinyProvider.ts | Conectores especificos por ERP |

## Prioridade de Extracao (quando acessivel)

| Prioridade | Arquivos | Justificativa |
|------------|----------|---------------|
| Alta | normalizeNFeXML.ts, normalizeInvoice.ts, normalizeServiceInvoice.ts | Logica de parsing/normalizacao reusavel diretamente |
| Media | ERPProvider.ts, ERPService.ts | Interface generica que define contrato para providers |
| Baixa | BlingProvider.ts, ContaAzulProvider.ts, OmieProvider.ts, TinyProvider.ts | Providers especificos — dependem da interface generica |

---

## Acoes Pendentes

- [ ] Obter acesso ao repositorio fonte
- [ ] Extrair os 9 arquivos listados para `staging/repo1_connector_candidates/`
- [ ] Reavaliar tags apos analise do codigo (possivelmente promover para USE_AS_BASE ou EXTRACT_LOGIC_ONLY)
- [ ] Atualizar inventario mestre (05_inventario_mestre.md)
