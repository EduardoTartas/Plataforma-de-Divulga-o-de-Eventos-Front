describe('Página Administrativo (Mockada)', () => {
  const API_URL = 'http://localhost:5015/api';

  beforeEach(() => {
    // 1. Faz o login (ou restaura a sessão cacheada)
    cy.login("admin@admin.com", "SenhaSuperSegur@123");

    // 2. Intercepta a API (Mock)
    cy.intercept('GET', `${API_URL}/usuarios`, {
      statusCode: 200,
      fixture: 'usuarios_mock.json'
    }).as('getUsuarios');

    // 3. Visita a página que você quer testar
    cy.visit('http://localhost:3000/administrativo');

    cy.wait('@getUsuarios');
  });

  it('Deve renderizar a tabela corretamente com dados da fixture', () => {
    cy.contains('h1', 'Gerenciamento de Usuários').should('be.visible');

    // Verifica se renderizou as 2 linhas do JSON fictício
    cy.get('tbody tr').should('have.length', 2);

    // Verifica dados específicos da primeira linha mockada
    cy.get('tbody tr').first().within(() => {
      cy.contains('Usuario Teste 1').should('be.visible');
      cy.contains('teste1@email.com').should('be.visible');
      // Verifica o status (que no JSON é 'ativo')
      cy.get('button[title="Desativar usuário"]').should('exist');
    });
  });

  it('Deve realizar o fluxo de criar novo usuário com sucesso', () => {
    // Mock da criação (POST)
    cy.intercept('POST', `${API_URL}/usuarios`, {
      statusCode: 201,
      body: { code: 201, message: "Criado com sucesso" }
    }).as('postUsuario');

    // Mock do refresh da lista após criar
    cy.intercept('GET', `${API_URL}/usuarios`, {
      statusCode: 200,
      fixture: 'usuarios_mock.json'
    }).as('getUsuariosRefresh');

    cy.getByData('btn-novo-usuario').click();

    // Preenche formulário
    cy.getByData('modal-novo-usuario').within(() => {
      cy.get('input#nome').type('Novo Dev');
      cy.get('input#email').type('dev@ifro.edu.br');
      cy.contains('button', 'Criar Conta').click();
    });

    // Verifica chamadas e UI
    cy.wait('@postUsuario');
    cy.contains('Usuário cadastrado com sucesso!').should('be.visible');
    // Verifica se o modal fechou (após o timeout do componente)
    cy.getByData('modal-novo-usuario').should('not.exist');
  });

  it('Deve tratar erro ao criar usuário (Cenário de Falha)', () => {
    // Simulamos um erro do backend (Ex: email duplicado)
    cy.intercept('POST', `${API_URL}/usuarios`, {
      statusCode: 400,
      body: { message: "Email já cadastrado" }
    }).as('postUsuarioErro');

    cy.getByData('btn-novo-usuario').click();

    cy.getByData('modal-novo-usuario').within(() => {
      cy.get('input#nome').type('Duplicado');
      cy.get('input#email').type('teste1@email.com');
      cy.contains('button', 'Criar Conta').click();
    });

    cy.wait('@postUsuarioErro');
    // O alerta de erro deve aparecer DENTRO do modal
    cy.contains('Erro ao cadastrar usuário').should('be.visible');
  });

  it('Deve abrir modal de exclusão e confirmar deleção', () => {
    // Mock do DELETE
    cy.intercept('DELETE', `${API_URL}/usuarios/*`, {
      statusCode: 200,
      body: { code: 200 }
    }).as('deleteUsuario');

    // Clicar na lixeira do primeiro usuário da lista mockada
    cy.get('tbody tr').first().find('button[title="Excluir usuário"]').click();

    // Validar modal de confirmação
    cy.getByData('modal-confirmar-deletar').should('be.visible');
    cy.contains('Usuario Teste 1').should('be.visible'); // Dados do mock

    cy.getByData('btn-confirmar-deletar').click();

    cy.wait('@deleteUsuario');
    cy.getByData('modal-confirmar-deletar').should('not.exist');
  });

  it('Deve alterar o status do usuário (Patch)', () => {
    // Mock da resposta de atualização de status
    cy.intercept('PATCH', `${API_URL}/usuarios/*/status`, {
      statusCode: 200,
      body: { code: 200, data: { status: 'inativo' } }
    }).as('patchStatus');

    // Clica no toggle do primeiro usuário (que é ativo no mock)
    cy.get('tbody tr').first().find('button[title="Desativar usuário"]').click();

    // Verifica se houve o loading (spinner) ou a chamada
    cy.wait('@patchStatus');
  });
});