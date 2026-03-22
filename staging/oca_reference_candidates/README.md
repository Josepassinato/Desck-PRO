# OCA/l10n-brazil Reference Candidates

## Fonte
- **Repositório**: https://github.com/OCA/l10n-brazil
- **Branch**: main (clonado em 2026-03-20)
- **Licença**: AGPL-3.0 (GNU Affero General Public License v3.0)
- **Status**: EXTRAÍDO COM SUCESSO

## Módulos Copiados

| # | Módulo | Versão | Status Dev | Licença | Arquivos | Propósito |
|---|--------|--------|-----------|---------|----------|-----------|
| 1 | l10n_br_fiscal | 18.0.7.2.1 | Production/Stable | AGPL-3 | 203 | Motor fiscal brasileiro completo |
| 2 | l10n_br_fiscal_dfe | 18.0.1.2.0 | - | AGPL-3 | 25 | Distribuição de documentos fiscais |
| 3 | l10n_br_fiscal_certificate | 18.0.1.2.0 | Production/Stable | AGPL-3 | 24 | Gestão de certificados digitais A1 |
| 4 | l10n_br_fiscal_edi | 18.0.2.0.0 | Beta | AGPL-3 | 36 | EDI fiscal (intercâmbio eletrônico) |
| 5 | l10n_br_nfse | 18.0.4.0.1 | - | AGPL-3 | 32 | Nota Fiscal de Serviço Eletrônica |
| 6 | spec_driven_model | 18.0.1.1.2 | Beta | LGPL-3 | 29 | XML binding (XML <-> modelos Odoo) |
| 7 | l10n_br_sped_base | 18.0.1.0.1 | Alpha | AGPL-3 | 21 | Framework abstrato SPED |
| 8 | l10n_br_cnpj_search | 18.0.1.0.2 | Production/Stable | AGPL-3 | 37 | Consulta CNPJ (ReceitaWS/SerPro) |
| 9 | l10n_br_hr | 18.0.1.2.0 | - | AGPL-3 | 37 | Localização RH Brasil (CBO, etc.) |
| 10 | l10n_br_hr_contract | 18.0.1.1.0 | - | AGPL-3 | 36 | Contrato de trabalho Brasil |

**Total: 480 arquivos**

## ALERTA DE LICENÇA - CRÍTICO

Todos os módulos (exceto spec_driven_model que é LGPL-3) são **AGPL-3.0**.

**Implicações:**
- Código derivado DEVE ser distribuído sob AGPL-3.0
- Para produto SaaS fechado: usar APENAS como referência de domínio
- NÃO copiar código Python/XML diretamente
- Extrair apenas CONCEITOS: taxonomias, fluxos, regras de negócio, estruturas de dados
- spec_driven_model (LGPL-3) tem restrições mais leves mas ainda exige revisão

## Tags Aplicadas
- REFERENCE_ONLY
- LICENSE_REVIEW_REQUIRED
- DO_NOT_USE_NOW (até revisão jurídica)
