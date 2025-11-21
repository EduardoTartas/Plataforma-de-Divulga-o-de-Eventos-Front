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
    cy.getByData('meus-eventos-page').should("exist");
    cy.getByData('hero-title').should("exist");
    cy.getByData('card-container').should("exist");
  });

  it("navega para criar evento", () => {
    cy.getByData('btn-criar-evento').click();
    cy.url().should("include", "/criar_eventos");
  });

  it("abre modal ao clicar excluir", () => {
    cy.getByData('card-container')
      .find('[data-teste="btn-delete-event"], [data-test="btn-delete-event"]').first().click();

    cy.getByData('delete-modal').should("exist");
  });

  it("cancela o modal", () => {
    cy.getByData('btn-delete-event').first().click();
    cy.getByData('btn-cancel-delete').click();
    cy.getByData('delete-modal').should("not.exist");
  });

  it("confirma delete", () => {
    cy.intercept("DELETE", "/api/eventos/1", {
      statusCode: 200,
      body: { message: "Deletado" }
    }).as("deleteEvent");

    cy.getByData('btn-delete-event').first().click();
    cy.getByData('btn-confirm-delete').click();
    cy.wait("@deleteEvent");
  });

  it("troca de página", () => {
    cy.getByData('btn-next-page').click();
    cy.getByData('page-2').should("have.attr", "aria-current", "page");
  });

});
