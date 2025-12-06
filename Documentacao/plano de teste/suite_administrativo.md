# Suite de Teste - Tela Administrativo (Gerenciamento de Usuários)

**IFRO Events - Plataforma de Divulgação de Eventos**

## 1 - Introdução

A tela "Administrativo" é a interface de gerenciamento de usuários da plataforma. Permite ao administrador cadastrar novos usuários, visualizar a lista completa, alterar status (ativo/inativo), conceder ou revogar permissões de administrador e excluir usuários. É uma funcionalidade crítica para o controle de acesso ao sistema.

## 2 - Arquitetura

A tela utiliza Next.js 15 com App Router e React 19. O gerenciamento de estado e cache dos dados é realizado pelo React Query (TanStack Query v5). A comunicação com o backend ocorre via API REST com autenticação JWT (NextAuth.js). A interface é construída com componentes reutilizáveis (Shadcn/UI / Radix UI) e estilizada com TailwindCSS 4.

**Fluxo de Dados:**
1. Usuário admin acessa a rota `/administrativo`.
2. React Query solicita a lista completa de usuários à API.
3. API valida o token admin e retorna os usuários cadastrados.
4. Interface renderiza a tabela de usuários com ações disponíveis.
5. Ações de CRUD (Criar, Ativar/Desativar, Promover/Despromover Admin, Excluir) invalidam o cache e atualizam a lista automaticamente.

## 3 - Categorização dos Requisitos

| Requisito Funcional | Requisito Não Funcional |
|---------------------|-------------------------|
| RF001 – O sistema deve listar todos os usuários cadastrados na plataforma. | NF001 – O carregamento da lista deve ser rápido e exibir feedback de loading. |
| RF002 – O sistema deve permitir cadastrar novos usuários informando nome e email. | NF002 – As ações de criação, exclusão e alteração devem ter feedback visual imediato (Toast). |
| RF003 – O sistema deve enviar email automático para o novo usuário definir senha. | NF003 – A interface deve ser responsiva para dispositivos móveis. |
| RF004 – O sistema deve permitir alterar o status do usuário (Ativo/Inativo). | NF004 – Modais de confirmação devem ter boa usabilidade e clareza. |
| RF005 – O sistema deve permitir conceder ou revogar permissões de administrador. | |
| RF006 – O sistema deve permitir excluir usuários mediante confirmação. | |
| RF007 – O sistema deve exibir informações resumidas do usuário: ID, Nome, Email, Data de Cadastro, Status e Permissão Admin. | |
| RF008 – O sistema deve validar campos obrigatórios antes de criar usuário. | |

## 4 - Estratégia de Teste

### Escopo de Testes

O escopo abrange a validação funcional da listagem, criação, alteração de status/permissões e exclusão de usuários na tela administrativa.

### 4.1 Ambiente e Ferramentas

Os testes serão executados em ambiente de desenvolvimento/homologação (QA) utilizando massa de dados controlada.

| Ferramenta | Time | Descrição |
|------------|------|-----------|
| Cypress | Qualidade | Testes E2E automatizados dos fluxos de interface. |

### 4.2 Casos de Teste

#### Renderização da Página

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Renderização dos Elementos Principais | ● Ao acessar a tela, deve exibir o título "Gerenciamento de Usuários". <br> ● Deve exibir o subtítulo descritivo. <br> ● Deve exibir a seção "Lista de Usuários". | ● Título principal visível <br> ● Subtítulo visível <br> ● Seção de listagem visível | ● Página renderizada corretamente. |
| Botão Novo Usuário | ● Deve exibir o botão "Novo Usuário". <br> ● Botão deve estar visível e habilitado. | ● Presença do botão <br> ● Texto do botão correto | ● Botão renderizado e funcional. |
| Cabeçalho da Tabela | ● Deve exibir as colunas: ID, Nome, E-mail, Membro Desde, Administrador, Ações, Status. | ● Todas as colunas presentes <br> ● Textos corretos | ● Cabeçalho da tabela completo. |
| Contagem de Usuários | ● Deve exibir a contagem total de usuários cadastrados. <br> ● Formato: "X usuário(s) cadastrado(s)". | ● Exibição da contagem <br> ● Número corresponde aos dados da API | ● Contagem correta e visível. |

