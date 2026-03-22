# CARD 014 - Rastreabilidade das Correcoes

> **Data:** 2026-03-20
> **Motivo:** Definicao do produto estava incorreta nos documentos 09-13.
> Este documento registra todas as correcoes feitas, com rastreabilidade explicita.

---

## 1. ENTENDIMENTO ANTERIOR (ERRADO)

O Produto Novo era tratado como um sistema fiscal completo que:
- Implementaria motor de apuracao IRPJ/CSLL/PIS/COFINS
- Geraria LALUR/LACS como nucleo proprio
- Seria responsavel pelo SPED ECF
- Faria escrituracao contabil do Lucro Real
- Teria a ContaFlux como integracao OPCIONAL (Fase 5)
- O diagnostico era apenas um comparador tributario (simulacao de carga)

## 2. DEFINICAO CORRIGIDA

O Produto Novo e uma **camada de diagnostico + operacional** que alimenta a ContaFlux:

**Pilar 1 — Diagnostico de Migracao (6 dimensoes):**
1. Elegibilidade legal
2. Viabilidade economica (simulacao ESTIMATIVA, nao apuracao)
3. Prontidao operacional
4. Qualidade documental
5. Custos de pessoal
6. Readiness para sustentar Lucro Real
7. Plano de implantacao

**Pilar 2 — Camada Operacional Continua:**
- Integracao ERP, bancaria
- Emissao de notas, captura documental, recovery
- Pendencias e workflows, custos de pessoal
- Reconciliacao operacional
- **Preparacao e envio estruturado de dados para a ContaFlux**

**Regra arquitetural central:**
A ContaFlux e o cerebro fiscal-contabil. O Produto Novo NAO implementa
apuracao, escrituracao, LALUR, SPED. Apenas captura, estrutura e envia dados.

---

## 3. DOCUMENTOS CORRIGIDOS

| Documento | O que mudou |
|-----------|-------------|
| **09_lacunas_criticas.md** | Removidos 4 gaps que pertencem a ContaFlux. Diagnostico expandido de 1 para 3 gaps (motor 6D, simulador, plano implantacao). Ponte ContaFlux promovida a CRITICO. Adicionada secao "Itens REMOVIDOS". Total de gaps: 14 → 12, criticos: 6 → 6 |
| **10_mapa_funcional_modulos.md** | Removidos modulos de apuracao fiscal. Adicionada secao "O que NAO e modulo". Diagnostico descrito como 6-dimensional. Ponte ContaFlux descrita como preparacao de dados |
| **11_mapa_aplicacao_2_esteiras.md** | Adicionada classificacao "Pertence a ContaFlux". S16 e S20 reclassificados. Esteira 2 redefinida como camada que alimenta ContaFlux. Sequencia recomendada atualizada |
| **12_recomendacao_montagem.md** | Fases reorganizadas. Motor fiscal removido. Diagnostico expandido para 6D. Ponte ContaFlux adicionada como modulo critico na Fase 4. Cronograma: 18 → 20 semanas. Adicionada regra "NAO confundir simulacao com apuracao" |
| **13_relatorio_executivo.md** | Reescrito por completo. Gaps criticos: 14 → 6. Adicionada secao 4 (itens que pertencem a ContaFlux). Conclusao reescrita. Status alterado para "EM REVISAO" |

---

## 4. ITENS CUJA PRIORIDADE MUDOU

### Subiram de prioridade

| Item | Antes | Depois | Motivo |
|------|-------|--------|--------|
| Ponte de Dados com ContaFlux | GAP IMPORTANTE | **GAP CRITICO** | Sem a ponte, o produto coleta dados mas nao gera valor contabil |
| Captura Documental Estruturada | GAP IMPORTANTE | **GAP CRITICO** | E o insumo principal que o Produto Novo prepara para a ContaFlux |
| Score de Prontidao Operacional | GAP IMPORTANTE separado | **Absorvido** no Motor de Diagnostico 6D | Virou uma das 6 dimensoes do diagnostico |
| Gerador de Plano de Implantacao | Nao existia | **GAP CRITICO** | O diagnostico so tem valor se resultar em plano acionavel |

