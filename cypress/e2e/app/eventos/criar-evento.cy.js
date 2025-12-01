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
    cy.intercept('GET', '**/eventos/**').as('getEvento');

    cy.login('admin@admin.com', 'SenhaSuperSegur@123');
    
    const baseUrl = Cypress.env('NEXTAUTH_URL');
    cy.visit(`${baseUrl}/criar_eventos`);
    
    // Aguardar o carregamento da página
    cy.url({ timeout: 30000 }).should('include', '/criar_eventos');
    
    // Aguardar que elementos básicos apareçam
    cy.get('body', { timeout: 30000 }).should('be.visible');
    
    // Aguardar o título principal aparecer
    cy.contains('Criar Novo Evento', { timeout: 30000 }).should('be.visible');
    
    // Aguardar o formulário aparecer
    cy.get('form', { timeout: 30000 }).should('exist').should('be.visible');
    
    // Aguardar a seção da etapa 1
    cy.contains('Informações Básicas', { timeout: 30000 }).should('be.visible');
    
    // Finalmente aguardar o input estar disponível
    cy.get('[data-test="input-titulo"]', { timeout: 30000 })
      .should('exist')
      .should('be.visible');
  });

  describe("Etapa 1 - Informações Básicas", () => {
    it("deve renderizar todos os campos da etapa 1", () => {
      // Verificar título e descrição da seção
      cy.contains("Informações Básicas").should("be.visible");
      cy.contains("Preencha os dados principais do evento").should("be.visible");

      // Verificar campos obrigatórios
      cy.getByData('input-titulo').should("exist").should("be.visible");
      cy.getByData('input-descricao').should("exist").should("be.visible");
      cy.getByData('input-local').should("exist").should("be.visible");
      cy.getByData('select-categoria').should("exist").should("be.visible");
      cy.getByData('input-data-inicio').should("exist").should("be.visible");
      cy.getByData('input-data-fim').should("exist").should("be.visible");
      cy.getByData('input-link').should("exist").should("be.visible");

      // Verificar botões
      cy.getByData('btn-cancelar').should("exist").should("be.visible");
      cy.getByData('btn-continuar').should("exist").should("be.visible");
    });

    it("deve validar campos obrigatórios", () => {
      // Tentar continuar sem preencher
      cy.getByData('btn-continuar').should('be.visible').click();

      // Verificar mensagens de erro
      cy.contains("O título deve ter ao menos 3 caracteres").should("exist");
      cy.contains("A descrição deve ter ao menos 10 caracteres").should("exist");
      cy.contains("O local é obrigatório").should("exist");
    });

    it("deve validar tamanho mínimo dos campos", () => {
      cy.getByData('input-titulo').should('be.visible').type("ab");
      cy.getByData('input-descricao').type("desc");
      cy.getByData('btn-continuar').click();

      cy.contains("O título deve ter ao menos 3 caracteres").should("exist");
      cy.contains("A descrição deve ter ao menos 10 caracteres").should("exist");
    });

    it("deve preencher campos e avançar para etapa 2", () => {
      cy.getByData('input-titulo').clear().type(eventoData.titulo);
      cy.getByData('input-descricao').clear().type(eventoData.descricao);
      cy.getByData('input-local').clear().type(eventoData.local);
      cy.getByData('select-categoria').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(eventoData.dataFim);
      cy.getByData('input-link').type(eventoData.link);

      eventoData.tags.forEach((tag) => {
        cy.getByData('input-tag').type(`${tag}{enter}`);
      });

      cy.getByData('btn-continuar').click();

      // Verificar que avançou para etapa 2
      cy.contains("Upload de Mídia").should("exist");
      cy.contains("Adicione as imagens do evento").should("exist");
    });

    it("deve validar datas (data fim não pode ser antes da data início)", () => {
      const dataPassada = new Date();
      dataPassada.setDate(dataPassada.getDate() - 5);
      const dataPassadaStr = dataPassada.toISOString().slice(0, 16);

      cy.getByData('input-titulo').should('be.visible').type(eventoData.titulo);
      cy.getByData('input-descricao').type(eventoData.descricao);
      cy.getByData('input-local').type(eventoData.local);
      
      cy.getByData('select-categoria').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(dataPassadaStr);

      // Adicionar pelo menos uma tag
      cy.getByData('input-tag').type(`${eventoData.tags[0]}{enter}`);

      cy.getByData('btn-continuar').click();

      // Verificar mensagem de erro
      cy.contains("A data de fim não pode ser anterior à data de início").should("exist");
    });
  });

  describe("Etapa 2 - Upload de Imagens", () => {
    beforeEach(() => {
      // Preencher etapa 1 e avançar
      cy.getByData('input-titulo').clear().type(eventoData.titulo);
      cy.getByData('input-descricao').clear().type(eventoData.descricao);
      cy.getByData('input-local').clear().type(eventoData.local);
      
      cy.getByData('select-categoria').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(eventoData.dataFim);
      
      eventoData.tags.forEach((tag) => {
        cy.getByData('input-tag').type(`${tag}{enter}`);
      });
      
      cy.getByData('btn-continuar').click();
      cy.contains("Upload de Mídia").should("exist");
    });

    it("deve renderizar área de upload", () => {
      cy.contains("Upload de Mídia").should("exist");
      cy.contains("Resolução mínima").should("exist");
      cy.getByData('input-upload-imagens').should("exist");
      
      // Botões de navegação
      cy.getByData('btn-voltar').should("exist");
      cy.getByData('btn-continuar').should("exist");
    });

    it("deve fazer upload de imagens", () => {
      const fileName = 'evento-test.jpg';
      const fileContent = 'fake-image-content';
      
      cy.getByData('input-upload-imagens').selectFile({
        contents: Cypress.Buffer.from(fileContent),
        fileName: fileName,
        mimeType: 'image/jpeg',
      }, { force: true });

      cy.wait(500);
      cy.contains(fileName).should("exist");
    });

    it("deve permitir remover imagens adicionadas", () => {
      const fileName = 'evento-remove-test.jpg';
      
      cy.getByData('input-upload-imagens').selectFile({
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
      cy.getByData('btn-voltar').click();
      cy.contains("Informações Básicas").should("exist");
      cy.getByData('input-titulo').should("have.value", eventoData.titulo);
    });

    it("deve avançar para etapa 3 com imagens", () => {
      cy.getByData('input-upload-imagens').selectFile({
        contents: Cypress.Buffer.from('fake-image'),
        fileName: 'evento.jpg',
        mimeType: 'image/jpeg',
      }, { force: true });

      cy.wait(500);
      cy.getByData('btn-continuar').click();
      cy.contains("Configurações de Exibição no Totem").should("exist");
    });
  });

  describe("Etapa 3 - Configurações de Exibição", () => {
    beforeEach(() => {
      cy.getByData('input-titulo').clear().type(eventoData.titulo);
      cy.getByData('input-descricao').clear().type(eventoData.descricao);
      cy.getByData('input-local').clear().type(eventoData.local);
      cy.getByData('select-categoria').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(eventoData.dataFim);
      
      eventoData.tags.forEach((tag) => {
        cy.getByData('input-tag').type(`${tag}{enter}`);
      });
      
      cy.getByData('btn-continuar').click();

      // Preencher etapa 2
      cy.getByData('input-upload-imagens').selectFile({
        contents: Cypress.Buffer.from('fake-image'),
        fileName: 'evento.jpg',
        mimeType: 'image/jpeg',
      }, { force: true });

      cy.wait(500);
      cy.getByData('btn-continuar').click();
      cy.contains("Configurações de Exibição no Totem").should("exist");
    });

    it("deve renderizar campos de configuração", () => {
      cy.contains("Configurações de Exibição no Totem").should("exist");
      cy.contains("Defina quando e como o evento será apresentado").should("exist");

      cy.contains("Dias da Semana").should("exist");
      cy.contains("Período do Dia").should("exist");
      cy.getByData('input-exib-inicio').should("exist");
      cy.getByData('input-exib-fim').should("exist");

      cy.getByData('btn-voltar').should("exist");
      cy.getByData('btn-preview').should("exist");
      cy.getByData('btn-finalizar').should("exist");
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
      cy.getByData('select-cor').click();
      cy.contains("Rosa").click();
    });

    it("deve selecionar animação", () => {
      cy.getByData('select-animacao').click();
      cy.contains("Fade In").click();
    });

    it("deve validar campos obrigatórios da etapa 3", () => {
      cy.getByData('btn-finalizar').click();
      
      cy.contains("Selecione pelo menos um dia da semana").should("exist");
      cy.contains("Selecione pelo menos um período de exibição").should("exist");
    });

    it("deve voltar para etapa 2 ao clicar em voltar", () => {
      cy.getByData('btn-voltar').click();
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

      cy.getByData('input-titulo').clear().type(eventoData.titulo);
      cy.getByData('input-descricao').clear().type(eventoData.descricao);
      cy.getByData('input-local').clear().type(eventoData.local);
      
      cy.getByData('select-categoria').click();
      cy.get(`[data-radix-select-item][value="${eventoData.categoria}"]`).click();
      
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(eventoData.dataFim);
      cy.getByData('input-link').type(eventoData.link);
      
      eventoData.tags.forEach((tag) => {
        cy.getByData('input-tag').type(`${tag}{enter}`);
      });
      
      cy.getByData('btn-continuar').click();

      // ETAPA 2
      cy.contains("Upload de Mídia").should("exist");
      
      cy.getByData('input-upload-imagens').selectFile({
        contents: Cypress.Buffer.from('fake-image-1'),
        fileName: 'evento1.jpg',
        mimeType: 'image/jpeg',
      }, { force: true });

      cy.wait(500);
      cy.getByData('btn-continuar').click();

      // ETAPA 3
      cy.contains("Configurações de Exibição no Totem").should("exist");
      
      cy.contains("Segunda-feira").click();
      cy.contains("Terça-feira").click();
      cy.get('input[name="exibManha"]').check({ force: true });
      cy.get('input[name="exibTarde"]').check({ force: true });
      cy.getByData('input-exib-inicio').type(eventoData.exibInicio);
      cy.getByData('input-exib-fim').type(eventoData.exibFim);
      cy.getByData('select-cor').click();
      cy.get(`[data-radix-select-item][value="${eventoData.cor}"]`).click();
      cy.getByData('select-animacao').click();
      cy.get(`[data-radix-select-item][value="${eventoData.animacao}"]`).click();
      
      cy.getByData('btn-finalizar').click();

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
      cy.getByData('btn-cancelar').should('be.visible').click();
      cy.contains("Cancelar criação do evento?").should("exist");
      cy.contains("Os dados preenchidos serão perdidos").should("exist");
    });

    it("deve fechar modal ao clicar em voltar", () => {
      cy.getByData('btn-cancelar').should('be.visible').click();
      cy.contains("Cancelar criação do evento?").should("exist");
      
      cy.getByData('modal-btn-voltar').click();
      cy.contains("Cancelar criação do evento?").should("not.exist");
    });

    it("deve redirecionar ao confirmar cancelamento", () => {
      cy.getByData('input-titulo').should('be.visible').type(eventoData.titulo);
      cy.getByData('btn-cancelar').click();
      cy.getByData('modal-btn-confirmar-cancelar').click();
      
      cy.url({ timeout: 10000 }).should("include", "/meus_eventos");
    });
  });
});

