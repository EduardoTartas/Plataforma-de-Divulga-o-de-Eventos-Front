
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("document")) {
    return false;
  }
});

describe("Tela de Login", () => {

  beforeEach(() => {
    // Limpar cookies e sessão antes de cada teste
    cy.clearCookies();
    cy.clearLocalStorage();
    
    const baseUrl = Cypress.env('NEXTAUTH_URL');
    cy.visit(`${baseUrl}/login`);
  });

  it("deve renderizar todos os elementos da tela", () => {
    cy.get('[data-test="login-container"]').should("exist");
    cy.get('[data-test="login-card"]').should("exist");
    cy.get('[data-test="login-logo"]').should("exist");
    cy.get('[data-test="login-title"]').should("contain", "Entrar");
    cy.get('[data-test="login-subtitle"]').should("contain", "Acesse sua conta");
    cy.get('[data-test="login-form"]').should("exist");

    cy.get('[data-test="input-email"]').should("exist");
    cy.get('[data-test="input-senha"]').should("exist");
    cy.get('[data-test="checkbox-remember"]').should("exist");

    cy.get('[data-test="btn-entrar"]').should("exist");
    cy.get('[data-test="link-cadastro"]').should("exist");
    cy.get('[data-test="link-recuperar"]').should("exist");
  });

  it("deve navegar para a página de cadastro", () => {
    cy.get('[data-test="link-cadastro"]').click();
    cy.url({ timeout: 8000 }).should("include", "/cadastro");
  });

  it("deve preencher email, senha e remember", () => {
    cy.get('[data-test="input-email"]')
      .clear()
      .type("admin@admin.com")
      .should("have.value", "admin@admin.com");

    cy.get('[data-test="input-senha"]')
      .clear()
      .type("admin")
      .should("have.value", "admin");

    cy.get('[data-test="checkbox-remember"]')
      .check()
      .should("be.checked");
  });

  it("deve realizar o login com sucesso e redirecionar", () => {
    cy.get('[data-test="input-email"]').clear().type("admin@admin.com");
    cy.get('[data-test="input-senha"]').clear().type("SenhaSuperSegur@123");

    cy.get('[data-test="btn-entrar"]').click();

    cy.url({ timeout: 10000 }).should("include", "/meus_eventos");
    
    // verificar que o usuário está autenticado
    cy.getCookie("next-auth.session-token").should("exist");
  });

});
