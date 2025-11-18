describe("Redefinir senha", () => {

  beforeEach(() => {
    // Garantir que o usuário não está autenticado
    cy.logout();
  });
  
  it("deve exibir erro quando as senhas não coincidem", () => {
    cy.visit("/nova_senha/abc123token"); 
    
    cy.get('[data-test="input-nova-senha"]').type("senhaNova123");
    cy.get('[data-test="input-confirmar-senha"]').type("outraSenha");
    
    cy.get('[data-test="btn-redefinir"]').click();
    
    cy.contains("As senhas não coincidem").should("exist");
  });

  it("deve exigir no mínimo 6 caracteres", () => {
    cy.visit("/nova_senha/abc123token");

    cy.get('[data-test="input-nova-senha"]').type("123");
    cy.get('[data-test="input-confirmar-senha"]').type("123");

    cy.get('[data-test="btn-redefinir"]').click();

    cy.contains("A senha deve ter no mínimo 6 caracteres").should("exist");
  });

  it("deve enviar senha correta e redirecionar", () => {
    cy.intercept("PATCH", "/password/reset/token?token=abc123token", {
      statusCode: 200,
      body: { data: { message: "Senha redefinida com sucesso!" } }
    });

    cy.visit("/nova_senha/abc123token");

    cy.get('[data-test="input-nova-senha"]').type("senhaValida123");
    cy.get('[data-test="input-confirmar-senha"]').type("senhaValida123");

    cy.get('[data-test="btn-redefinir"]').click();

    cy.contains("Senha redefinida com sucesso").should("exist");
  });

});
