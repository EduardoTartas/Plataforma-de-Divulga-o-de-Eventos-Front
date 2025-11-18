// Comandos Customizados do Cypress

/**
 * @example
 * cy.login('admin@admin.com', 'SenhaSuperSegur@123')
 */
Cypress.Commands.add('login', (email, senha) => {
  cy.session([email, senha], () => {
    cy.visit('/login');
    cy.get('[data-test="input-email"]').type(email);
    cy.get('[data-test="input-senha"]').type(senha);
    cy.get('[data-test="btn-entrar"]').click();
    cy.url({ timeout: 10000 }).should('include', '/meus_eventos');
  });
});

/**
 * @example
 * cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit('/login');
});
