/// <reference types="cypress" />

describe("Página Meus Eventos", () => {

  beforeEach(() => {
    // interceptar chamadas da api
    cy.intercept('GET', '**/api/auth/session*').as('getSession');
    cy.intercept('GET', '**/eventos/admin/**').as('getEventos');
    cy.intercept('DELETE', '**/eventos/*').as('deleteEvento');
    cy.intercept('PATCH', '**/eventos/*').as('toggleStatus');

    // login antes de cada teste
    cy.login('admin@admin.com', 'SenhaSuperSegur@123');
    const baseUrl = Cypress.env('NEXTAUTH_URL');
    cy.visit(`${baseUrl}/meus_eventos`);
  });

  describe("Integração com API", () => {
    it("deve carregar eventos da API com sucesso", () => {
      cy.wait('@getEventos').then((interception) => {
        expect(interception.response.statusCode).to.be.oneOf([200, 304]);
        
        // validar estrutura da resposta
        const responseBody = interception.response.body;
        expect(responseBody).to.have.property('data');
        
        if (responseBody.data && responseBody.data.docs) {
          expect(responseBody.data).to.have.property('docs').that.is.an('array');
          expect(responseBody.data).to.have.property('totalPages');
          expect(responseBody.data).to.have.property('totalDocs');
          
          // se houver eventos, validar estrutura
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
      cy.wait('@getEventos').then((interception) => {
        const url = new URL(interception.request.url);
        
        // validar query params
        expect(url.searchParams.get('page')).to.exist;
        expect(url.searchParams.get('limite')).to.exist;
      });
    });
  });

  describe("Renderização da página", () => {
    it("deve carregar todos os elementos principais", () => {
      cy.get('[data-test="meus-eventos-page"]').should("exist");
      cy.get('[data-test="hero-banner"]').should("exist");
      cy.get('[data-test="hero-title"]').should("contain", "Facilidade para os professores");
      cy.get('[data-test="hero-subtitle"]').should("exist");
      cy.get('[data-test="btn-criar-evento"]').should("exist").and("be.visible");
    });

    it("deve exibir lista de eventos após carregamento", () => {
      cy.wait('@getEventos');
      cy.get('[data-test="loading"]', { timeout: 2000 }).should("not.exist");
      cy.get('[data-test="meus-eventos-page"]').should("exist");
    });

    it("deve renderizar eventos retornados pela API", () => {
      cy.wait('@getEventos').then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          // verificar se os cards foram renderizados
          cy.get('.grid').should('exist');

          const primeiroEvento = eventos[0];
          if (primeiroEvento.titulo) {
            cy.contains(primeiroEvento.titulo).should('exist');
          }
        } else {
          cy.contains('Nenhum evento encontrado').should('exist');
        }
      });
    });
  });

  describe("Navegação", () => {
    it("deve navegar para criar evento ao clicar no botão", () => {
      cy.get('[data-test="btn-criar-evento"]').click();
      cy.url({ timeout: 5000 }).should("include", "/criar_eventos");
    });
  });

  describe("Paginação", () => {
    it("deve exibir informações de paginação quando houver múltiplas páginas", () => {
      cy.wait('@getEventos').then((interception) => {
        const totalPages = interception.response.body?.data?.totalPages || 0;
        
        if (totalPages > 1) {
          cy.get('[data-test="pagination-info"]').should("exist");
          cy.get('[data-test="btn-prev-page"]').should("exist");
          cy.get('[data-test="btn-next-page"]').should("exist");
        }
      });
    });

    it("deve fazer requisição com página correta ao navegar", () => {
      cy.wait('@getEventos').then((interception) => {
        const totalPages = interception.response.body?.data?.totalPages || 0;
        
        if (totalPages > 1) {
          cy.get('[data-test="btn-next-page"]')
            .should("not.be.disabled")
            .click();
          
          cy.wait('@getEventos').then((secondInterception) => {
            const url = new URL(secondInterception.request.url);
            expect(url.searchParams.get('page')).to.equal('2');
          });
          
          cy.get('[data-test="page-2"]')
            .should("have.class", "bg-indigo-600");
        }
      });
    });
  });

  describe("Modal de exclusão", () => {
    it("deve abrir modal ao clicar em excluir (se houver eventos)", () => {
      cy.wait('@getEventos').then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          cy.get('button[title="Excluir evento"]').first().click();
          
          cy.get('.fixed.inset-0.z-50').should('exist');
          cy.contains('Confirmar Exclusão').should('exist');
          cy.get('[data-test="modal-text"]').should('exist');
          
          // validar título do evento no modal
          const primeiroEvento = eventos[0];
          if (primeiroEvento.titulo) {
            cy.get('[data-test="modal-text"]').should('contain', primeiroEvento.titulo);
          }
        }
      });
    });

    it("deve fechar modal ao clicar em cancelar", () => {
      cy.wait('@getEventos').then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          cy.get('button[title="Excluir evento"]').first().click();
          cy.get('[data-test="btn-cancel-delete"]').click();
          cy.get('[data-test="delete-modal"]').should("not.exist");
        }
      });
    });

    it("deve fazer requisição DELETE correta ao confirmar exclusão", () => {
      cy.wait('@getEventos').then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          const primeiroEventoId = eventos[0]._id;
          
          cy.get('button[title="Excluir evento"]').first().click();
          cy.get('[data-test="btn-confirm-delete"]').click();
          
          // validar requisição delete com id correto
          cy.wait('@deleteEvento').then((deleteInterception) => {
            expect(deleteInterception.request.url).to.include(primeiroEventoId);
            expect(deleteInterception.request.method).to.equal('DELETE');
          });
        }
      });
    });
  });

  describe("Filtros e busca", () => {
    it("deve validar estrutura da resposta inicial e permitir busca", () => {
      cy.wait('@getEventos').then((interception) => {
        // validar estrutura da resposta inicial
        const url = new URL(interception.request.url);
        expect(url.searchParams.get('page')).to.exist;
        expect(url.searchParams.get('limite')).to.exist;
        
        const responseBody = interception.response.body;
        expect(responseBody).to.have.property('data');
        
        const eventos = responseBody.data?.docs || [];
        
        // validar campos obrigatórios dos eventos
        if (eventos.length > 0) {
          const primeiroEvento = eventos[0];
          expect(primeiroEvento).to.have.property('_id');
          expect(primeiroEvento).to.have.property('titulo');
          expect(primeiroEvento).to.have.property('status');
          expect(primeiroEvento).to.have.property('categoria');
          
          // verificar renderização do título
          cy.contains(primeiroEvento.titulo).should('exist');
        }
      });
      
      // testar campo de busca
      cy.get('input[placeholder="Buscar eventos..."]')
        .scrollIntoView()
        .should('exist')
        .clear()
        .type("evento");
    });

    it("deve validar filtro de status ativo na resposta da API", () => {
      cy.wait('@getEventos').then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        // validar estrutura de status nos eventos
        if (eventos.length > 0) {
          eventos.forEach(evento => {
            expect(evento).to.have.property('status');
            expect([0, 1]).to.include(evento.status);
          });
          
          // verificar presença de badges de status
          cy.get('body').then(($body) => {
            if ($body.text().includes('Ativo') || $body.text().includes('Inativo')) {
              cy.log('badges de status presentes');
            }
          });
        }
      });
      
      // Validar que select de status existe e pode ser aberto
      cy.get('button[role="combobox"]').first().scrollIntoView().should('exist');
    });

    it("deve validar que eventos têm categoria e renderizam corretamente", () => {
      cy.wait('@getEventos').then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        // validar que cada evento tem categoria
        if (eventos.length > 0) {
          eventos.forEach(evento => {
            expect(evento).to.have.property('categoria');
            expect(evento.categoria).to.be.a('string');
          });
          
          // Validar renderização no frontend
          cy.get('.grid').should('exist');
          
          // verificar que um título está visível
          cy.contains(eventos[0].titulo).should('exist');
        }
      });
      
      // Validar que select de categoria existe
      cy.get('button[role="combobox"]').eq(1).scrollIntoView().should('exist');
    });

    it("deve validar consistência entre API e Frontend", () => {
      cy.wait('@getEventos').then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        const totalDocs = interception.response.body?.data?.totalDocs || 0;
        const totalPages = interception.response.body?.data?.totalPages || 0;
        
        cy.log(`Total de eventos: ${totalDocs}, Páginas: ${totalPages}`);
        
        if (eventos.length > 0) {
          // verificar eventos no frontend (até 4)
          eventos.forEach((evento, index) => {
            if (index < 4) {
              cy.get('body').should('contain', evento.titulo);
            }
          });
          
          // validar campos essenciais
          eventos.forEach(evento => {
            expect(evento).to.have.property('_id');
            expect(evento).to.have.property('titulo');
            expect(evento).to.have.property('local');
            expect(evento).to.have.property('dataInicio');
            expect(evento).to.have.property('status');
          });
          
          // verificar paginação quando aplicável
          if (totalPages > 1) {
            cy.get('[data-test="pagination-info"]').should('exist');
          }
        } else {
          // se não há eventos, verificar mensagem
          cy.contains('Nenhum evento encontrado').should('exist');
        }
      });
    });
  });

  describe("Toggle de Status", () => {
    it("deve fazer requisição PATCH ao alterar status do evento", () => {
      cy.wait('@getEventos').then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          const primeiroEventoId = eventos[0]._id;
          
          cy.get('button[title*="evento"]').first().click();
          
          // Validar requisição PATCH
          cy.wait('@toggleStatus', { timeout: 10000 }).then((statusInterception) => {
            expect(statusInterception.request.method).to.equal('PATCH');
            expect(statusInterception.request.url).to.include(primeiroEventoId);
            expect(statusInterception.request.body).to.have.property('status');
          });
        }
      });
    });
  });

});
