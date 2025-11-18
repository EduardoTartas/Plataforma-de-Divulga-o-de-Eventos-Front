describe("Página de Recuperação de Senha", () => {

  beforeEach(() => {
    cy.visit("/recover");
  });

  it("deve carregar os elementos da página", () => {
    cy.get('[data-test="recover-page"]').should("exist");
    cy.get('[data-test="input-email"]').should("exist");
    cy.get('[data-test="btn-submit-recover"]').should("exist");
  });

  it("deve exibir erro ao tentar enviar sem email", () => {
    cy.get('[data-test="btn-submit-recover"]').click();
    cy.contains("Por favor, informe seu e-mail");
  });

  it("deve enviar com sucesso e exibir mensagem mockada", () => {
    cy.intercept("POST", "/recover", {
      statusCode: 200,
      body: {
        data: { message: "Email enviado com sucesso!" }
      }
    }).as("recoverRequest");

    cy.get('[data-test="input-email"]').type("teste@exemplo.com");
    cy.get('[data-test="btn-submit-recover"]').click();

    cy.wait("@recoverRequest");
    cy.contains("Email enviado com sucesso!").should("exist");
  });

  it("deve exibir erro retornado pela API", () => {
    cy.intercept("POST", "/recover", {
      statusCode: 400,
      body: { message: "Email não encontrado" }
    }).as("recoverFail");

    cy.get('[data-test="input-email"]').type("errado@exemplo.com");
    cy.get('[data-test="btn-submit-recover"]').click();

    cy.wait("@recoverFail");
    cy.contains("Email não encontrado").should("exist");
  });
});
