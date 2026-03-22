# CARD 011 - Mapa de Risco de Licenca

> **Objetivo**: Mapear o risco juridico de cada item extraido no staging, classificando
> por tipo de licenca e viabilidade de uso no novo produto (SaaS proprietario).

---

## 1. Legenda de Classificacao

| Classificacao | Significado |
|---------------|-------------|
| **SAFE_REFERENCE** | Pode estudar livremente, sem risco juridico. Codigo proprio ou dominio publico. |
| **REVIEW_BEFORE_USE** | Necessita revisao juridica antes de qualquer adaptacao de codigo. Licenca desconhecida ou ambigua. |
| **HIGH_RISK_FOR_DIRECT_REUSE** | Nao pode copiar codigo diretamente. Apenas conceitos e algoritmos genericos (com revisao). Reuso direto exigiria open-source do novo produto. |

---

## 2. Mapa por Fonte: Repo2 (Proprietario)

Todos os itens de Repo2 sao de propriedade do usuario. Risco juridico baixo para reuso.

| Modulo / Item | Licenca | Fonte | Revisao Juridica | Uso como Referencia | Adaptacao Futura | Proibido ate Revisao | Classificacao |
|---------------|---------|-------|-------------------|---------------------|-------------------|----------------------|---------------|
| AuthProvider + AuthContext | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| authService + authUtils | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| useAuth hook | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| authStore-index | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Componentes Auth UI | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Security Services | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| DashboardLayout + Sidebar | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| GlobalErrorBoundary + Loading | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| ClientSelector | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Email Services | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Supabase Client + Types | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Queue Processor | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Validation Service | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Data Ingestion Task | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| BackButton | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Certificados Digitais Service | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Tributos Base | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Calculador Simples Nacional | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Tributos Estadual | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Tributos Trabalhistas | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| SEFAZ Scraper Service | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| SEFAZ Automatic Service | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| SEFAZ API/XML Services | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Procuracao Service | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| e-CAC Integration | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Serpro Integration | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Simples Nacional Integration | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Automacao Bancaria | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Reconciliacao Bancaria | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Fiscal Workflow Service | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Calculo Fiscal + DARF | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Notas Fiscais Service + Processor | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Lancamentos Processor | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Contabil Service + Config | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Classify Document + OCR + NLP | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Compliance Automation | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Accounting Entry/Automation Tasks | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Paginas Especificas (frontend) | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Componentes de Integracoes | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |
| Integracoes Service (routes) | Proprietario | Repo2 | Nao necessaria | Livre | Livre | Nao | SAFE_REFERENCE |

---

## 3. Mapa por Fonte: OCA l10n-brazil (AGPL-3.0)

**ATENCAO**: Todos os modulos OCA sao licenciados sob **AGPL-3.0** (GNU Affero General Public License v3.0).

Implicacoes da AGPL-3.0:
- **Estudar codigo**: PERMITIDO, sem restricao
- **Copiar conceitos/algoritmos genericos**: NECESSITA REVISAO juridica (fronteira entre "ideia" e "expressao")
- **Reuso direto de codigo**: PROIBIDO para produto proprietario (exigiria open-source de TODO o novo produto, incluindo quando acessado via rede/SaaS)

| Modulo / Item | Licenca | Fonte | Revisao Juridica | Uso como Referencia | Adaptacao Futura | Proibido ate Revisao | Classificacao |
|---------------|---------|-------|-------------------|---------------------|-------------------|----------------------|---------------|
| l10n_br_fiscal | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |
| l10n_br_fiscal_dfe | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |
| l10n_br_fiscal_certificate | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |
| l10n_br_fiscal_edi | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |
| l10n_br_nfse | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |
| spec_driven_model | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |
| l10n_br_sped_base | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |
| l10n_br_cnpj_search | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |
| l10n_br_hr | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |
| l10n_br_hr_contract | AGPL-3.0 | OCA/l10n-brazil | Obrigatoria antes de qualquer adaptacao | Livre para estudo | Somente conceitos, com revisao | Copia direta de codigo | HIGH_RISK_FOR_DIRECT_REUSE |

---

## 4. Mapa por Fonte: Repo1 (Licenca Desconhecida)

**ATENCAO**: A licenca do Repo1 nao foi verificada. Todos os itens devem ser tratados como
REVIEW_BEFORE_USE ate que a licenca seja confirmada.

| Modulo / Item | Licenca | Fonte | Revisao Juridica | Uso como Referencia | Adaptacao Futura | Proibido ate Revisao | Classificacao |
|---------------|---------|-------|-------------------|---------------------|-------------------|----------------------|---------------|
| ERPProvider (interface abstrata) | Desconhecida | Repo1 | Obrigatoria | Com cautela | Apos confirmacao de licenca | Copia direta | REVIEW_BEFORE_USE |
| ERPService (orquestrador) | Desconhecida | Repo1 | Obrigatoria | Com cautela | Apos confirmacao de licenca | Copia direta | REVIEW_BEFORE_USE |
| normalizeInvoice (mapper) | Desconhecida | Repo1 | Obrigatoria | Com cautela | Apos confirmacao de licenca | Copia direta | REVIEW_BEFORE_USE |
| normalizeNFeXML (mapper) | Desconhecida | Repo1 | Obrigatoria | Com cautela | Apos confirmacao de licenca | Copia direta | REVIEW_BEFORE_USE |
| normalizeServiceInvoice (mapper) | Desconhecida | Repo1 | Obrigatoria | Com cautela | Apos confirmacao de licenca | Copia direta | REVIEW_BEFORE_USE |
| BlingProvider | Desconhecida | Repo1 | Obrigatoria | Com cautela | Apos confirmacao de licenca | Copia direta | REVIEW_BEFORE_USE |
| ContaAzulProvider | Desconhecida | Repo1 | Obrigatoria | Com cautela | Apos confirmacao de licenca | Copia direta | REVIEW_BEFORE_USE |
| OmieProvider | Desconhecida | Repo1 | Obrigatoria | Com cautela | Apos confirmacao de licenca | Copia direta | REVIEW_BEFORE_USE |
| TinyProvider | Desconhecida | Repo1 | Obrigatoria | Com cautela | Apos confirmacao de licenca | Copia direta | REVIEW_BEFORE_USE |