#### Exibição de Dados da API

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Listagem de Usuários | ● Ao carregar a página, deve exibir todos os usuários retornados pela API. <br> ● Cada linha deve conter: ID parcial, Nome, Email, Data formatada, Badge de Admin, Badge de Status. | ● Quantidade correta de linhas <br> ● Dados dos usuários renderizados <br> ● Formatação de data (DD/MM/YYYY) <br> ● ID parcial (últimos 8 caracteres) | ● Lista completa e correta. |
| Badge de Status Ativo | ● Usuários ativos devem ter badge verde com texto "ativo". | ● Classe CSS bg-green-100 <br> ● Texto "ativo" exibido | ● Status visual correto. |
| Badge de Status Inativo | ● Usuários inativos devem ter badge vermelho com texto "inativo". | ● Classe CSS bg-red-100 <br> ● Texto "inativo" exibido | ● Status visual correto. |
| Badge de Administrador | ● Usuários admin devem exibir "Sim" na coluna Administrador. <br> ● Usuários não admin devem exibir "Não". | ● Badge "Sim" para admins <br> ● Badge "Não" para não admins | ● Permissão visível corretamente. |
| Formatação de Data | ● A data de cadastro deve ser formatada no padrão brasileiro (DD/MM/YYYY). | ● Verificação do formato <br> ● Data corresponde ao mock | ● Data formatada corretamente. |

#### Botões de Ação na Tabela

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Botão Toggle de Status | ● Cada usuário deve ter um botão para ativar/desativar. <br> ● Ícone deve mudar conforme o status (ToggleRight verde para ativo, ToggleLeft cinza para inativo). | ● Presença do botão em cada linha <br> ● Ícone correto conforme status | ● Botão visível e com ícone adequado. |
| Botão de Excluir | ● Cada usuário deve ter um botão de exclusão (ícone de lixeira). | ● Presença do botão em cada linha <br> ● Tooltip "Excluir usuário" | ● Botão de exclusão visível. |
| Botão Toggle Admin | ● Cada usuário deve ter um botão para promover/despromover admin. <br> ● Tooltip deve indicar a ação (Atribuir Admin / Remover Admin). | ● Presença do botão em cada linha <br> ● Tooltip correto conforme permissão atual | ● Botão de admin visível. |

#### Modal de Novo Usuário

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Abertura do Modal | ● Ao clicar em "Novo Usuário", deve abrir o modal de cadastro. <br> ● Modal deve exibir o título "Cadastrar um novo usuário". | ● Modal visível <br> ● Título correto <br> ● Campos de nome e email presentes | ● Modal aberto corretamente. |
| Campos do Formulário | ● Deve exibir campo de Nome (obrigatório). <br> ● Deve exibir campo de Email (obrigatório). | ● Input de nome visível <br> ● Input de email visível | ● Campos renderizados. |
| Mensagem Informativa | ● Deve exibir mensagem: "O usuário receberá um e-mail com instruções para criar sua senha". | ● Presença da mensagem <br> ● Texto correto | ● Informação clara para o usuário. |
| Botão Criar Conta Desabilitado | ● Quando os campos estão vazios, o botão "Criar Conta" deve estar desabilitado. | ● Botão desabilitado inicialmente | ● Validação funcionando. |
| Botão Criar Conta Habilitado | ● Ao preencher nome e email válidos, o botão "Criar Conta" deve ser habilitado. | ● Botão habilitado após preenchimento | ● Formulário válido. |
| Fechar Modal (Botão X) | ● Ao clicar no X, o modal deve fechar. | ● Modal fechado <br> ● Campos resetados | ● Fechamento funcional. |
| Fechar Modal (Overlay) | ● Ao clicar fora do modal, ele deve fechar. | ● Modal fechado ao clicar no overlay | ● Fechamento funcional. |
| Criar Usuário com Sucesso | ● Ao submeter o formulário, deve chamar a API POST /usuarios. <br> ● Deve exibir toast de sucesso. <br> ● Deve fechar o modal. <br> ● Deve atualizar a lista de usuários. | ● Chamada à API interceptada <br> ● Toast "Usuário cadastrado com sucesso!" <br> ● Modal fechado <br> ● Lista atualizada | ● Usuário criado e visível na tabela. |
| Erro ao Criar Usuário | ● Ao falhar (ex: email duplicado), deve exibir toast de erro. | ● Chamada à API com erro 400 <br> ● Toast "Erro ao cadastrar usuário" | ● Erro tratado corretamente. |
| Loading no Botão | ● Durante a criação, o botão deve exibir "Cadastrando..." e spinner. | ● Texto alterado <br> ● Indicador de loading visível | ● Feedback visual durante operação. |

