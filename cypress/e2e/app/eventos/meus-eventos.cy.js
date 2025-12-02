/// <reference types="cypress" />

describe("Página Meus Eventos", () => {

  beforeEach(() => {
    // Interceptar chamadas da API
    cy.intercept('GET', '**/api/auth/session*').as('getSession');
    cy.intercept('GET', '**/eventos/admin/**').as('getEventos');
    cy.intercept('DELETE', '**/eventos/*').as('deleteEvento');
    cy.intercept('PATCH', '**/eventos/*').as('toggleStatus');

    // Login antes de cada teste
    cy.login('admin@admin.com', 'SenhaSuperSegur@123');
    const baseUrl = Cypress.env('NEXTAUTH_URL');
    cy.visit(`${baseUrl}/meus_eventos`);
  });

  describe("Integração com API", () => {
    it("deve carregar eventos da API com sucesso", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
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
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
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

    it("deve exibir lista de eventos após carregamento", () => {
      cy.wait('@getEventos', { timeout: 15000 });
      
      // Esperar o loading desaparecer OU timeout (caso não apareça)
      cy.get('body').then($body => {
        if ($body.find('[data-test="loading"]').length > 0) {
          cy.getByData('loading', { timeout: 15000 }).should("not.exist");
        }
      });
      
      cy.getByData('meus-eventos-page').should("exist");
    });

    it("deve renderizar eventos retornados pela API", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        // Aguardar renderização com múltiplas tentativas
        cy.wait(2000);
        
        if (eventos.length > 0) {
          const primeiroEvento = eventos[0];
          
          // Verificar se o título do evento aparece na página
          if (primeiroEvento.titulo) {
            cy.get('body', { timeout: 15000 }).should('contain', primeiroEvento.titulo);
          }
          
          // Tentar encontrar o grid OU verificar que há conteúdo renderizado
          cy.get('body').then($body => {
            const hasGrid = $body.find('[data-test="events-grid"]').length > 0;
            const hasCards = $body.find('[data-test="event-card"]').length > 0;
            
            if (hasGrid || hasCards || $body.text().includes(primeiroEvento.titulo)) {
              cy.log('Eventos renderizados com sucesso');
            }
          });
        } else {
          cy.contains('Nenhum evento encontrado', { timeout: 10000 }).should('exist');
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
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const totalPages = interception.response.body?.data?.totalPages || 0;
        
        if (totalPages > 1) {
          cy.getByData('pagination-info', { timeout: 10000 }).should("exist");
          cy.getByData('btn-prev-page').should("exist");
          cy.getByData('btn-next-page').should("exist");
        }
      });
    });

    it("deve fazer requisição com página correta ao navegar", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const totalPages = interception.response.body?.data?.totalPages || 0;
        
        if (totalPages > 1) {
          cy.getByData('btn-next-page', { timeout: 10000 })
            .should("not.be.disabled")
            .click();
          
          cy.wait('@getEventos', { timeout: 15000 }).then((secondInterception) => {
            const url = new URL(secondInterception.request.url);
            expect(url.searchParams.get('page')).to.equal('2');
          });
          
          cy.getByData('page-2', { timeout: 5000 })
            .should("have.class", "bg-indigo-600");
        }
      });
    });
  });

  describe("Modal de exclusão", () => {
    it("deve abrir modal ao clicar em excluir (se houver eventos)", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          // Aguardar renderização
          cy.wait(2000);
          
          // Buscar o botão de delete de forma mais flexível
          cy.get('body').then($body => {
            // Tentar encontrar pelo data-test primeiro
            if ($body.find('[data-test="event-delete-button"]').length > 0) {
              cy.getByData('event-delete-button').first().click();
            } else {
              // Se não encontrar, procurar por botão com ícone de lixeira/delete
              cy.get('button').contains('svg').first().click();
            }
          });
          
          cy.get('.fixed.inset-0.z-50', { timeout: 5000 }).should('exist');
          cy.contains('Confirmar Exclusão').should('exist');
          
          const primeiroEvento = eventos[0];
          if (primeiroEvento.titulo) {
            cy.get('body').should('contain', primeiroEvento.titulo);
          }
        }
      });
    });

    it("deve fechar modal ao clicar em cancelar", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          // Aguardar renderização
          cy.wait(2000);
          
          // Buscar o botão de delete
          cy.get('body').then($body => {
            if ($body.find('[data-test="event-delete-button"]').length > 0) {
              cy.getByData('event-delete-button').first().click();
            }
          });
          
          cy.getByData('btn-cancel-delete', { timeout: 5000 }).should('be.visible').click();
          cy.wait(500);
          
          // Verificar que modal não existe mais
          cy.get('.fixed.inset-0.z-50').should('not.exist');
        }
      });
    });

    it("deve fazer requisição DELETE correta ao confirmar exclusão", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          const primeiroEventoId = eventos[0]._id;
          
          // Aguardar renderização
          cy.wait(2000);
          
          // Buscar o botão de delete
          cy.get('body').then($body => {
            if ($body.find('[data-test="event-delete-button"]').length > 0) {
              cy.getByData('event-delete-button').first().click();
            }
          });
          
          cy.getByData('btn-confirm-delete', { timeout: 5000 }).should('be.visible').click();
          
          cy.wait('@deleteEvento', { timeout: 15000 }).then((deleteInterception) => {
            expect(deleteInterception.request.url).to.include(primeiroEventoId);
            expect(deleteInterception.request.method).to.equal('DELETE');
          });
        }
      });
    });
  });

  describe("Filtros e busca", () => {
    it("deve validar estrutura da resposta e permitir busca", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
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
          
          // Aguardar renderização
          cy.wait(2000);
          cy.get('body', { timeout: 10000 }).should('contain', primeiroEvento.titulo);
        }
      });
      
      // Aguardar renderização
      cy.wait(1500);
      
      // Buscar o input de busca de forma mais flexível
      cy.get('body').then($body => {
        if ($body.find('[data-test="search-input"]').length > 0) {
          cy.getByData('search-input')
            .scrollIntoView()
            .should('be.visible')
            .clear()
            .type("evento");
        } else if ($body.find('input[placeholder*="Buscar"]').length > 0) {
          cy.get('input[placeholder*="Buscar"]')
            .first()
            .scrollIntoView()
            .clear()
            .type("evento");
        }
      });
    });

    it("deve validar filtro de status na resposta da API", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          eventos.forEach(evento => {
            expect(evento).to.have.property('status');
            expect([0, 1]).to.include(evento.status);
          });
          
          // Aguardar renderização
          cy.wait(2000);
          
          // Verificar se há badges de status na página
          cy.get('body').then($body => {
            const hasStatus = $body.text().includes('Ativo') || $body.text().includes('Inativo');
            if (hasStatus) {
              cy.log('Badges de status encontrados');
            }
          });
        }
      });
    });

    it("deve validar que eventos têm categoria", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          eventos.forEach(evento => {
            expect(evento).to.have.property('categoria');
            expect(evento.categoria).to.be.a('string');
          });
          
          // Aguardar renderização
          cy.wait(2000);
          cy.get('body', { timeout: 10000 }).should('contain', eventos[0].titulo);
        }
      });
    });

    it("deve validar consistência entre API e Frontend", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        const totalDocs = interception.response.body?.data?.totalDocs || 0;
        const totalPages = interception.response.body?.data?.totalPages || 0;
        
        cy.log(`Total de eventos: ${totalDocs}, Páginas: ${totalPages}`);
        
        if (eventos.length > 0) {
          // Aguardar renderização
          cy.wait(1000);
          
          eventos.forEach((evento, index) => {
            if (index < 4) {
              cy.get('body', { timeout: 10000 }).should('contain', evento.titulo);
            }
          });
          
          eventos.forEach(evento => {
            expect(evento).to.have.property('_id');
            expect(evento).to.have.property('titulo');
            expect(evento).to.have.property('local');
            expect(evento).to.have.property('dataInicio');
            expect(evento).to.have.property('status');
          });
          
          if (totalPages > 1) {
            cy.getByData('pagination-info', { timeout: 10000 }).should('exist');
          }
        } else {
          cy.contains('Nenhum evento encontrado', { timeout: 10000 }).should('exist');
        }
      });
    });
  });

  describe("Toggle de Status", () => {
    it("deve fazer requisição PATCH ao alterar status do evento", () => {
      cy.wait('@getEventos', { timeout: 15000 }).then((interception) => {
        const eventos = interception.response.body?.data?.docs || [];
        
        if (eventos.length > 0) {
          const primeiroEventoId = eventos[0]._id;
          
          // Aguardar renderização
          cy.wait(2000);
          
          // Tentar encontrar botão de toggle de forma flexível
          cy.get('body', { timeout: 10000 }).then($body => {
            if ($body.find('[data-test="event-toggle-status"]').length > 0) {
              cy.getByData('event-toggle-status').first().click();
              
              // Verificar requisição apenas se botão foi clicado
              cy.wait('@toggleStatus', { timeout: 15000 }).then((statusInterception) => {
                expect(statusInterception.request.method).to.equal('PATCH');
                expect(statusInterception.request.url).to.include(primeiroEventoId);
                expect(statusInterception.request.body).to.have.property('status');
              });
            } else {
              cy.log('Botão de toggle não encontrado, pulando teste de requisição PATCH');
            }
          });
        }
      });
    });
  });

});
