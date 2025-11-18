# Plano de Teste — Plataforma de Divulgação de Eventos (Front)

**Versão:** 1.0  
**Data:** 07/11/2025

## Histórico das alterações

| Data       | Versão | Descrição                                                              | Autor(a) |
|------------|--------|------------------------------------------------------------------------|----------|
| 07/11/2025 | 1.0    | Plano de Teste inicial adaptado ao projeto 'plataforma-de-divulgacao' | Equipe   |

---

## 1 — Introdução

Este documento descreve o Plano de Teste para o front-end Next.js do projeto "Plataforma de Divulgação de Eventos".
O objetivo é definir requisitos, casos de teste (unitários, integração e manuais), critérios de aceitação e recomendações de execução para garantir qualidade funcional e técnica.

Escopo: autenticação (login/cadastro), gestão de eventos (listar, criar, editar, excluir, ativar/desativar), filtros/pesquisa, paginação, totem público e integração com a API (via `fetchData` / `NEXT_PUBLIC_API_URL`).

---

## 2 — Resumo da Arquitetura (relevante para testes)

- Framework: Next.js (App Router em `src/app/`), React 19, TypeScript.
- Autenticação: `next-auth` (API route em `src/app/api/auth/[...nextauth]/route.ts`).
- Client HTTP: `src/services/api.ts` (função `fetchData` usa `NEXT_PUBLIC_API_URL` e tenta obter token via `getSession()`).
- Estado/Busca: React Query (`@tanstack/react-query`) com hooks em `src/hooks/` (ex.: `useEventos`).
- Principais componentes de UI: `src/components/login-form.tsx`, `src/components/ui/*`.
- Rotas importantes: `src/app/(auth)/`, `src/app/(app)/`, `src/app/(totem)/`.

Observação: alguns arquivos `page.tsx` podem estar vazios (ex.: `criar_eventos/page.tsx`). Ajustar conforme necessário antes de testar fluxos que dependem dessas páginas.

---

## 3 — Requisitos (mapeados ao projeto)

### Funcionais

| Código | Requisito                                                                 | Detalhe / Regra de Negócio |
|--------|---------------------------------------------------------------------------|----------------------------|
| RF001  | Listar eventos (meus_eventos)                                            | Paginação, filtros por título, status e categoria (params: `page`, `limite`, `titulo`, `status`, `categoria`). |
| RF002  | Criar evento                                                              | Campos obrigatórios: `titulo`, `descricao`, `local`, `dataInicio`, `dataFim`, `categoria`. Validações conforme `src/validor/validacao.ts`.
| RF003  | Editar evento                                                             | Mesmas validações da criação; alterações persistidas via API.
| RF004  | Excluir evento com confirmação                                            | Modal de confirmação; DELETE /eventos/:id.
| RF005  | Ativar / desativar evento                                                 | PATCH /eventos/:id com `status` (0/1); toast de sucesso.
| RF006  | Login (LoginForm)                                                         | Validações por campo (email, senha); integração com next-auth; erros mostrados ao usuário.
| RF007  | Cadastro de usuário                                                       | Validações por campo; feedback de sucesso/erro.
| RF008  | Totem público                                                             | Página `/totem` exibe eventos públicos/ativos.
| RF009  | Tratamento de erros da API                                                 | `fetchData` deve exibir mensagens amigáveis e redirecionar para `/login` em 498.

### Não Funcionais

- RNF001: Compatibilidade com navegadores modernos (Chrome/Firefox/Edge).
- RNF002: Latência percebida < 2s em operações comuns (listagem, paginação).
- RNF003: Código modular, testável (hooks, services, validators).
- RNF004: Mensagens em pt-BR consistentes.
- RNF005: Acessibilidade mínima (labels, foco em modais, navegação por teclado).

---

## 4 — Casos de Teste (detalhados)

### A — Autenticação

- CT-LOGIN-01 — Login válido: preencher email/senha válidos → next-auth signin → sessão ativa (verificar `getSession()` ou cookie) e UI atualizada.
- CT-LOGIN-02 — Login inválido: credenciais incorretas → mensagem de erro apropriada.
- CT-LOGIN-03 — Validação de formulário: e-mail inválido / senha curta → mensagens por campo .
- CT-CAD-01 — Cadastro válido: preencher campos obrigatórios → sucesso + feedback.
- CT-CAD-02 — Cadastro inválido: mostrar erros por campo.

### B — Listagem e Filtros de Eventos