#### Modal de Exclusão

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Abertura do Modal | ● Ao clicar em excluir, deve abrir modal de confirmação. <br> ● Deve exibir título "Confirmar ação". | ● Modal visível <br> ● Título correto | ● Modal de confirmação aberto. |
| Dados do Usuário | ● Deve exibir os dados do usuário a ser excluído: Nome e Email. | ● Nome do usuário visível <br> ● Email do usuário visível | ● Informação clara sobre a ação. |
| Mensagem de Aviso | ● Deve exibir: "Esta ação não pode ser desfeita". | ● Mensagem de aviso visível | ● Usuário alertado sobre irreversibilidade. |
| Botões de Ação | ● Deve exibir botão "Cancelar". <br> ● Deve exibir botão "Deletar" (vermelho/destrutivo). | ● Botão Cancelar visível <br> ● Botão Deletar visível com estilo destrutivo | ● Opções claras para o usuário. |
| Cancelar Exclusão | ● Ao clicar em Cancelar, o modal deve fechar sem excluir. | ● Modal fechado <br> ● Usuário ainda na lista | ● Ação cancelada. |
| Confirmar Exclusão | ● Ao clicar em Deletar, deve chamar a API DELETE /usuarios/:id. <br> ● Deve exibir toast de sucesso (implícito). <br> ● Deve fechar o modal. <br> ● Deve remover o usuário da lista. | ● Chamada à API interceptada <br> ● Modal fechado <br> ● Usuário removido da tabela | ● Usuário excluído com sucesso. |

#### Alteração de Status

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Ativar/Desativar Usuário | ● Ao clicar no toggle de status, deve chamar a API PATCH /usuarios/:id/status. <br> ● Deve enviar o novo status no corpo da requisição. <br> ● Deve atualizar a interface após sucesso. | ● Chamada à API com body correto <br> ● Badge de status atualizado <br> ● Ícone do botão atualizado | ● Status alterado corretamente. |
| Envio do Status Correto | ● Se usuário está ativo, deve enviar { status: "inativo" }. <br> ● Se usuário está inativo, deve enviar { status: "ativo" }. | ● Interceptação da requisição <br> ● Validação do payload | ● Status correto enviado. |

#### Alteração de Permissão Admin

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Promover/Despromover Admin | ● Ao clicar no toggle de admin, deve chamar a API PATCH /usuarios/:id/admin. <br> ● Deve enviar a nova permissão no corpo da requisição. <br> ● Deve atualizar a interface após sucesso. | ● Chamada à API com body correto <br> ● Badge de admin atualizado | ● Permissão alterada corretamente. |
| Badge "Sim" para Admin | ● Usuários com permissão admin devem ter badge "Sim". | ● Badge visível e correto | ● Status de admin identificado. |
| Badge "Não" para Não Admin | ● Usuários sem permissão admin devem ter badge "Não". | ● Badge visível e correto | ● Status de não admin identificado. |

#### Estados de Loading e Erro

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Loading Inicial | ● Enquanto carrega a lista, deve exibir: "Carregando usuários...". <br> ● Na contagem, deve exibir: "Carregando...". | ● Mensagem de loading visível <br> ● Skeleton ou spinner (se aplicável) | ● Feedback visual durante carregamento. |
| Erro ao Carregar | ● Se a API falhar (500), deve exibir: "Erro ao carregar usuários". | ● Mensagem de erro visível <br> ● Lista não renderizada | ● Erro tratado e comunicado. |
| Lista Vazia | ● Se não houver usuários, deve exibir: "Nenhum usuário encontrado". | ● Mensagem de lista vazia visível | ● Estado vazio tratado. |

