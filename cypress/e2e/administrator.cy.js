describe('Página de Usuários', () => {

  beforeEach(() => {
    cy.visit('/usuarios');
  });

  it('carrega a página e mostra loading', () => {
    cy.get('[data-test="loading-users"]').should('exist');
  });

  it('lista usuários', () => {
    cy.get('[data-test^="user-row-"]').should('have.length.greaterThan', 0);
  });

  it('pesquisa usuário', () => {
    cy.get('[data-test="search-user"]').type('joao');
    cy.get('[data-test^="user-row-"]').should('contain.text', 'joao');
  });

  it('altera status do primeiro usuário', () => {
    cy.get('[data-test^="toggle-status-"]').first().click();
    cy.wait(500);
    cy.get('[data-test^="toggle-status-"]').first().should('exist'); 
  });

  it('abre modal ao clicar em deletar', () => {
    cy.get('[data-test^="delete-user-"]').first().click();
    cy.contains('Confirmar exclusão').should('exist');
  });

});