- CT-LIST-01 — Carregar `meus_eventos`: GET /eventos → exibe lista com títulos, datas, local, status e paginação.
- CT-LIST-02 — Filtro por busca: enviar `titulo` → lista filtrada.
- CT-LIST-03 — Filtro por status: selecionar `active` / `all` → resultados corretos.
- CT-LIST-04 — Filtro por categoria: selecionar categoria → resultados corretos.
- CT-LIST-05 — Paginação: navegar entre páginas → atualização correta da lista.

### C — Criar / Editar Evento

- CT-CREATE-01 — Criação válida: preencher formulário do criar_eventos → POST /eventos → sucesso + aparece na listagem.
- CT-CREATE-02 — Validações: título curto, descrição curta, dataFim < dataInicio, link inválido, tags inválidas → erros por campo .
- CT-EDIT-01 — Edição válida: alterar e salvar → alterações refletidas via API.
- CT-EDIT-02 — Edição com erro na API → mensagem amigável e formulário permanece.

### D — Ações sobre Eventos

- CT-ACT-01 — Toggle status: alternar status → PATCH /eventos/:id → toast de sucesso e atualização da lista.
- CT-ACT-02 — Excluir evento: confirmar no modal → DELETE /eventos/:id → remoção da lista + toast.
- CT-ACT-03 — Falha ao excluir (500) → mensagem de erro e sem remoção no UI.

### E — Totem e Visualização Pública

- CT-TOTEM-01 — Acessar `/totem`: exibir apenas eventos ativos; layout adequado.
- CT-TOTEM-02 — Evento com mídia: exibir mídias listadas em `midia`.

### F — Integração com API e erros

- CT-API-01 — API offline (fetch falha): mostrar 'Erro de conexão' e opção de retry.
- CT-API-02 — 401/498: redirecionar para `/login` quando aplicável (ver `fetchData`).
- CT-API-03 — Resposta não-JSON: mensagem apropriada (tratada em `fetchData`).

### G — UI / Acessibilidade

- CT-UI-01 — Modais acessíveis: foco inicial, ESC para fechar, tab-order correto.
- CT-UI-02 — Inputs com `label` vinculados.
- CT-UI-03 — Responsividade: testar em breakpoints (mobile/tablet/desktop).

---

## 5 — Estratégia de Teste e Ferramentas

- Unitários (Jest + React Testing Library)
  - Testar: `src/validor/validacao.ts`, hooks (`useEventos` com mock do `fetchData`), `fetchData` (mock global `fetch`), componentes pequenos.
  - Meta: cobertura mínima 70% nas camadas utilitárias e hooks.

- Integração (MSW)
  - Mockar `NEXT_PUBLIC_API_URL` endpoints e testar listagem, criação e ações com React Query.

- E2E (Cypress — recomendado)
  - Fluxos: login → criar evento → verificar lista → toggle status → acessar totem.

- Manuais
  - Testes exploratórios com Postman/Insomnia e testes de UI.

---

## 6 — Ambiente e Execução

- Variáveis importantes:
  - `NEXT_PUBLIC_API_URL` — URL base da API (definir em `.env.local`).
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET` — para next-auth (dev).

- Como rodar local:

```bash
npm install
# configurar .env.local com NEXT_PUBLIC_API_URL=http://localhost:8000 (ou porta do backend)
npm run dev
```


## 7 — Priorização de Testes

- Alta: autenticação, listagem de eventos, criação/validação de evento, tratamento de erros (CT-LOGIN-01, CT-LIST-01, CT-CREATE-01/02, CT-API-01).
- Média: edição/exclusão de eventos, totem.
- Baixa: testes de layout e casos extremos.

---

## 8 — Classificação de Bugs

| ID | Severidade  | Descrição |
|----|-------------|-----------|
| 1  | Blocker     | Impede uso da funcionalidade principal (ex.: `/` 404, login quebrado).
| 2  | Grave       | Erro lógico crítico (ex.: evento criado sem campos obrigatórios).
| 3  | Moderado    | Problema com workaround (ex.: filtro que não retorna resultados esperados).
| 4  | Pequeno     | Ajustes de UI/texto/estilo.

---

## 9 — Definição de Pronto

Uma funcionalidade será considerada pronta quando:

- Passar todos os casos de teste aplicáveis.
- Não apresentar bugs Blocker/Grave.
- UI revisada em pt-BR e acessibilidade mínima atendida.
- Documentação atualizada.

---


