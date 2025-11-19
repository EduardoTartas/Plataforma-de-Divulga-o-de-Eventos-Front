// Comandos Customizados do Cypress

/**
 * @example
 * cy.login('admin@admin.com', 'SenhaSuperSegur@123')
 */
Cypress.Commands.add('login', (email, senha) => {
  cy.session([email, senha], () => {
    cy.visit('http://localhost:3000/login');
    cy.get('[data-test="input-email"]').clear().type(email);
    cy.get('[data-test="input-senha"]').clear().type(senha);
    cy.get('[data-test="btn-entrar"]').should('not.be.disabled').click();
    
    // Aguardar o redirecionamento (pode demorar por causa da API)
    cy.url({ timeout: 20000 }).should('include', '/meus_eventos');
  });
});

/**
 * @example
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
