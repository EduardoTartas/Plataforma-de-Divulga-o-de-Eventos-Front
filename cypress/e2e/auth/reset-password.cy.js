describe("Redefinir senha", () => {

  it("deve exibir erro quando as senhas não coincidem", () => {
    cy.visit("/nova_senha/abc123token");

    cy.getByData('input-nova-senha').type("senhaNova123");
    cy.getByData('input-confirmar-senha').type("outraSenha");

    cy.getByData('btn-redefinir').click();

    cy.contains("As senhas não coincidem").should("exist");
  });

  it("deve exigir no mínimo 6 caracteres", () => {
    cy.visit("/nova_senha/abc123token");

    cy.getByData('input-nova-senha').type("123");
    cy.getByData('input-confirmar-senha').type("123");

    cy.getByData('btn-redefinir').click();

    cy.contains("A senha deve ter no mínimo 6 caracteres").should("exist");
  });

  it("deve enviar senha correta e redirecionar", () => {
    cy.intercept("PATCH", "/password/reset/token?token=abc123token", {
      statusCode: 200,
      body: { data: { message: "Senha redefinida com sucesso!" } }
    });

    cy.visit("/nova_senha/abc123token");

    cy.getByData('input-nova-senha').type("senhaValida123");
    cy.getByData('input-confirmar-senha').type("senhaValida123");

    cy.getByData('btn-redefinir').click();

    cy.contains("Senha redefinida com sucesso").should("exist");
  });

});