#### Paginação

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Ausência de Paginação | ● Se houver poucos usuários (≤ 10), não deve exibir controles de paginação. | ● Ausência de botões Próximo/Anterior | ● Paginação não aparece desnecessariamente. |
| Exibição de Paginação | ● Se houver mais de 10 usuários, deve exibir: "Página X de Y". <br> ● Deve exibir botões "Anterior" e "Próximo". | ● Texto de página visível <br> ● Botões de navegação visíveis | ● Paginação renderizada. |
| Navegação para Próxima Página | ● Ao clicar em "Próximo", deve ir para a próxima página. <br> ● Deve atualizar o texto "Página X de Y". | ● Navegação funcional <br> ● Texto atualizado | ● Próxima página carregada. |
| Botão "Anterior" Desabilitado | ● Na primeira página, o botão "Anterior" deve estar desabilitado. | ● Botão com atributo disabled | ● Navegação restrita adequadamente. |

#### Acessibilidade Básica

| Funcionalidades | Comportamento Esperado | Verificações | Critérios de Aceite |
|-----------------|------------------------|--------------|---------------------|
| Atributos Title em Botões | ● Todos os botões de ação devem ter atributo `title` descritivo. <br> ● Ex: "Desativar usuário", "Excluir usuário", "Atribuir Admin". | ● Presença do atributo title <br> ● Texto descritivo | ● Botões acessíveis. |
| Aria-label no Botão de Fechar Modal | ● Botão X do modal deve ter `aria-label="Fechar modal"`. | ● Atributo aria-label presente | ● Modal acessível. |
| Labels Associados aos Inputs | ● Campos de formulário devem ter labels com atributo `for` associado ao `id` do input. | ● Label com for="nome" <br> ● Label com for="email" | ● Formulário acessível. |

## 5 - Classificação de Bugs

| ID | Nível de Severidade | Descrição |
|----|---------------------|-----------|
| 1 | Blocker | ● Lista não carrega (erro 500/400). <br> ● Não é possível criar usuários. <br> ● Exclusão não funciona ou exclui usuário errado. |
| 2 | Grave | ● Alteração de status/admin não persiste. <br> ● Modal não abre ou não fecha. <br> ● Dados exibidos incorretamente (nome/email trocados). |
| 3 | Moderada | ● Feedback visual (Toast) ausente. <br> ● Paginação com contagem errada. <br> ● Validação de campos não funciona. |
| 4 | Pequena | ● Erros de alinhamento ou texto. <br> ● Labels ou tooltips incorretos. |

## 6 - Definição de Pronto

A funcionalidade "Administrativo - Gerenciamento de Usuários" estará pronta quando todos os casos de teste acima forem executados com sucesso no ambiente de homologação e os critérios de aceite forem atendidos.

---

## Anexo: Resumo dos Testes Automatizados (Cypress)

**Total de Testes Implementados:** 48

### Categorias Cobertas:

1. **Renderização da Página** (6 testes)
   - Título, subtítulo, seção de lista, botão novo usuário, cabeçalho da tabela, contagem de usuários.

2. **Exibição de Dados da API** (6 testes)
   - Quantidade de linhas, dados dos usuários, ID parcial, formatação de data, badges de status.

3. **Botões de Ação** (4 testes)
   - Toggle de status, botão excluir, toggle admin, ícone correto para status ativo.

4. **Modal de Novo Usuário** (10 testes)
   - Abertura, campos, validação, criação com sucesso, erro, loading, fechamento.

5. **Modal de Exclusão** (6 testes)
   - Abertura, dados do usuário, aviso, botões, cancelamento, confirmação.

6. **Alteração de Status** (2 testes)
   - Chamada à API, envio do status correto.

7. **Alteração de Admin** (3 testes)
   - Chamada à API, badges "Sim" e "Não".

8. **Estados de Loading e Erro** (4 testes)
   - Loading inicial, erro ao carregar, lista vazia.

9. **Paginação** (4 testes)
   - Ausência quando há poucos usuários, exibição quando há muitos, navegação, botão desabilitado.

10. **Acessibilidade** (3 testes)
    - Atributos title, aria-label, labels associados.

**Ambiente de Execução:** QA (https://ruan-silva-3000.code.fslab.dev)

**Status:** ✅ Todos os 48 testes passando
