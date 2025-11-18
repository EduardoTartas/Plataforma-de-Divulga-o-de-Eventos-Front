
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("document")) {
    return false;
  }
});



describe("Tela de Login", () => {

  beforeEach(() => {
    // Sessão sem usuário
    cy.intercept("GET", "/api/auth/session", {
      statusCode: 200,
      body: { user: null },
    }).as("sessionEmpty");

    cy.intercept("GET", "/api/auth/providers").as("providers");
    cy.intercept("GET", "/api/auth/csrf").as("csrf");

    cy.intercept("POST", "/api/auth/callback/credentials**", {
      statusCode: 200,
      body: { ok: true },
    }).as("loginRequest");

    cy.visit("http://localhost:3000/login");
    cy.wait("@sessionEmpty");
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
    cy.get('[data-test="input-senha"]').clear().type("admin");

    cy.get('[data-test="btn-entrar"]').click();

    cy.wait("@providers");
    cy.wait("@csrf");
    cy.wait("@loginRequest");

    // Agora mock da sessão autenticada
    cy.intercept("GET", "/api/auth/session", {
      statusCode: 200,
      body: {
        user: {
          id: "1",
          email: "admin@admin.com",
          name: "Administrador",
        },
      },
    }).as("sessionAfter");

    // Força NextAuth a pedir a nova sessão
    cy.window().then((win) => win.fetch("/api/auth/session"));
    cy.wait("@sessionAfter");

    // Checa o redirect FINAL
    cy.url({ timeout: 10000 }).should("include", "/meus_eventos");
  });

});