it('create an event', function() {
  cy.visit('https://api-ifroevents.app.fslab.dev/login')
  
});

it('create an event', function() {
  cy.visit('https://ifroevents.app.fslab.dev/login')
  cy.get('[data-test="input-email"]').click();
  cy.get('[data-test="input-email"]').type('admin@admin.com');
  cy.get('[data-test="input-senha"]').click();
  cy.get('[data-test="input-senha"]').click();
  cy.get('[data-test="input-senha"]').type('SenhaSuperSegur@a123');
  cy.get('[data-test="input-senha"]').click();
  cy.get('[data-test="input-senha"]').clear();
  cy.get('[data-test="input-senha"]').type('SenhaSuperSegur@123');
  cy.get('[data-test="btn-entrar"]').click();
  cy.get('[data-test="btn-criar-evento"]').click();
  cy.get('[name="titulo"]').click();
  cy.get('[name="titulo"]').type('EVENTO TESTE');
  cy.get('[name="descricao"]').click();
  cy.get('[name="descricao"]').type('EVENTO DE TESTE AUTOMATIZADO');
  cy.get('html').click();
  cy.get('[name="local"]').click();
  cy.get('[name="local"]').type('IFRO VILHENA');
  cy.get('[name="dataInicio"]').click();
  cy.get('[name="dataFim"]').click();
  cy.get('[name="link"]').click();
  cy.get('[name="link"]').type('https:/google.com');
  cy.get('input.flex-1').click();
  cy.get('input.flex-1').type('cypress{enter}');
  cy.get('button.px-8').click();
  cy.get('span.text-white').click();
  cy.get('#fileUpload').click();
  cy.get('button.px-8').click();
  cy.get('div:nth-child(2) div.space-y-3 label.gap-3').click();
  cy.get('div:nth-child(2) div.space-y-3 label.gap-3 input.rounded').check();
  cy.get('div:nth-child(3) span.font-medium').click();
  cy.get('[name="exibInicio"]').click();
  cy.get('[name="exibInicio"]').click();
  cy.get('[name="exibFim"]').click();
  cy.get('[name="exibFim"]').click();
  cy.get('[name="exibFim"]').click();
  cy.get('html').click();
  cy.get('html').click();
  cy.get('button.px-8').click();
  cy.get('button.border-none').click();
  cy.get('button.border-none').click();
  cy.get('[name="link"]').click();
  cy.get('[name="link"]').clear();
  cy.get('[name="link"]').type('https://google.com');
  cy.get('button.px-8').click();
  cy.get('button.px-8').click();
  cy.get('button.px-8').click();
  
});