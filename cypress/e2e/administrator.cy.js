describe('Página de Administração', () => {
  const API_BASE_URL = 'http://localhost:5015/api';
  let usuariosAPI = [];

  beforeEach(() => {
    cy.intercept('GET', `${API_BASE_URL}/usuarios`).as('fetchUsuarios');

    cy.visit('http://localhost:3000/login');
    
    // Realizar login como administrador
    cy.get('[data-test="input-email"]').clear().type("admin@admin.com");
    cy.get('[data-test="input-senha"]').clear().type("SenhaSuperSegur@123");
    cy.get('[data-test="btn-entrar"]').click();
    cy.url({ timeout: 10000 }).should("include", "/meus_eventos");

    cy.visit('http://localhost:3000/administrativo');

    cy.wait('@fetchUsuarios').then((interception) => {
      usuariosAPI = interception.response.body.data;
    });
  });

  it('deve exibir elementos visuais da página', () => {
    cy.contains('h1', 'Gerenciamento de Usuários').should('be.visible');
    cy.contains('h2', 'Lista de Usuários').should('be.visible');
    cy.get('[data-teste="btn-novo-usuario"]').should('be.visible').should('contain.text', 'Novo Usuário');
    cy.contains('usuário(s) cadastrado(s)').should('be.visible');
  });

  it('deve comparar dados da API com dados exibidos no frontend', () => {
    cy.then(() => {
      const totalUsuarios = usuariosAPI.length;
      const usuariosPaginaAtual = usuariosAPI.slice(0, 10);

      usuariosPaginaAtual.forEach((usuario, index) => {
        cy.get('tbody tr').eq(index).within(() => {
          cy.get('td').eq(1).should('contain', usuario.nome);
          cy.get('td').eq(2).should('contain', usuario.email);

          const dataFormatada = new Date(usuario.createdAt).toLocaleDateString('pt-BR');
          cy.get('td').eq(3).should('contain', dataFormatada);

          cy.get('td').eq(4).should('contain', usuario.admin ? 'Sim' : 'Não');
          cy.get('td').eq(6).should('contain', usuario.status);
        });
      });

      cy.contains(`${totalUsuarios} usuário(s) cadastrado(s)`).should('be.visible');
    });
  });

  it('deve exibir modal e criar novo usuário', () => {
    cy.intercept('POST', `${API_BASE_URL}/usuarios`).as('criarUsuario');
    cy.intercept('GET', `${API_BASE_URL}/usuarios`).as('atualizarLista');

    cy.get('[data-teste="btn-novo-usuario"]').click();
    cy.get('[data-teste="modal-novo-usuario"]').should('be.visible');

    cy.get('input[placeholder="John Doe"]').type('Novo User Teste');
    cy.get('input[placeholder="johndoe@email.com"]').type('novousertest@email.com');
    cy.contains('button', 'Criar Conta').click();

    cy.wait('@criarUsuario').its('response.statusCode').should('eq', 201);
    cy.contains('Usuário cadastrado com sucesso!').should('be.visible');
  });

  it('deve alternar status e comparar com resposta da API', () => {
    cy.intercept('PATCH', `${API_BASE_URL}/usuarios/*/status`).as('alterarStatus');

    cy.get('tbody tr').first().within(() => {
      cy.get('button[title*="Desativar"], button[title*="Ativar"]').first().click();
    });

    cy.wait('@alterarStatus').then((interception) => {
      const novoStatus = interception.response.body.data.status;

      cy.get('tbody tr').first().within(() => {
        cy.contains('span', novoStatus).should('be.visible');
      });
    });
  });

  it('deve alternar permissão admin e comparar com resposta da API', () => {
    cy.intercept('PATCH', `${API_BASE_URL}/usuarios/*/admin`).as('alterarAdmin');

    cy.get('tbody tr').first().within(() => {
      cy.get('button').contains('Não, Sim').first().parent().click();
    });

    cy.wait('@alterarAdmin').then((interception) => {
      const novoAdmin = interception.response.body.data.admin;
      const adminText = novoAdmin ? 'Sim' : 'Não';

      cy.get('tbody tr').first().within(() => {
        cy.contains('span', adminText).should('be.visible');
      });
    });
  });

  it('deve exibir modal de confirmação e deletar usuário', () => {
    cy.intercept('DELETE', `${API_BASE_URL}/usuarios/*`).as('deletarUsuario');
    cy.intercept('GET', `${API_BASE_URL}/usuarios`).as('atualizarLista');

    cy.get('tbody tr').first().within(() => {
      cy.get('button[title="Excluir usuário"]').click();
    });

    cy.get('[data-teste="modal-confirmar-deletar"]').should('be.visible');
    cy.contains('Deseja realmente deletar este usuario?').should('be.visible');
    cy.get('[data-teste="btn-confirmar-deletar"]').click();

    cy.wait('@deletarUsuario').its('response.statusCode').should('eq', 200);
  });
});
