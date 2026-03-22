# RELATÓRIO EXECUTIVO — FASE DE EXTRAÇÃO CONTROLADA (REVISADO)

**Data:** 2026-03-20
**Fase:** Extração, Catalogação e Mapeamento
**Status:** EM REVISÃO — documentos corrigidos para definicao real do produto
**Objetivo:** Copiar, catalogar e mapear o que pode ser aproveitado para o Produto Novo

> **REVISAO 2026-03-20**: Documentos 09 a 13 corrigidos para refletir a definicao
> real do produto. O Produto Novo NAO e o motor fiscal principal — a ContaFlux e.
> O Produto Novo e a camada de diagnostico + operacional que alimenta a ContaFlux.

---

## 1. RESUMO EXECUTIVO

Foi executada uma fase de extracao controlada a partir de 3 fontes para avaliar o que pode
ser reaproveitado na construcao do Produto Novo.

**Definicao do Produto Novo:**
- **Pilar 1**: Diagnostico completo de migracao Presumido -> Lucro Real (6 dimensoes)
- **Pilar 2**: Camada operacional continua que captura, estrutura e envia dados para a ContaFlux

**O que o Produto Novo NAO e:**
- NAO e o motor de apuracao IRPJ/CSLL/PIS/COFINS (ContaFlux)
- NAO faz LALUR/LACS (ContaFlux)
- NAO gera SPED ECF (ContaFlux)
- NAO faz escrituracao contabil definitiva (ContaFlux)

| Fonte | Identificação | Status | Arquivos | Aproveitamento |
|-------|--------------|--------|----------|----------------|
| **Repo2** (Base) | aura-contabilidade-autom | Base do produto atual | 131 | Infraestrutura, auth, UI shell, bancario |
| **Repo1** (Conectores ERP) | Contaflux-LR-main 3.zip | NÃO ACESSÍVEL | 0 de 9 planejados | Pendente |
| **OCA** (Referência Fiscal) | github.com/OCA/l10n-brazil | EXTRAÍDO | 480 | Referência de domínio apenas |
| **Total** | | | **611** | |

---

## 2. MELHORES CANDIDATOS DE REAPROVEITAMENTO (COPY_CANDIDATE)

| # | Item | Origem | Justificativa |
|---|------|--------|---------------|
| 1 | AuthProvider + authService + authUtils | Repo2 | Sistema auth completo com Supabase |
| 2 | DashboardLayout + Sidebar | Repo2 | Shell UI reutilizavel |
| 3 | securityService + rlsValidator | Repo2 | Camada de seguranca e RLS |
| 4 | Email service (templates + scheduling) | Repo2 | Infraestrutura de notificacao |
| 5 | supabaseClient + supabaseTypes | Repo2 | Camada de dados |
| 6 | secure-api.ts (Supabase shared) | Repo2 | Padrao de seguranca para edge functions |
| 7 | queue-processor + validation-service | Repo2 | Infra de filas e validacao |
| 8 | GerenciarClientes + ClientDocuments | Repo2 | Cadastro mestre |
| 9 | Modulo bancario completo | Repo2 | Reconciliacao, PIX, Open Banking, ML |
| 10 | classify-document + OCR + NLP | Repo2 | Captura documental |
| 11 | ERPProvider + providers | Repo1 | **PENDENTE** - critico |

---

## 3. ITENS APENAS PARA ESTUDO (STUDY_CANDIDATE)