### Desceram de prioridade / removidos

| Item | Antes | Depois | Motivo |
|------|-------|--------|--------|
| Motor de Calculo Lucro Real | GAP CRITICO | **REMOVIDO** | Pertence a ContaFlux |
| Geracao LALUR/LACS | GAP CRITICO | **REMOVIDO** | Pertence a ContaFlux |
| Apuracao IRPJ/CSLL | GAP CRITICO | **REMOVIDO** | Pertence a ContaFlux |
| Integracao SPED ECF | GAP CRITICO | **REMOVIDO** | Pertence a ContaFlux |

### Permaneceram iguais

| Item | Prioridade | Motivo |
|------|-----------|--------|
| Motor de Score de Migracao | GAP CRITICO | Continua sendo o core — agora com 6 dimensoes |
| Simulador Comparativo | GAP CRITICO | Continua critico — agora clarificado como ESTIMATIVA |
| Conectores ERP | GAP CRITICO | Inalterado — alimenta ambos pilares |
| Recovery de Notas | GAP IMPORTANTE | Inalterado |
| Integracao Bancaria | GAP IMPORTANTE | Inalterado — agora clarificado como reconciliacao OPERACIONAL |
| Workflow Pendencias | GAP IMPORTANTE | Inalterado |
| Custos de Pessoal | GAP IMPORTANTE | Inalterado |
| Painel da Contabilidade | GAP IMPORTANTE | Inalterado |
| Emissao de Notas | GAP SECUNDARIO | Inalterado — v2 |

---

## 5. ITENS QUE PERDERAM RELEVANCIA PARA O PRODUTO NOVO

| Item | Estava em | Agora | Justificativa |
|------|-----------|-------|---------------|
| Motor de Calculo Lucro Real | Gap critico #3 | Pertence a ContaFlux | A apuracao fiscal definitiva nao e responsabilidade do Produto Novo |
| LALUR/LACS | Gap critico #4 | Pertence a ContaFlux | Escrituracao fiscal do lucro real e ContaFlux |
| Apuracao IRPJ/CSLL | Gap critico #5 | Pertence a ContaFlux | Processo de apuracao e ContaFlux |
| SPED ECF | Gap critico #6 | Pertence a ContaFlux | Obrigacao acessoria e ContaFlux |
| Lancamentos Processor (S16) | Entra no operacional | Pertence a ContaFlux | Lancamentos contabeis finais sao ContaFlux |
| Accounting Entry Tasks (S20) | Entra no operacional | Pertence a ContaFlux | Automacao contabil definitiva e ContaFlux |

---

## 6. NOVOS GAPS IDENTIFICADOS

| Gap | Pilar | Prioridade | Motivo da inclusao |
|-----|-------|------------|-------------------|
| Avaliacao de Elegibilidade Legal | Diagnostico | CRITICO (absorvido no Motor 6D) | Dimensao que nao existia: CNAE, vedacoes, obrigatoriedade |
| Avaliacao de Prontidao Operacional | Diagnostico | CRITICO (absorvido no Motor 6D) | Dimensao que era gap separado, agora integrada |
| Avaliacao de Qualidade Documental | Diagnostico | CRITICO (absorvido no Motor 6D) | Dimensao nova: completude de notas, gaps |
| Avaliacao de Readiness | Diagnostico | CRITICO (absorvido no Motor 6D) | Dimensao nova: capacidade de sustentar LR |
| Gerador de Plano de Implantacao | Diagnostico | CRITICO | Gap completamente novo — nao existia |
| Ponte de Dados com ContaFlux | Operacional | CRITICO (subiu) | Era IMPORTANTE, agora CRITICO por ser a conexao vital |

---

## 7. IMPACTO DA CORRECAO NOS RISCOS

