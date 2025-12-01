/// <reference types="cypress" />

Cypress.on("uncaught:exception", () => {
  return false;
});

describe("Tela de Nova Senha", () => {

  beforeEach(() => {
    // Garantir que o usuário não está autenticado
    cy.logout();
    cy.visit("http://localhost:3000/nova_senha/abc123"); // exemplo de rota
  });

  it("deve renderizar todos os elementos da tela", () => {
    cy.getByData('reset-container').should("exist");
    cy.getByData('reset-card').should("exist");

    cy.getByData('reset-back').should("exist");
    cy.getByData('reset-title').should("contain", "Definir Nova Senha");
    cy.getByData('reset-subtitle').should("exist");

    cy.getByData('reset-form').should("exist");
    cy.getByData('input-password').should("exist");
    cy.getByData('input-confirm').should("exist");

    cy.getByData('btn-reset').should("exist");
  });

  it("deve preencher as senhas corretamente", () => {
    cy.getByData('input-password')
      .type("123456")
      .should("have.value", "123456");

    cy.getByData('input-confirm')
      .type("123456")
      .should("have.value", "123456");
  });

  it("deve exibir erro quando as senhas são diferentes", () => {
    cy.getByData('input-password').type("123456");
    cy.getByData('input-confirm').type("abcdef");
    cy.getByData('btn-reset').click();

    cy.contains("As senhas não coincidem").should("exist");
  });

  it("deve exibir erro quando senha tem menos de 6 caracteres", () => {
    cy.getByData('input-password').type("123");
    cy.getByData('input-confirm').type("123");
    cy.getByData('btn-reset').click();

    cy.contains("A senha deve ter no mínimo 6 caracteres").should("exist");
  });

  it("deve exibir erro quando o servidor retornar token inválido", () => {
    cy.intercept("PATCH", "/password/reset/token*", {
      statusCode: 400,
      body: {
        message: "Token inválido",
      },
    }).as("resetRequest");

    cy.getByData('input-password').type("123456");
    cy.getByData('input-confirm').type("123456");

    cy.getByData('btn-reset').click();

    cy.wait("@resetRequest");

    cy.getByData('reset-error').should("exist");
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

    cy.getByData('input-password').type("123456");
    cy.getByData('input-confirm').type("123456");
    cy.getByData('btn-reset').click();

    cy.wait("@resetRequest");

    cy.url({ timeout: 6000 }).should("include", "/login");
  });
});