| # | Item | Origem | Por que apenas estudo |
|---|------|--------|----------------------|
| 1 | calculoFiscal.ts + calculadores/* | Repo2 | Pattern de calculo util; logica e para Simples Nacional |
| 2 | SEFAZ scraper services | Repo2 | Fragil (scraping); reimplementar via API |
| 3 | RegimeFiscal.tsx | Repo2 | Conceito util, UI diferente |
| 4 | l10n_br_fiscal (203 arquivos) | OCA | AGPL-3.0 — estudar taxonomias, NAO copiar |
| 5 | l10n_br_nfse | OCA | AGPL-3.0 — estudar fluxo NFS-e |
| 6 | l10n_br_fiscal_dfe | OCA | AGPL-3.0 — estudar DFe |
| 7 | l10n_br_hr + hr_contract | OCA | AGPL-3.0 — estudar modelo RH/folha |
| 8 | l10n_br_sped_base | OCA | AGPL-3.0 — estudar estrutura SPED |
| 9 | compliance-automation.ts | Repo2 | Pattern util para prontidao operacional |

---

## 4. ITENS QUE PERTENCEM A CONTAFLUX (NAO implementar no Produto Novo)

| Item | Por que pertence a ContaFlux |
|------|------------------------------|
| Motor de calculo IRPJ/CSLL/PIS/COFINS | ContaFlux e o cerebro fiscal |
| LALUR/LACS | ContaFlux faz escrituracao e apuracao |
| Apuracao tributaria Lucro Real | ContaFlux faz apuracao definitiva |
| SPED ECF | ContaFlux gera obrigacoes acessorias |
| Escrituracao contabil definitiva | ContaFlux faz lancamentos finais |

> **NOTA**: A versao anterior deste documento classificava esses itens como "gaps criticos"
> do Produto Novo. Isso estava ERRADO. O Produto Novo precisa conhecer a ESTRUTURA
> desses dados para preparar os insumos, mas NAO implementa a logica.

---

## 5. RISCOS TÉCNICOS

### Risco Alto
| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| Repo1 (conectores ERP) inacessivel | Sem conectores Bling/Omie/ContaAzul/Tiny | Obter zip ou acesso ao repo |
| Diagnostico multidimensional e complexo | 6 dimensoes a construir do zero | Validar modelo com contadores especialistas |
| API da ContaFlux indefinida | Ponte nao pode ser construida | Definir contrato de dados cedo |

### Risco Medio
| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| SEFAZ scraping fragil | Recovery de notas falha | Reimplementar via APIs oficiais |
| Reconciliacao bancaria basica | Nao atende necessidades operacionais | Adaptar modulo existente |
| Frontends acoplados ao produto atual | UI nao serve diretamente | Extrair padroes, reconstruir |

### Risco Baixo
| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| Auth usa Supabase Auth | Limita opcoes de provider | Adequado para SaaS |
| Email usa Edge Functions | Depende de Supabase | Portavel com adaptacao minima |

---

## 6. RISCOS DE LICENÇA

| Fonte | Licença | Risco | Uso Permitido |
|-------|---------|-------|---------------|
| **Repo2** | Proprietário/Interno | BAIXO | Reuso livre |
| **Repo1** | Desconhecido | MÉDIO | Verificar antes |
| **OCA** | **AGPL-3.0** | **ALTO para reuso direto** | Apenas referência |
| **OCA** (spec_driven_model) | **LGPL-3** | MÉDIO | Referência OK |

---

## 7. GAPS CRÍTICOS (REVISADO — 6 gaps, nao mais 14)

| # | Gap | Pilar | Prioridade | Complexidade | Bloqueia? |
|---|-----|-------|------------|-------------|-----------|
| 1 | Motor de Diagnostico 6-Dimensional | Diagnostico | CRITICO | Alta | Sim |
| 2 | Simulador Comparativo (estimativa) | Diagnostico | CRITICO | Alta | Sim |
| 3 | Gerador de Plano de Implantacao | Diagnostico | CRITICO | Media | Sim |
| 4 | Conectores ERP (Bling, Omie) | Operacional | CRITICO | Alta | Sim |
| 5 | Captura Documental Estruturada | Operacional | CRITICO | Media | Sim |
| 6 | Ponte de Dados com ContaFlux | Operacional | CRITICO | Alta | Sim |

> **Removidos**: Motor de Calculo LR, LALUR/LACS, Apuracao IRPJ/CSLL, SPED ECF
> (pertencem a ContaFlux — versao anterior estava errada).

---

## 8. RECOMENDAÇÃO DE PRÓXIMOS PASSOS

### Imediato (antes da proxima fase)
1. **Obter acesso ao Repo1** (conectores ERP) — critico para MVP
2. **Definir contrato de dados com ContaFlux** — sem isso, a ponte nao pode ser construida
3. **Revisão jurídica** da licença OCA
4. **Validar modelo de diagnostico** com contadores especialistas (6 dimensoes)
5. **Completar extracao de staging** — verificar se ha itens faltando

### Fase Seguinte: Montagem (quando autorizada)
1. Fundacao: Backend + Auth + Security (reuso alto)
2. Shell: Cadastro empresas + Documentos + Integracoes
3. Core MVP: Conectores ERP + Diagnostico 6-Dimensional
4. Operacional: Captura doc + Bancario + Ponte ContaFlux
5. Complementar: Custos pessoal + Workflow + Portal cliente

### O que NÃO fazer
- **NAO** implementar motor fiscal (pertence a ContaFlux)
- **NAO** implementar LALUR/LACS, SPED ECF (ContaFlux)
- **NAO** copiar codigo OCA
- **NAO** adaptar calculadores para apuracao real (servem como referencia)
- **NAO** implementar SEFAZ por scraping
- **NAO** confundir simulacao estimativa (diagnostico) com apuracao real (ContaFlux)
- **NAO** iniciar construcao antes de completar a fase de extracao

---

## 9. ENTREGÁVEIS DESTA FASE

| # | Entregável | Arquivo | Status |
|---|-----------|---------|--------|
| 1 | Catalogo completo | catalog/01_catalogo_completo.md | Gerado |
| 2 | Inventario Repo2 | catalog/02_inventario_repo2.md | Gerado |
| 3 | Inventario Repo1 | catalog/03_inventario_repo1.md | Gerado (pendente acesso) |
| 4 | Inventario OCA | catalog/04_inventario_oca.md | Gerado |
| 5 | Inventario mestre | catalog/05_inventario_mestre.md | Gerado |
| 6 | Matriz de dependencias | catalog/06_matriz_dependencias.md | Gerado |
| 7 | Copy vs Study candidates | catalog/07_copy_vs_study_candidates.md | Gerado |
| 8 | Mapa risco de licenca | catalog/08_mapa_risco_licenca.md | Gerado |
| 9 | Lacunas criticas | catalog/09_lacunas_criticas.md | **REVISADO** |
| 10 | Mapa funcional modulos | catalog/10_mapa_funcional_modulos.md | **REVISADO** |
| 11 | Mapa aplicacao 2 esteiras | catalog/11_mapa_aplicacao_2_esteiras.md | **REVISADO** |
| 12 | Recomendacao montagem | catalog/12_recomendacao_montagem.md | **REVISADO** |
| 13 | Relatorio executivo | catalog/13_relatorio_executivo.md | **REVISADO** (este arquivo) |

---

## CONCLUSÃO (REVISADA)

A extracao controlada identificou **material reutilizavel significativo** para
infraestrutura (auth, security, email, UI shell, modulo bancario, captura documental)
e revelou que o **core do produto — o diagnostico multidimensional de migracao —
precisa ser construido do zero**.

A correcao mais importante desta revisao e a clarificacao de que o Produto Novo
**NAO e o motor fiscal**. A ContaFlux e o cerebro fiscal-contabil. O Produto Novo
e a camada de diagnostico + operacional que:
- **Diagnostica** se o cliente deve migrar (6 dimensoes)
- **Captura** dados operacionais (ERP, banco, documentos, folha)
- **Estrutura** e **envia** esses dados para a ContaFlux

Os gaps criticos sao 6 (nao mais 14), e nenhum envolve construir um motor de
apuracao fiscal — isso pertence a ContaFlux.

O bloqueio mais urgente continua sendo **obter acesso ao Repo1** (conectores ERP)
e **definir o contrato de dados com a ContaFlux**.

**FASE DE EXTRAÇÃO EM ANDAMENTO. NENHUMA IMPLEMENTAÇÃO FOI INICIADA.**
**NENHUMA CONSTRUÇÃO DEVE SER FEITA ANTES DE COMPLETAR ESTA FASE.**
