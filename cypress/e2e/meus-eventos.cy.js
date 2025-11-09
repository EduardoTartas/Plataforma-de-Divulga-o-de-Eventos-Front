describe('Página Meus Eventos', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/eventos*', {
      statusCode: 200,
      body: {
        data: {
          docs: [
            { _id: '1', titulo: 'Evento Teste 1', status: 1 },
            { _id: '2', titulo: 'Evento Teste 2', status: 0 },
          ],
          totalDocs: 2,
          totalPages: 1
        }
      }
    }).as('getEventos');

    cy.visit('/meus-eventos');
  });

  it('carrega a página', () => {
    cy.get('[data-test="page-meus-eventos"]').should('exist');
  });

  it('exibe loading enquanto busca eventos', () => {
    cy.get('[data-test="loading-eventos"]').should('exist');
    cy.wait('@getEventos');
  });

  it('lista eventos após carregar', () => {
    cy.wait('@getEventos');
    cy.get('[data-test="lista-eventos"]').should('exist');

    cy.contains('Evento Teste 1').should('exist');
    cy.contains('Evento Teste 2').should('exist');
  });

  it('abre modal ao clicar em deletar', () => {
    cy.wait('@getEventos');

   
    cy.get('[data-test="lista-eventos"]')
      .contains('Evento Teste 1')
      .parent()
      .find('[data-test="btn-delete"]') 
      .click();

    cy.get('[data-test="modal-delete-evento"]').should('exist');
  });
});
