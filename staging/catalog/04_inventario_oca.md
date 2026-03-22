# 04 - Inventario OCA: l10n-brazil

> **Fonte**: https://github.com/OCA/l10n-brazil
> **Licenca**: AGPL-3.0 (GNU Affero General Public License v3.0)
> **Data do inventario**: 2026-03-20
> **Diretorio staging**: `staging/oca_reference_candidates/`
> **Status**: NAO ACESSIVEL — modulos planejados, nenhum clonado
> **Total de modulos inventariados**: 10

---

## ALERTA DE LICENCA

**AGPL-3.0**: Todos os modulos OCA estao licenciados sob AGPL-3.0 (exceto spec_driven_model sob LGPL-3.0).
Qualquer codigo derivado ou que incorpore diretamente modulos OCA DEVE ser distribuido sob AGPL-3.0 ou compativel.

| Restricao | Detalhe |
|-----------|---------|
| Copia direta de codigo | **PROIBIDA** sem revisao juridica |
| Uso de tabelas de dados publicos (NCM, CFOP, CST) | Dados publicos — pode reusar |
| Reimplementacao de logica (clean-room) | Permitido |
| Fork/derivacao | Exige AGPL-3.0 no produto |
| Referencia para regras de negocio | Permitido |

---

## Inventario de Modulos

| # | Caminho no Staging (planejado) | Caminho Original | Tipo | Tag | Motivo da Copia | Uso Provavel no Produto Novo |
|---|---|---|---|---|---|---|
| 1 | oca_reference_candidates/l10n_br_fiscal/ | OCA/l10n-brazil/l10n_br_fiscal/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | Motor fiscal brasileiro completo — NCM, CFOP, CST, CSOSN, aliquotas, regras por regime, calculo ICMS/IPI/PIS/COFINS | Referencia principal para regras fiscais, tabelas de impostos, logica de calculo tributario |
| 2 | oca_reference_candidates/l10n_br_fiscal_dfe/ | OCA/l10n-brazil/l10n_br_fiscal_dfe/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | Distribuicao de documentos fiscais eletronicos (DF-e) — consulta e download NF-e/CT-e via SEFAZ | Referencia para fluxo de distribuicao DF-e e integracao webservices SEFAZ |
| 3 | oca_reference_candidates/l10n_br_fiscal_certificate/ | OCA/l10n-brazil/l10n_br_fiscal_certificate/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | Gestao de certificados digitais A1 — upload, validacao, renovacao, assinatura XML | Referencia para gestao de certificados digitais e assinatura de documentos |
| 4 | oca_reference_candidates/l10n_br_fiscal_edi/ | OCA/l10n-brazil/l10n_br_fiscal_edi/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | EDI fiscal — geracao e transmissao de NF-e, NFS-e, CT-e | Referencia para estrutura de EDI fiscal e transmissao de documentos |
| 5 | oca_reference_candidates/l10n_br_nfse/ | OCA/l10n-brazil/l10n_br_nfse/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | Nota Fiscal de Servico Eletronica — geracao, transmissao, consulta para provedores municipais | Referencia para integracao com prefeituras e provedores NFS-e |
| 6 | oca_reference_candidates/spec_driven_model/ | OCA/l10n-brazil/spec_driven_model/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | Framework de XML binding — gera modelos a partir de schemas XSD fiscais | Referencia para approach de XML binding e parsing de schemas fiscais |
| 7 | oca_reference_candidates/l10n_br_sped_base/ | OCA/l10n-brazil/l10n_br_sped_base/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | Framework base para SPED — estrutura para ECD, ECF, EFD-ICMS/IPI, EFD-Contribuicoes | Referencia para estrutura de arquivos SPED e layout de registros |
| 8 | oca_reference_candidates/l10n_br_cnpj_search/ | OCA/l10n-brazil/l10n_br_cnpj_search/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | Consulta automatica de CNPJ via SERPRO e Receita Federal | Referencia para integracao com APIs de consulta CNPJ |
| 9 | oca_reference_candidates/l10n_br_hr/ | OCA/l10n-brazil/l10n_br_hr/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | Recursos Humanos Brasil — adapta RH para legislacao trabalhista CLT | Referencia para regras trabalhistas brasileiras e calculos de folha |
| 10 | oca_reference_candidates/l10n_br_hr_contract/ | OCA/l10n-brazil/l10n_br_hr_contract/ | pasta | REFERENCE_ONLY, LICENSE_REVIEW_REQUIRED | Contrato de trabalho Brasil — tipos de contrato, rescisao, ferias, 13o conforme CLT | Referencia para regras de contrato de trabalho e calculos trabalhistas |

---

## Resumo por Tag

| Tag | Qtd | % |
|-----|-----|---|
| REFERENCE_ONLY | 10 | 100% |
| LICENSE_REVIEW_REQUIRED | 10 | 100% |

> Nota: Todos os modulos possuem dupla tag (REFERENCE_ONLY + LICENSE_REVIEW_REQUIRED).

## Detalhamento por Licenca

| Licenca | Modulos | Qtd |
|---------|---------|-----|
| AGPL-3.0 | l10n_br_fiscal, l10n_br_fiscal_dfe, l10n_br_fiscal_certificate, l10n_br_fiscal_edi, l10n_br_nfse, l10n_br_sped_base, l10n_br_cnpj_search, l10n_br_hr, l10n_br_hr_contract | 9 |
| LGPL-3.0 | spec_driven_model | 1 |

## Prioridade de Referencia

| Prioridade | Modulos | Justificativa |
|------------|---------|---------------|
| Alta (Motor Fiscal) | l10n_br_fiscal, l10n_br_fiscal_edi, l10n_br_fiscal_certificate | Regras fiscais, tabelas NCM/CFOP/CST, calculos, documentos eletronicos |
| Media (Integracoes Gov) | l10n_br_fiscal_dfe, l10n_br_nfse, l10n_br_cnpj_search, l10n_br_sped_base | Distribuicao DF-e, NFS-e, consulta CNPJ, SPED |
| Baixa (RH/Trabalhista) | spec_driven_model, l10n_br_hr, l10n_br_hr_contract | XML binding, RH Brasil, contratos CLT |

---

## Estimativa de Arquivos por Tipo

| Tipo de Arquivo | Qtd Estimada | Relevancia |
|-----------------|-------------|------------|
| Modelos Python (.py) | ~180 | Alta — contem logica de negocios |
| Views XML (.xml) | ~120 | Baixa — especificos do Odoo |
| Dados/Demo (.csv/.xml) | ~80 | Media — tabelas fiscais reusaveis |
| Testes (.py) | ~50 | Media — validam regras de negocios |
| Manifests/Config | ~30 | Baixa — especificos do Odoo |
| Docs/README | ~20 | Baixa — documentacao geral |
| **TOTAL ESTIMADO** | **~480** | |

---

## Acoes Pendentes

- [ ] Clonar repositorio: `git clone https://github.com/OCA/l10n-brazil.git`
- [ ] Copiar APENAS os 10 modulos listados para `staging/oca_reference_candidates/`
- [ ] Manter TODOS como REFERENCE_ONLY + LICENSE_REVIEW_REQUIRED
- [ ] NAO incorporar codigo diretamente no produto novo
- [ ] Consultar juridico sobre uso de tabelas de dados publicos (NCM, CFOP, CST)
