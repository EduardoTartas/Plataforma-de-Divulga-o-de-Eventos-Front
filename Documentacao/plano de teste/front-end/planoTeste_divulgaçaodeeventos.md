# Plano de Teste

**Projeto: Plataforma de Divulgação de Eventos (React + API)**
*Versão: 1.0*

## Histórico das Alterações


| Data       | Versão | Descrição                                     | Autor(a)                         |
|------------|--------|-----------------------------------------------|----------------------------------|
| 04/11/2025 | 1.0    | Primeira versão do Plano de Testes |   |

---

## 1 - Introdução

O sistema visa gerenciar e divulgar eventos institucionais do IFRO, oferecendo cadastro completo de eventos, controle de status, upload e gerenciamento de mídias, e geração de QR Codes para inscrições. Também inclui páginas otimizadas para totens, ampliando a visibilidade institucional.

Este documento estabelece cenários e critérios de teste para validar funcionamento, integridade dos dados e experiência do usuário.

---

## 2 - Arquitetura

- **Front-end**: React 18 (CRA), React Router DOM, CSS Modules
- **Camadas/organização**:







**API**: Arquitetura modular com controllers, services e repositórios
- **testes ja presentes**:


### Primcipais endpoints 

-
-
-
-
-

---

Recursos adicionais: Integração com QR Code, telas para totens

## 3 - Requisitos 


### Funcionais

Identificador	Nome	Descrição
RF-001	Realizar Login	Permite autenticação do administrador.
RF-002	Manter Eventos	Criar, editar e excluir eventos.
RF-003	Partilha de Permissões para Edição	Envio de link para edição de eventos.
RF-004	Incorporar Imagens e Vídeos	Adicionar mídias aos eventos.
RF-005	Visualizar Eventos	Usuários podem acessar eventos passados, atuais e futuros.
RF-006	Incorporar QR Code para Inscrição	Exibir link de inscrição como QR Code nos totens.

###  Não Funcionais

Identificador	Nome	Descrição
RNF-001	Interface Simples e Intuitiva	Deve ser fácil de utilizar por admins e visitantes.
RNF-002	Layout Pré-Definido para Eventos	Disponibilizar modelos prontos de layout.
RNF-003	Compatível com Touch e Mouse	Suporte a totens e computadores.
RNF-004	Sistema Leve e Rápido	Resposta < 1 segundo.
RNF-005	Identidade Visual IFRO	Manter cores e logos oficiais.
RNF-006	Elementos Interativos	Botões, cards, modais e navegação fluida.
5 - Casos de Teste

Detalhamento específico será criado por funcionalidade conforme desenvolvimento.

### 5 - Estratégia de Teste

Serão aplicados testes em camadas para assegurar qualidade do sistema:

Unitários (Jest)

Validação de funções, services e regras de negócio

Meta: 70% de cobertura

Integração (Jest + Supertest)

Testes entre controllers, services e repositórios

Cobrir endpoints da API

Manuais (Swagger / Postman)

Testes exploratórios em fluxos reais durante o desenvolvimento

E2E (planejado) — Cypress

Validação ponta a ponta dos principais fluxos

Desenvolvimento incremental: cada funcionalidade terá plano e testes dedicados.

###  6 - Ambiente e Ferramentas

Ferramenta	Fase	Descrição
Postman / Swagger UI	Desenvolvimento	Testes manuais de API
Jest	Desenvolvimento	Testes unitários e de integração
Supertest	Desenvolvimento	Testes de endpoints REST
MongoDB Memory Server	Desenvolvimento	Isolar dados durante testes
Cypress (planejado)	E2E	Testes ponta a ponta

###  7 - Classificação de Bugs
ID	Severidade	Descrição
1	Blocker	Impede função principal, crash ou botão essencial quebrado
2	Grave	Problemas lógicos sérios, funcionalidade essencial falha
3	Moderada	Critério não atendido, mas há alternativa
4	Pequena	Ajustes mínimos de UI/texto
9 - Definição de Pronto

Uma funcionalidade só é considerada entregue quando:

Todos os testes ligados a ela forem aprovados

Sem bugs Blocker ou Grave

Interface revisada e acessível

Documentação atualizada

Validação da equipe técnica e QA finalizada

### 8 - Definição de pronto