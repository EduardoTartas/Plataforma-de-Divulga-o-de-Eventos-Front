/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            getByData(selector: string): Chainable<JQuery<HTMLElement>>;
            login(email?: string, password?: string): Chainable<void>;
        }
    }
}

Cypress.Commands.add('getByData', (selector: string) => {
    return cy.get(`[data-teste="${selector}"], [data-test="${selector}"]`);
});

Cypress.Commands.add('login', (email = 'admin@admin.com', password = 'SenhaSuperSegur@123') => {
    cy.session(`session-${email}`, () => {

        // 1. Acessa a tela de login
        cy.visit('http://localhost:3000/login');

        // 2. Preenche os dados (com validação visual para garantir que o campo existe)
        cy.getByData('input-email').should('be.visible').clear().type(email);
        cy.getByData('input-senha').should('be.visible').clear().type(password);
        cy.getByData('btn-entrar').click();

        // 4. Ponto Crítico: Espera o redirecionamento acontecer para confirmar que o login rolou
        cy.url({ timeout: 10000 }).should('include', '/meus_eventos');

        // Verifica se o cookie do NextAuth foi criado
        cy.getCookie('next-auth.session-token').should('exist');

    }, {
        // Validador: Antes de restaurar a sessão, ele roda isso pra ver se o usuário ainda está logado
        validate: () => {
            cy.getCookie('next-auth.session-token').should('exist');
        },
        cacheAcrossSpecs: true // Mantém o login entre arquivos de teste diferentes
    });
});

export { };