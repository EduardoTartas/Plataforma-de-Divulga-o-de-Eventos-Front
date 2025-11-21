describe("Página Meus Eventos", () => {

  beforeEach(() => {
    cy.intercept("GET", "/api/auth/session", {
      statusCode: 200,
      body: {
        user: {
          id: "1",
          name: "Admin",
          email: "admin@admin.com",
        },
      },
    }).as("sessionLogged");

    cy.intercept("GET", "/api/eventos*", {
      statusCode: 200,
      body: {
        data: {
          docs: [
            {
              _id: "1",
              titulo: "Evento Teste",
              status: 1,
              categoria: "Palestra",
            }
          ],
          totalPages: 3,
          totalDocs: 20
        }
      }
    }).as("eventos");

    cy.visit("/meus_eventos");
    cy.wait("@sessionLogged");
    cy.wait("@eventos");
  });

  it("renderiza a página corretamente", () => {
    cy.get('[data-test="meus-eventos-page"]').should("exist");
    cy.get('[data-test="hero-title"]').should("exist");
    cy.get('[data-test="card-container"]').should("exist");
  });

  it("navega para criar evento", () => {
    cy.get('[data-test="btn-criar-evento"]').click();
    cy.url().should("include", "/criar_eventos");
  });

  it("abre modal ao clicar excluir", () => {
    cy.get('[data-test="card-container"]')
      .find('[data-test="btn-delete-event"]').first().click();

    cy.get('[data-test="delete-modal"]').should("exist");
  });

  it("cancela o modal", () => {
    cy.get('[data-test="btn-delete-event"]').first().click();
    cy.get('[data-test="btn-cancel-delete"]').click();
    cy.get('[data-test="delete-modal"]').should("not.exist");
  });

  it("confirma delete", () => {
    cy.intercept("DELETE", "/api/eventos/1", {
      statusCode: 200,
      body: { message: "Deletado" }
    }).as("deleteEvent");

    cy.get('[data-test="btn-delete-event"]').first().click();
    cy.get('[data-test="btn-confirm-delete"]').click();
    cy.wait("@deleteEvent");
  });

  it("troca de página", () => {
    cy.get('[data-test="btn-next-page"]').click();
    cy.get('[data-test="page-2"]').should("have.attr", "aria-current", "page");
  });

});
