/// <reference types="cypress" />
import { faker } from '@faker-js/faker/locale/pt_BR';

Cypress.on("uncaught:exception", () => {
  return false;
});

describe("Criar Evento", () => {
  let eventoData;

  beforeEach(() => {
    //dados fake para o evento antes de cada teste
    const dataInicio = faker.date.future();
    const dataFim = new Date(dataInicio);
    dataFim.setHours(dataInicio.getHours() + 3); 
    
    eventoData = {
      titulo: faker.music.songName() + ' ' + faker.date.future().getFullYear(),
      descricao: faker.lorem.paragraph(3),
      local: faker.location.streetAddress(),
      categoria: faker.helpers.arrayElement(['palestra', 'workshop', 'seminario', 'curso', 'esportes', 'outros']),
      dataInicio: dataInicio.toISOString().slice(0, 16), // formato datetime-local
      dataFim: dataFim.toISOString().slice(0, 16), // formato datetime-local
      link: faker.internet.url(),
      tags: [faker.word.noun(), faker.word.adjective(), faker.word.verb()],
      exibDias: faker.helpers.arrayElements(['segunda', 'terca', 'quarta', 'quinta', 'sexta'], { min: 2, max: 5 }),
      exibInicio: faker.date.soon().toISOString().split('T')[0],
      exibFim: faker.date.future().toISOString().split('T')[0],
      cor: faker.helpers.arrayElement(['1', '2', '3', '4', '5', '6', '7', '8', '9']),
      animacao: faker.helpers.arrayElement(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
    };

    // Interceptar chamadas da API
    cy.intercept('POST', '**/eventos').as('createEvento');
    cy.intercept('GET', '**/api/auth/session*').as('getSession');

    cy.login('admin@admin.com', 'SenhaSuperSegur@123');
    
    const baseUrl = Cypress.env('NEXTAUTH_URL');
    cy.visit(`${baseUrl}/criar_eventos`);
    
    // Aguardar que a página carregue completamente
    cy.wait(1000);
    
    // Verificar se o título principal está visível
    cy.contains('Criar Novo Evento', { timeout: 10000 }).should('be.visible');
    
    // Aguardar o form aparecer
    cy.get('form', { timeout: 10000 }).should('be.visible');
    
    // Verificar se estamos na etapa 1
    cy.contains('Informações Básicas', { timeout: 5000 }).should('be.visible');
  });

  describe("Etapa 1 - Informações Básicas", () => {
    it("deve renderizar todos os campos da etapa 1", () => {
      // Screenshot para debug
      cy.screenshot('pagina-criar-evento-inicio');
      
      // Verificar título e descrição da seção
      cy.contains("Informações Básicas").should("be.visible");
      cy.contains("Preencha os dados principais do evento").should("be.visible");

      // Aguardar um pouco mais para garantir que o form renderizou
      cy.wait(500);

      // Verificar campos obrigatórios com timeouts maiores
      cy.get('[data-test="input-titulo"]', { timeout: 15000 })
        .should("exist")
        .should("be.visible");
      
      cy.get('[data-test="input-descricao"]', { timeout: 5000 })
        .should("exist")
        .should("be.visible");
      
      cy.get('[data-test="input-local"]', { timeout: 5000 })
        .should("exist")
        .should("be.visible");
      
      cy.get('[data-test="select-categoria"]', { timeout: 5000 })
        .should("exist")
        .should("be.visible");
      
      cy.get('[data-test="input-data-inicio"]', { timeout: 5000 })
        .should("exist")
        .should("be.visible");
      
      cy.get('[data-test="input-data-fim"]', { timeout: 5000 })
        .should("exist")
        .should("be.visible");
      
      cy.get('[data-test="input-link"]', { timeout: 5000 })
        .should("exist")
        .should("be.visible");

      // Verificar botões
      cy.get('[data-test="btn-cancelar"]', { timeout: 5000 })
        .should("exist")
        .should("be.visible");
      
      cy.get('[data-test="btn-continuar"]', { timeout: 5000 })
        .should("exist")
        .should("be.visible");
    });

    it("deve validar campos obrigatórios", () => {
      // Aguardar elemento aparecer
      cy.get('[data-test="btn-continuar"]', { timeout: 10000 }).should('be.visible');
      
      // Tentar continuar sem preencher
      cy.get('[data-test="btn-continuar"]').click();

      // Verificar mensagens de erro
      cy.contains("O título deve ter ao menos 3 caracteres").should("exist");
      cy.contains("A descrição deve ter ao menos 10 caracteres").should("exist");
      cy.contains("O local é obrigatório").should("exist");
    });

    it("deve validar tamanho mínimo dos campos", () => {
      cy.get('[data-test="input-titulo"]', { timeout: 10000 }).should('be.visible').type("ab");
      cy.get('[data-test="input-descricao"]').type("desc");
      cy.get('[data-test="btn-continuar"]').click();

      cy.contains("O título deve ter ao menos 3 caracteres").should("exist");
      cy.contains("A descrição deve ter ao menos 10 caracteres").should("exist");
    });

    it("deve preencher campos e avançar para etapa 2", () => {
      cy.get('[data-test="input-titulo"]').clear().type(eventoData.titulo);
      cy.get('[data-test="input-descricao"]').clear().type(eventoData.descricao);
      cy.get('[data-test="input-local"]').clear().type(eventoData.local);
      cy.get('[data-test="select-categoria"]').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      cy.get('[data-test="input-data-inicio"]').type(eventoData.dataInicio);
      cy.get('[data-test="input-data-fim"]').type(eventoData.dataFim);
      cy.get('[data-test="input-link"]').type(eventoData.link);

      eventoData.tags.forEach((tag) => {
        cy.get('[data-test="input-tag"]').type(`${tag}{enter}`);
      });

      cy.get('[data-test="btn-continuar"]').click();

      // Verificar que avançou para etapa 2
      cy.contains("Upload de Mídia").should("exist");
      cy.contains("Adicione as imagens do evento").should("exist");
    });

    it("deve validar datas (data fim não pode ser antes da data início)", () => {
      const dataPassada = new Date();
      dataPassada.setDate(dataPassada.getDate() - 5);
      const dataPassadaStr = dataPassada.toISOString().slice(0, 16);

      cy.get('[data-test="input-titulo"]', { timeout: 10000 }).should('be.visible').type(eventoData.titulo);
      cy.get('[data-test="input-descricao"]').type(eventoData.descricao);
      cy.get('[data-test="input-local"]').type(eventoData.local);
      
      cy.get('[data-test="select-categoria"]').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      
      cy.get('[data-test="input-data-inicio"]').type(eventoData.dataInicio);
      cy.get('[data-test="input-data-fim"]').type(dataPassadaStr);

      // Adicionar pelo menos uma tag
      cy.get('[data-test="input-tag"]').type(`${eventoData.tags[0]}{enter}`);

      cy.get('[data-test="btn-continuar"]').click();

      // Verificar mensagem de erro
      cy.contains("A data de fim não pode ser anterior à data de início").should("exist");
    });
  });

  describe("Etapa 2 - Upload de Imagens", () => {
    beforeEach(() => {
      // Aguardar página carregar
      cy.get('[data-test="input-titulo"]', { timeout: 10000 }).should('be.visible');
      
      // Preencher etapa 1 e avançar
      cy.get('[data-test="input-titulo"]').clear().type(eventoData.titulo);
      cy.get('[data-test="input-descricao"]').clear().type(eventoData.descricao);
      cy.get('[data-test="input-local"]').clear().type(eventoData.local);
      
      cy.get('[data-test="select-categoria"]').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      
      cy.get('[data-test="input-data-inicio"]').type(eventoData.dataInicio);
      cy.get('[data-test="input-data-fim"]').type(eventoData.dataFim);
      
      eventoData.tags.forEach((tag) => {
        cy.get('[data-test="input-tag"]').type(`${tag}{enter}`);
      });
      
      cy.get('[data-test="btn-continuar"]').click();
      cy.contains("Upload de Mídia").should("exist");
    });

    it("deve renderizar área de upload", () => {
      cy.contains("Upload de Mídia").should("exist");
      cy.contains("Resolução mínima").should("exist");
      cy.get('[data-test="input-upload-imagens"]').should("exist");
      
      // Botões de navegação
      cy.get('[data-test="btn-voltar"]').should("exist");
      cy.get('[data-test="btn-continuar"]').should("exist");
    });

    it("deve fazer upload de imagens", () => {
      const fileName = 'evento-test.jpg';
      const fileContent = 'fake-image-content';
      
      cy.get('[data-test="input-upload-imagens"]').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: fileName,
        mimeType: 'image/jpeg',
      }, { force: true });

      cy.wait(500);
      cy.contains(fileName).should("exist");
    });

    it("deve permitir remover imagens adicionadas", () => {
      const fileName = 'evento-remove-test.jpg';
      
      cy.get('[data-test="input-upload-imagens"]').selectFile({
        contents: Cypress.Buffer.from('fake-content'),
        fileName: fileName,
        mimeType: 'image/jpeg',
      }, { force: true });

      cy.wait(500);
      cy.contains(fileName).should("exist");

      cy.get('button[title="Remover imagem"]').first().click();
      cy.contains(fileName).should("not.exist");
    });

    it("deve voltar para etapa 1 ao clicar em voltar", () => {
      cy.get('[data-test="btn-voltar"]').click();
      cy.contains("Informações Básicas").should("exist");
      cy.get('[data-test="input-titulo"]').should("have.value", eventoData.titulo);
    });

    it("deve avançar para etapa 3 com imagens", () => {
      cy.get('[data-test="input-upload-imagens"]').selectFile({
        contents: Cypress.Buffer.from('fake-image'),
        fileName: 'evento.jpg',
        mimeType: 'image/jpeg',
      }, { force: true });

      cy.wait(500);
      cy.get('[data-test="btn-continuar"]').click();
      cy.contains("Configurações de Exibição no Totem").should("exist");
    });
  });

  describe("Etapa 3 - Configurações de Exibição", () => {
    beforeEach(() => {
      // Aguardar página carregar
      cy.get('[data-test="input-titulo"]', { timeout: 10000 }).should('be.visible');
      
      cy.get('[data-test="input-titulo"]').clear().type(eventoData.titulo);
      cy.get('[data-test="input-descricao"]').clear().type(eventoData.descricao);
      cy.get('[data-test="input-local"]').clear().type(eventoData.local);
      cy.get('[data-test="select-categoria"]').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      cy.get('[data-test="input-data-inicio"]').type(eventoData.dataInicio);
      cy.get('[data-test="input-data-fim"]').type(eventoData.dataFim);
      
      eventoData.tags.forEach((tag) => {
        cy.get('[data-test="input-tag"]').type(`${tag}{enter}`);
      });
      
      cy.get('[data-test="btn-continuar"]').click();

      // Preencher etapa 2
      cy.get('[data-test="input-upload-imagens"]').selectFile({
        contents: Cypress.Buffer.from('fake-image'),
        fileName: 'evento.jpg',
        mimeType: 'image/jpeg',
      }, { force: true });

      cy.wait(500);
      cy.get('[data-test="btn-continuar"]').click();
      cy.contains("Configurações de Exibição no Totem").should("exist");
    });

    it("deve renderizar campos de configuração", () => {
      cy.contains("Configurações de Exibição no Totem").should("exist");
      cy.contains("Defina quando e como o evento será apresentado").should("exist");

      cy.contains("Dias da Semana").should("exist");
      cy.contains("Período do Dia").should("exist");
      cy.get('[data-test="input-exib-inicio"]').should("exist");
      cy.get('[data-test="input-exib-fim"]').should("exist");

      cy.get('[data-test="btn-voltar"]').should("exist");
      cy.get('[data-test="btn-preview"]').should("exist");
      cy.get('[data-test="btn-finalizar"]').should("exist");
    });

    it("deve selecionar dias da semana", () => {
      cy.contains("Segunda-feira").click();
      cy.contains("Quarta-feira").click();
      cy.contains("Sexta-feira").click();

      cy.contains("Segunda-feira").parent().find('input[type="checkbox"]').should("be.checked");
      cy.contains("Quarta-feira").parent().find('input[type="checkbox"]').should("be.checked");
    });

    it("deve selecionar períodos do dia", () => {
      cy.get('input[name="exibManha"]').check({ force: true });
      cy.get('input[name="exibTarde"]').check({ force: true });
      
      cy.get('input[name="exibManha"]').should("be.checked");
      cy.get('input[name="exibTarde"]').should("be.checked");
    });

    it("deve selecionar cor do card", () => {
      cy.get('[data-test="select-cor"]').click();
      cy.contains("Rosa").click();
    });

    it("deve selecionar animação", () => {
      cy.get('[data-test="select-animacao"]').click();
      cy.contains("Fade In").click();
    });

    it("deve validar campos obrigatórios da etapa 3", () => {
      cy.get('[data-test="btn-finalizar"]').click();
      
      cy.contains("Selecione pelo menos um dia da semana").should("exist");
      cy.contains("Selecione pelo menos um período de exibição").should("exist");
    });

    it("deve voltar para etapa 2 ao clicar em voltar", () => {
      cy.get('[data-test="btn-voltar"]').click();
      cy.contains("Upload de Mídia").should("exist");
    });
  });

  describe("Fluxo Completo", () => {
    it("deve criar evento completo com sucesso", () => {
      cy.intercept('POST', '**/eventos', {
        statusCode: 201,
        body: {
          data: {
            _id: faker.string.uuid(),
            titulo: eventoData.titulo,
            status: 1
          }
        }
      }).as('createEvento');

      // Aguardar página carregar
      cy.get('[data-test="input-titulo"]', { timeout: 10000 }).should('be.visible');

      cy.get('[data-test="input-titulo"]').clear().type(eventoData.titulo);
      cy.get('[data-test="input-descricao"]').clear().type(eventoData.descricao);
      cy.get('[data-test="input-local"]').clear().type(eventoData.local);
      
      cy.get('[data-test="select-categoria"]').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      
      cy.get('[data-test="input-data-inicio"]').type(eventoData.dataInicio);
      cy.get('[data-test="input-data-fim"]').type(eventoData.dataFim);
      cy.get('[data-test="input-link"]').type(eventoData.link);
      
      eventoData.tags.forEach((tag) => {
        cy.get('[data-test="input-tag"]').type(`${tag}{enter}`);
      });
      
      cy.get('[data-test="btn-continuar"]').click();

      // ETAPA 2
      cy.contains("Upload de Mídia").should("exist");
      
      cy.get('[data-test="input-upload-imagens"]').selectFile({
        contents: Cypress.Buffer.from('fake-image-1'),
        fileName: 'evento1.jpg',
        mimeType: 'image/jpeg',
      }, { force: true });

      cy.wait(500);
      cy.get('[data-test="btn-continuar"]').click();

      // ETAPA 3
      cy.contains("Configurações de Exibição no Totem").should("exist");
      
      cy.contains("Segunda-feira").click();
      cy.contains("Terça-feira").click();
      cy.get('input[name="exibManha"]').check({ force: true });
      cy.get('input[name="exibTarde"]').check({ force: true });
      cy.get('[data-test="input-exib-inicio"]').type(eventoData.exibInicio);
      cy.get('[data-test="input-exib-fim"]').type(eventoData.exibFim);
      cy.get('[data-test="select-cor"]').click();
      cy.get(`[data-radix-select-item][value="${eventoData.cor}"]`).click();
      cy.get('[data-test="select-animacao"]').click();
      cy.get(`[data-radix-select-item][value="${eventoData.animacao}"]`).click();
      
      cy.get('[data-test="btn-finalizar"]').click();

      // Aguardar requisição
      cy.wait('@createEvento').then((interception) => {
        expect(interception.request.method).to.equal('POST');
        expect(interception.response.statusCode).to.equal(201);
      });

      cy.url({ timeout: 10000 }).should("include", "/meus_eventos");
    });
  });

  describe("Modal de Cancelamento", () => {
    it("deve abrir modal ao clicar em cancelar", () => {
      cy.get('[data-test="btn-cancelar"]', { timeout: 10000 }).should('be.visible').click();
      cy.contains("Cancelar criação do evento?").should("exist");
      cy.contains("Os dados preenchidos serão perdidos").should("exist");
    });

    it("deve fechar modal ao clicar em voltar", () => {
      cy.get('[data-test="btn-cancelar"]', { timeout: 10000 }).should('be.visible').click();
      cy.contains("Cancelar criação do evento?").should("exist");
      
      cy.get('[data-test="modal-btn-voltar"]').click();
      cy.contains("Cancelar criação do evento?").should("not.exist");
    });

    it("deve redirecionar ao confirmar cancelamento", () => {
      cy.get('[data-test="input-titulo"]', { timeout: 10000 }).should('be.visible').type(eventoData.titulo);
      cy.get('[data-test="btn-cancelar"]').click();
      cy.get('[data-test="modal-btn-confirmar-cancelar"]').click();
      
      cy.url({ timeout: 10000 }).should("include", "/meus_eventos");
    });
  });
});