---

## 5. Resumo por Classificacao

| Classificacao | Quantidade | Fontes |
|---------------|------------|--------|
| SAFE_REFERENCE | 40 itens | Todos de Repo2 (proprietario) |
| REVIEW_BEFORE_USE | 9 itens | Todos de Repo1 (licenca desconhecida) |
| HIGH_RISK_FOR_DIRECT_REUSE | 10 itens | Todos de OCA (AGPL-3.0) |

---

## 6. Recomendacoes

### O que pode ser livremente utilizado

Todos os **40 itens de Repo2** sao proprietarios e podem ser copiados, adaptados e
incorporados ao novo produto sem restricao juridica. Isso inclui:

- Sistema de autenticacao completo (auth, security, RLS)
- Layout e componentes de UI (dashboard, sidebar, formularios)
- Infraestrutura de email (transacional, agendado, templates)
- Camada de dados Supabase (client, types, services)
- Pipeline de tarefas (queue processor, validation, ingestion)
- Certificados digitais, tributos base
- Todos os calculadores, services e processadores fiscais (como referencia de estrutura)

**Acao**: Iniciar adaptacao na Fase 2 sem impedimentos juridicos.

### O que necessita revisao juridica ANTES da Fase 2

Os **9 itens de Repo1** (conectores ERP) possuem licenca desconhecida:

1. **Verificar imediatamente**: Abrir o repositorio Repo1 e localizar arquivo LICENSE, package.json (campo "license"), ou headers de licenca nos arquivos fonte
2. **Se proprietario/MIT/Apache**: Reclassificar como SAFE_REFERENCE
3. **Se GPL/AGPL**: Reclassificar como HIGH_RISK_FOR_DIRECT_REUSE
4. **Se sem licenca explicita**: Considerar como "todos os direitos reservados" do autor original - necessita autorizacao escrita para reuso

**Acao**: Resolver licenca do Repo1 antes de iniciar modulo de Integracoes ERP.

### O que NUNCA deve ser diretamente copiado

Os **10 modulos OCA** sao AGPL-3.0. Regras rigorosas:

1. **PROIBIDO**: Copiar trechos de codigo Python/XML dos modulos OCA para o novo produto
2. **PROIBIDO**: Usar modulos OCA como dependencia do novo produto (contaminacao AGPL)
3. **PROIBIDO**: Traduzir linha-a-linha codigo OCA Python para TypeScript (considerado obra derivada)
4. **PERMITIDO**: Estudar a arquitetura, taxonomias, modelos de dados e fluxos
5. **PERMITIDO**: Ler specs oficiais (SPED, ABRASF, etc.) referenciadas nos modulos OCA
6. **PERMITIDO**: Implementar do zero baseado em specs oficiais do governo (que sao publicas)
7. **ZONA CINZA**: Reimplementar algoritmos genericos (ex: calculo de digito verificador de CNPJ) - baixo risco, mas documentar que a implementacao foi feita a partir da spec publica

**Acao**: Usar OCA exclusivamente como mapa de dominio. Toda implementacao deve partir de specs oficiais (manuais SPED, schemas XSD da SEFAZ, documentacao ABRASF).

---

## 7. Matriz de Decisao Rapida

```
Preciso usar codigo de...
|
+-- Repo2? --> USAR LIVREMENTE (proprietario)
|
+-- Repo1? --> PARAR. Verificar licenca primeiro.
|   |
|   +-- Licenca confirmada como permissiva? --> Usar
|   +-- Licenca restritiva ou ausente? --> Apenas referencia
|
+-- OCA?  --> NUNCA copiar codigo.
    |
    +-- Preciso entender o dominio? --> Estudar OCA, implementar a partir de specs oficiais
    +-- Preciso de um algoritmo especifico? --> Buscar spec publica, implementar do zero
```

---

## 8. Acoes Prioritarias

| # | Acao | Responsavel | Prazo Sugerido |
|---|------|-------------|----------------|
| 1 | Verificar licenca do Repo1 (arquivo LICENSE ou package.json) | Equipe tecnica | Antes da Fase 2 |
| 2 | Documentar origem de toda implementacao que referencie OCA | Equipe tecnica | Continuo |
| 3 | Considerar consultoria juridica para AGPL-3.0 se qualquer algoritmo OCA for reimplementado | Gestao | Antes do lancamento |
| 4 | Criar header padrao nos arquivos do novo produto indicando "Implementado a partir de spec oficial [referencia]" | Equipe tecnica | Fase 2 |
