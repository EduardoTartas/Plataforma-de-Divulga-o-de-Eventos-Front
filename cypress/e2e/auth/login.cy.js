describe("Login", () => {
  it("deve logar com sucesso", () => {
    cy.visit("/login");

    cy.get('[data-test="input-email"]').type("admin@admin.com");
    cy.get('[data-test="input-senha"]').type("admin");
    cy.get('[data-test="btn-login"]').click();

    cy.url().should("include", "/meus_eventos");
  });

  it("deve mostrar erro ao logar com senha errada", () => {
    cy.visit("/login");

    cy.get('[data-test="input-email"]').type("admin@admin.com");
    cy.get('[data-test="input-senha"]').type("errado");
    cy.get('[data-test="btn-login"]').click();

    cy.contains("Credenciais inválidas").should("exist");
  });
});