### Riscos REMOVIDOS
| Risco | Motivo |
|-------|--------|
| Motor de apuracao LR e o modulo mais complexo | Nao e mais responsabilidade do Produto Novo |
| LALUR/LACS sem base no staging | Nao e mais gap do Produto Novo |
| SPED ECF precisa ser construido do zero | Nao e mais gap do Produto Novo |

### Riscos ADICIONADOS
| Risco | Impacto | Mitigacao |
|-------|---------|-----------|
| API da ContaFlux indefinida | Ponte nao pode ser construida; produto coleta mas nao entrega | Definir contrato de dados cedo |
| Diagnostico 6-dimensional e complexo | Nenhuma referencia existe; precisa validacao com especialistas | Definir modelo com contadores; construir dimensao por dimensao |
| Produto depende da ContaFlux para valor completo | Se ContaFlux atrasar, produto fica incompleto | Garantir que diagnostico (Pilar 1) funcione independente |

### Riscos INALTERADOS
| Risco | Status |
|-------|--------|
| Repo1 inacessivel | Permanece — critico |
| SEFAZ scraping fragil | Permanece |
| Licenca OCA AGPL | Permanece |
| Calculadores sao para Simples Nacional | Permanece — servem como referencia apenas |

---

## 8. RESUMO COMPARATIVO

| Metrica | Antes da correcao | Depois da correcao |
|---------|--------------------|--------------------|
| Gaps criticos | 6 | 6 |
| Gaps criticos que pertencem ao Produto Novo | 6 | **6** (diferentes) |
| Gaps criticos que pertenciam a ContaFlux | 4 (errado) | 0 (corrigido) |
| Dimensoes do diagnostico | 1 (comparador) | **6** (multidimensional) |
| Ponte ContaFlux | GAP IMPORTANTE (Fase 5) | **GAP CRITICO (Fase 4)** |
| Cronograma estimado | 18 semanas | **20 semanas** |
| Modulos do Produto Novo | 15 | **12** (3 removidos para ContaFlux) |

---

## 9. DOCUMENTOS NAO ALTERADOS

Os seguintes documentos do catalogo NAO foram alterados nesta revisao
porque nao dependem da definicao arquitetural do produto:

| Documento | Motivo de nao alteracao |
|-----------|------------------------|
| 01_catalogo_completo.md | Inventario factual de arquivos — nao muda |
| 02_inventario_repo2.md | Inventario factual — nao muda |
| 03_inventario_repo1.md | Inventario factual (pendente acesso) — nao muda |
| 04_inventario_oca.md | Inventario factual — nao muda |
| 05_inventario_mestre.md | Inventario combinado — nao muda |
| 06_matriz_dependencias.md | Dependencias tecnicas — nao muda |
| 07_copy_vs_study_candidates.md | Classificacao por reuso — pode precisar revisao menor |
| 08_mapa_risco_licenca.md | Riscos de licenca — nao muda |

> **NOTA**: O documento 07 (copy vs study) pode precisar de ajuste menor
> para reclassificar S16 e S20 como "pertence a ContaFlux", mas a
> classificacao copy/study em si nao muda (eram study candidates antes).

---

## 10. STATUS DA FASE

| Aspecto | Status |
|---------|--------|
| Extracao de arquivos | Concluida (Repo2), Pendente (Repo1), Referencia (OCA) |
| Catalogacao | Concluida |
| Classificacao por tag | Concluida e REVISADA |
| Mapeamento de dependencias | Concluido |
| Mapeamento de riscos tecnicos | Concluido e REVISADO |
| Mapeamento de riscos de licenca | Concluido |
| Identificacao de lacunas | Concluida e REVISADA |
| Mapa de aplicacao | Concluido e REVISADO |
| Rastreabilidade de correcoes | **Este documento** |

**FASE DE EXTRACAO EM ANDAMENTO.**
**NENHUMA IMPLEMENTACAO INICIADA OU AUTORIZADA.**
