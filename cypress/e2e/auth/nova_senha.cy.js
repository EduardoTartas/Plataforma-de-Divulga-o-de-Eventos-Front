/// <reference types="cypress" />

Cypress.on("uncaught:exception", () => {
  return false;
});

describe("Tela de Nova Senha", () => {

  beforeEach(() => {
    cy.intercept("PATCH", "/password/reset/token*", (req) => {
      req.reply((res) => {
        res.send({}); // configurado individualmente nos testes
      });
    }).as("resetRequest");

    cy.visit("http://localhost:3000/nova_senha/abc123"); // exemplo de rota
  });

  it("deve renderizar todos os elementos da tela", () => {
    cy.get('[data-test="reset-container"]').should("exist");
    cy.get('[data-test="reset-card"]').should("exist");

    cy.get('[data-test="reset-back"]').should("exist");
    cy.get('[data-test="reset-title"]').should("contain", "Definir Nova Senha");
    cy.get('[data-test="reset-subtitle"]').should("exist");

    cy.get('[data-test="reset-form"]').should("exist");
    cy.get('[data-test="input-password"]').should("exist");
    cy.get('[data-test="input-confirm"]').should("exist");

    cy.get('[data-test="btn-reset"]').should("exist");
  });

  it("deve preencher as senhas corretamente", () => {
    cy.get('[data-test="input-password"]')
      .type("123456")
      .should("have.value", "123456");

    cy.get('[data-test="input-confirm"]')
      .type("123456")
      .should("have.value", "123456");
  });

  it("deve exibir erro quando as senhas são diferentes", () => {
    cy.get('[data-test="input-password"]').type("123456");
    cy.get('[data-test="input-confirm"]').type("abcdef");
    cy.get('[data-test="btn-reset"]').click();

    cy.contains("As senhas não coincidem").should("exist");
  });

  it("deve exibir erro quando senha tem menos de 6 caracteres", () => {
    cy.get('[data-test="input-password"]').type("123");
    cy.get('[data-test="input-confirm"]').type("123");
    cy.get('[data-test="btn-reset"]').click();

    cy.contains("A senha deve ter no mínimo 6 caracteres").should("exist");
  });

  it("deve exibir erro quando o servidor retornar token inválido", () => {
    cy.intercept("PATCH", "/password/reset/token*", {
      statusCode: 400,
      body: {
        message: "Token inválido",
      },
    }).as("resetRequest");

    cy.get('[data-test="input-password"]').type("123456");
    cy.get('[data-test="input-confirm"]').type("123456");

    cy.get('[data-test="btn-reset"]').click();

    cy.wait("@resetRequest");

    cy.get('[data-test="reset-error"]').should("exist");
    cy.contains("Token inválido").should("exist");
  });

  it("deve redefinir senha com sucesso e redirecionar", () => {
    cy.intercept("PATCH", "/password/reset/token*", {
      statusCode: 200,
      body: {
        data: {
          message: "Senha alterada com sucesso",
        },
      },
    }).as("resetRequest");

    cy.get('[data-test="input-password"]').type("123456");
    cy.get('[data-test="input-confirm"]').type("123456");
    cy.get('[data-test="btn-reset"]').click();

    cy.wait("@resetRequest");

    cy.url({ timeout: 6000 }).should("include", "/login");
  });
});
