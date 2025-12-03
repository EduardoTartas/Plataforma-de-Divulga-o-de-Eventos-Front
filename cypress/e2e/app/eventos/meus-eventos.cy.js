/// <reference types="cypress" />

describe("Página Meus Eventos", () => {

  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/session*').as('getSession');
    cy.intercept('GET', '**/eventos/admin/**').as('getEventos');
    cy.intercept('DELETE', '**/eventos/*').as('deleteEvento');
    cy.intercept('PATCH', '**/eventos/*').as('toggleStatus');

    cy.login('admin@admin.com', 'SenhaSuperSegur@123');
    const baseUrl = Cypress.env('NEXTAUTH_URL');
    cy.visit(`${baseUrl}/meus_eventos`);
  });

  describe("Integração com API", () => {
    it("deve carregar eventos da API com sucesso", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        expect(interception.response.statusCode).to.be.oneOf([200, 304]);
        
        const responseBody = interception.response.body;
        expect(responseBody).to.have.property('data');
        
        if (responseBody.data && responseBody.data.docs) {
          expect(responseBody.data).to.have.property('docs').that.is.an('array');
          expect(responseBody.data).to.have.property('totalPages');
          expect(responseBody.data).to.have.property('totalDocs');
          
          if (responseBody.data.docs.length > 0) {
            const primeiroEvento = responseBody.data.docs[0];
            expect(primeiroEvento).to.have.property('_id');
            expect(primeiroEvento).to.have.property('titulo');
            expect(primeiroEvento).to.have.property('status');
          }
        }
      });
    });

    it("deve validar parâmetros de paginação na requisição", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get('page')).to.exist;
        expect(url.searchParams.get('limite')).to.exist;
      });
    });
  });

  describe("Renderização da página", () => {
    it("deve carregar todos os elementos principais", () => {
      cy.getByData('meus-eventos-page').should("exist");
      cy.getByData('hero-banner').should("exist");
      cy.getByData('hero-title').should("contain", "Facilidade para os professores");
      cy.getByData('hero-subtitle').should("exist");
      cy.getByData('btn-criar-evento').should("exist").and("be.visible");
    });

    it("deve renderizar eventos retornados pela API", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        cy.wait(1000);
        
        if (eventos.length > 0) {
          const primeiroEvento = eventos[0];
          
          if (primeiroEvento.titulo) {
            cy.get('body', { timeout: 10000 }).should('contain', primeiroEvento.titulo);
          }
        } else {
          cy.contains('Nenhum evento encontrado', { timeout: 8000 }).should('exist');
        }
      });
    });
  });

  describe("Navegação", () => {
    it("deve navegar para criar evento ao clicar no botão", () => {
      cy.getByData('btn-criar-evento').click();
      cy.url({ timeout: 5000 }).should("include", "/criar_eventos");
    });
  });

  describe("Paginação", () => {
    it("deve exibir informações de paginação quando houver múltiplas páginas", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const totalPages = interception.response.body?.data?.totalPages || 0;
        
        if (totalPages > 1) {
          cy.getByData('pagination-info', { timeout: 8000 }).should("exist");
          cy.getByData('btn-prev-page').should("exist");
          cy.getByData('btn-next-page').should("exist");
        }
      });
    });

    it("deve fazer requisição com página correta ao navegar", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const totalPages = interception.response.body?.data?.totalPages || 0;
        
        if (totalPages > 1) {
          cy.getByData('btn-next-page', { timeout: 8000 }).should("not.be.disabled").click();
          
          cy.wait('@getEventos', { timeout: 10000 }).then((secondInterception) => {
            const url = new URL(secondInterception.request.url);
            expect(url.searchParams.get('page')).to.equal('2');
          });
          
          cy.getByData('page-2', { timeout: 5000 }).should("have.class", "bg-indigo-600");
        }
      });
    });
  });

  describe("Modal de exclusão", () => {
    it("deve validar card-container e abrir modal ao clicar em excluir", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          const primeiroEvento = eventos[0];
          
          cy.wait(1000);
          
          cy.get('.w-full.bg-white.rounded-lg.shadow-sm.border.border-gray-200.p-6', { timeout: 8000 })
            .should('exist')
            .within(() => {
              cy.get('.grid.grid-cols-1', { timeout: 8000 }).should('exist');
              
              cy.get('.bg-white.rounded-lg.shadow-sm.border.border-gray-200.overflow-hidden').first().within(() => {
                cy.get('h3.text-base.font-semibold').should('contain', primeiroEvento.titulo);
                cy.get('button[title="Excluir evento"]').should('exist').click();
              });
            });
          
          cy.get('.fixed.inset-0.z-50', { timeout: 5000 }).should('exist');
          cy.contains('Confirmar Exclusão').should('exist');
          cy.get('body').should('contain', primeiroEvento.titulo);
        }
      });
    });

    it("deve fechar modal ao clicar em cancelar", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          cy.wait(1000);
          
          cy.get('.bg-white.rounded-lg.shadow-sm.border.border-gray-200.overflow-hidden', { timeout: 8000 })
            .first()
            .within(() => {
              cy.get('button[title="Excluir evento"]').click();
            });
          
          cy.get('.fixed.inset-0.z-50', { timeout: 5000 }).should('exist');
          
          cy.get('body').then($body => {
            if ($body.find('[data-test="btn-cancel-delete"]').length > 0) {
              cy.getByData('btn-cancel-delete').click();
            } else {
              cy.contains('button', 'Cancelar').click();
            }
          });
          
          cy.get('.fixed.inset-0.z-50').should('not.exist');
        }
      });
    });

    it("deve fazer requisição DELETE ao confirmar exclusão", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          const primeiroEvento = eventos[0];
          
          cy.wait(1000);
          
          cy.get('.bg-white.rounded-lg.shadow-sm.border.border-gray-200.overflow-hidden', { timeout: 8000 })
            .first()
            .within(() => {
              cy.get('button[title="Excluir evento"]').click();
            });
          
          cy.get('.fixed.inset-0.z-50', { timeout: 5000 }).should('exist');
          
          cy.get('body').then($body => {
            if ($body.find('[data-test="btn-confirm-delete"]').length > 0) {
              cy.getByData('btn-confirm-delete').click();
            } else {
              cy.contains('button', 'Confirmar').click();
            }
          });
          
          cy.wait('@deleteEvento', { timeout: 10000 }).then((deleteInterception) => {
            expect(deleteInterception.request.method).to.equal('DELETE');
            expect(deleteInterception.request.url).to.include(primeiroEvento._id);
            expect(deleteInterception.response.statusCode).to.equal(200);
          });
        }
      });
    });
  });

  describe("Filtros e busca", () => {
    it("deve validar estrutura da resposta", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get('page')).to.exist;
        expect(url.searchParams.get('limite')).to.exist;
        
        const responseBody = interception.response.body;
        expect(responseBody).to.have.property('data');
        
        const eventos = responseBody.data?.docs || [];
        
        if (eventos.length > 0) {
          const primeiroEvento = eventos[0];
          expect(primeiroEvento).to.have.property('_id');
          expect(primeiroEvento).to.have.property('titulo');
          expect(primeiroEvento).to.have.property('status');
          expect(primeiroEvento).to.have.property('categoria');
          
          cy.wait(1000);
          cy.get('body', { timeout: 8000 }).should('contain', primeiroEvento.titulo);
        }
      });
    });

    it("deve validar que eventos têm categoria", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          eventos.forEach(evento => {
            expect(evento).to.have.property('categoria');
            expect(evento.categoria).to.be.a('string');
          });
          
          cy.wait(1000);
          cy.get('body', { timeout: 8000 }).should('contain', eventos[0].titulo);
        }
      });
    });
  });

  describe("Toggle de Status", () => {
    it("deve validar card-container e toggle de status", () => {
      cy.wait('@getEventos', { timeout: 10000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          const primeiroEvento = eventos[0];
          const statusInicial = primeiroEvento.status;
          const statusInicialTexto = statusInicial === 1 ? 'Ativo' : 'Inativo';
          
          cy.wait(1000);
          
          cy.get('.w-full.bg-white.rounded-lg.shadow-sm.border.border-gray-200.p-6', { timeout: 8000 })
            .should('exist')
            .within(() => {
              cy.get('h1.text-2xl.font-bold').should('contain', 'Meus Eventos');
              cy.get('.grid.grid-cols-1', { timeout: 8000 }).should('exist');
              
              cy.get('.bg-white.rounded-lg.shadow-sm.border.border-gray-200.overflow-hidden').first().within(() => {
                cy.get('img').should('exist');
                cy.get('h3.text-base.font-semibold').should('contain', primeiroEvento.titulo);
                cy.get('span.px-3.py-1.rounded-full').should('contain', statusInicialTexto);
                cy.get('button[title*="evento"]').first().should('exist').click();
              });
            });
          
          cy.wait('@toggleStatus', { timeout: 10000 }).then((statusInterception) => {
            expect(statusInterception.request.method).to.equal('PATCH');
            expect(statusInterception.request.url).to.include(primeiroEvento._id);
            expect(statusInterception.request.body).to.have.property('status');
            expect(statusInterception.request.body.status).to.not.equal(statusInicial);
          });
        }
      });
    });
  });

  describe("Filtros - Status e Categoria", () => {
    it("deve validar filtro de status - Ativo", () => {
      cy.wait('@getEventos', { timeout: 10000 });
      cy.wait(1000);
      
      cy.intercept('GET', '**/eventos/admin/**').as('getEventosFiltrados');
      
      cy.get('button[role="combobox"]').eq(0).click();
      cy.wait(300);
      cy.contains('[role="option"]', 'Ativo').click();
      
      cy.wait('@getEventosFiltrados', { timeout: 10000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          eventos.forEach((evento) => {
            expect(evento.status).to.equal(1);
          });
          
          cy.wait(1000);
          cy.get('span.px-3.py-1.rounded-full').each(($badge) => {
            expect($badge.text()).to.contain('Ativo');
          });
        }
      });
    });

    it("deve validar filtro de status - Inativo", () => {
      cy.wait('@getEventos', { timeout: 10000 });
      cy.wait(1000);
      
      cy.intercept('GET', '**/eventos/admin/**').as('getEventosFiltrados');
      
      cy.get('button[role="combobox"]').eq(0).click();
      cy.wait(300);
      cy.contains('[role="option"]', 'Inativo').click();
      
      cy.wait('@getEventosFiltrados', { timeout: 10000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          eventos.forEach((evento) => {
            expect(evento.status).to.equal(0);
          });
          
          cy.wait(1000);
          cy.get('span.px-3.py-1.rounded-full').each(($badge) => {
            expect($badge.text()).to.contain('Inativo');
          });
        }
      });
    });

    it("deve validar combinação de filtros - Status e Categoria", () => {
      cy.wait('@getEventos', { timeout: 10000 });
      cy.wait(1000);
      
      cy.intercept('GET', '**/eventos/admin/**').as('getEventosFiltrados');
      
      cy.get('button[role="combobox"]').eq(0).click();
      cy.wait(300);
      cy.contains('[role="option"]', 'Ativo').click();
      
      cy.wait('@getEventosFiltrados', { timeout: 10000 });
      cy.wait(500);
      
      cy.get('button[role="combobox"]').eq(1).click();
      cy.wait(300);
      cy.get('[role="option"]').eq(1).click();
      
      cy.wait('@getEventosFiltrados', { timeout: 10000 }).then((interception) => {
        const url = new URL(interception.request.url);
        expect(url.searchParams.get('status')).to.exist;
        expect(url.searchParams.get('categoria')).to.exist;
        
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          eventos.forEach((evento) => {
            expect(evento.status).to.equal(1);
          });
          
          cy.wait(1000);
          cy.get('span.px-3.py-1.rounded-full').each(($badge) => {
            expect($badge.text()).to.contain('Ativo');
          });
        }
      });
    });
  });

});
