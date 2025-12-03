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
      categoria: faker.helpers.arrayElement(['empreendedorismoInovacao', 'artisticoCultural', 'cientificoTecnologico', 'desportivos', 'palestra', 'workshops', 'atividadesSociais', 'gestaoPessoas', 'outro']),
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

    it("deve validar campos obrigatórios e exibir toast", () => {
      // Tentar continuar sem preencher
      cy.getByData('btn-continuar').should('be.visible').click();

      // Verificar estrutura completa do toast de erro
      cy.get('.Toastify__toast.Toastify__toast-theme--light.Toastify__toast--error', { timeout: 5000 })
        .should('be.visible')
        .should('have.attr', 'role', 'alert');
      
      // Verificar ícone de erro
      cy.get('.Toastify__toast--error .Toastify__toast-icon').should('exist');
      
      // Verificar mensagem do toast
      cy.get('.Toastify__toast--error').should('contain', 'Complete todos os campos obrigatórios da Etapa 1');
      
      // Verificar botão de fechar
      cy.get('.Toastify__toast--error .Toastify__close-button').should('exist');
      
      // Verificar barra de progresso
      cy.get('.Toastify__toast--error .Toastify__progress-bar').should('exist');
    });

    it("deve validar tamanho mínimo dos campos", () => {
      cy.getByData('input-titulo').should('be.visible').type("ab");
      cy.getByData('input-descricao').type("desc");
      cy.getByData('btn-continuar').click();

      // Verificar toast
      cy.get('.Toastify__toast--error', { timeout: 5000 }).should('be.visible');
      
      // Verificar mensagens inline
      cy.contains("O título deve ter ao menos 3 caracteres").should("exist");
      cy.contains("A descrição deve ter ao menos 10 caracteres").should("exist");
    });

    it("deve preencher campos e avançar para etapa 2", () => {
      cy.getByData('input-titulo').clear().type(eventoData.titulo);
      cy.getByData('input-descricao').clear().type(eventoData.descricao);
      cy.getByData('input-local').clear().type(eventoData.local);
      
      // Selecionar categoria com wait para o dropdown
      cy.getByData('select-categoria').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').last().click();
      
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(eventoData.dataFim);
      cy.getByData('input-link').type(eventoData.link);

      eventoData.tags.forEach((tag) => {
        cy.getByData('input-tag').type(`${tag}{enter}`);
      });

      cy.getByData('btn-continuar').click();

      // Verificar que avançou para etapa 2
      cy.contains("Imagens do Evento", { timeout: 5000 }).should("exist");
      cy.contains("Resolução mínima").should("exist");
    });

    it("deve validar datas (data fim não pode ser antes da data início)", () => {
      const dataPassada = new Date();
      dataPassada.setDate(dataPassada.getDate() - 5);
      const dataPassadaStr = dataPassada.toISOString().slice(0, 16);

      cy.getByData('input-titulo').should('be.visible').type(eventoData.titulo);
      cy.getByData('input-descricao').type(eventoData.descricao);
      cy.getByData('input-local').type(eventoData.local);
      
      cy.getByData('select-categoria').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').last().click();
      
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(dataPassadaStr);

      // Adicionar pelo menos uma tag
      cy.getByData('input-tag').type(`${eventoData.tags[0]}{enter}`);

      cy.getByData('btn-continuar').click();

      // Verificar mensagem de erro inline
      cy.contains("A data de fim não pode ser anterior à data de início", { timeout: 5000 }).should("exist");
    });
  });

  describe("Etapa 2 - Upload de Imagens", () => {
    beforeEach(() => {
      // Preencher etapa 1 e avançar
      cy.getByData('input-titulo').clear().type(eventoData.titulo);
      cy.getByData('input-descricao').clear().type(eventoData.descricao);
      cy.getByData('input-local').clear().type(eventoData.local);
      
      cy.getByData('select-categoria').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').last().click();
      
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(eventoData.dataFim);
      
      eventoData.tags.forEach((tag) => {
        cy.getByData('input-tag').type(`${tag}{enter}`);
      });
      
      cy.getByData('btn-continuar').click();
      cy.contains("Imagens do Evento", { timeout: 5000 }).should("exist");
    });

    it("deve renderizar área de upload", () => {
      cy.contains("Imagens do Evento").should("exist");
      cy.contains("Resolução mínima").should("exist");
      cy.getByData('area-upload-imagens').should("exist");
      cy.getByData('input-upload-imagens').should("exist");
      cy.contains("Arraste e solte suas imagens").should("exist");
      cy.contains("Selecionar Arquivos").should("exist");
      
      // Botões de navegação
      cy.getByData('btn-voltar').should("exist");
      cy.getByData('btn-continuar').should("exist");
    });

    it("deve validar que pelo menos 1 imagem é necessária", () => {
      // Tentar continuar sem imagens
      cy.getByData('btn-continuar').click();
      
      // Verificar toast de erro
      cy.get('.Toastify__toast--error', { timeout: 5000 }).should('be.visible');
      cy.contains("Adicione pelo menos 1 imagem antes de continuar").should("be.visible");
    });

    it("deve fazer upload de imagem válida", () => {
      cy.getByData('input-upload-imagens').selectFile('public/image-teste.png', { force: true });

      cy.wait(1000);
      
      // Verificar se a imagem foi adicionada com sucesso
      cy.get('img[alt="image-teste.png"]').should('exist');
      cy.contains('Novas Imagens').should('be.visible');
    });

    it("deve permitir remover imagens adicionadas", () => {
      cy.getByData('input-upload-imagens').selectFile('public/image-teste.png', { force: true });

      cy.wait(1000);
      
      // Verificar que a imagem foi adicionada
      cy.get('img[alt="image-teste.png"]').should('exist');

      // Clicar no botão de remover (force:true pois só aparece no hover)
      cy.get('button[title="Remover imagem"]').first().click({ force: true });
      
      // Verificar que a imagem foi removida
      cy.wait(500);
      cy.get('img[alt="image-teste.png"]').should('not.exist');
    });

    it("deve voltar para etapa 1 ao clicar em voltar", () => {
      cy.getByData('btn-voltar').click();
      cy.contains("Informações Básicas", { timeout: 5000 }).should("exist");
      cy.getByData('input-titulo').should("have.value", eventoData.titulo);
    });

    it("deve avançar para etapa 3 com imagens", () => {
      cy.getByData('input-upload-imagens').selectFile('public/image-teste.png', { force: true });

      cy.wait(1000);
      cy.getByData('btn-continuar').click();
      cy.contains("Configurações", { timeout: 5000 }).should("exist");
    });
  });

  describe("Etapa 3 - Configurações de Exibição", () => {
    beforeEach(() => {
      // Preencher etapa 1
      cy.getByData('input-titulo').clear().type(eventoData.titulo);
      cy.getByData('input-descricao').clear().type(eventoData.descricao);
      cy.getByData('input-local').clear().type(eventoData.local);
      cy.getByData('select-categoria').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').last().click();
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(eventoData.dataFim);
      
      eventoData.tags.forEach((tag) => {
        cy.getByData('input-tag').type(`${tag}{enter}`);
      });
      
      cy.getByData('btn-continuar').click();

      // Preencher etapa 2
      cy.contains("Imagens do Evento", { timeout: 5000 }).should("exist");
      cy.getByData('input-upload-imagens').selectFile('public/image-teste.png', { force: true });
      
      cy.wait(1000);
      cy.getByData('btn-continuar').click();
      cy.contains("Configurações de Exibição", { timeout: 5000 }).should("exist");
    });

    it("deve renderizar campos de configuração", () => {
      cy.contains("Configurações de Exibição").should("exist");
      
      // Verificar dias da semana
      cy.contains("Segunda-feira").should("exist");
      cy.contains("Terça-feira").should("exist");
      cy.contains("Quarta-feira").should("exist");
      cy.contains("Quinta-feira").should("exist");
      cy.contains("Sexta-feira").should("exist");
      
      // Verificar períodos
      cy.contains("Manhã").should("exist");
      cy.contains("Tarde").should("exist");
      cy.contains("Noite").should("exist");
      
      // Verificar campos de data
      cy.getByData('input-exib-inicio').should("exist");
      cy.getByData('input-exib-fim').should("exist");
      
      // Verificar selects
      cy.getByData('select-cor').should("exist");
      cy.getByData('select-animacao').should("exist");
      
      // Verificar botões
      cy.getByData('btn-voltar').should("exist");
      cy.getByData('btn-preview').should("exist");
      cy.getByData('btn-finalizar').should("exist");
    });

    it("deve selecionar todos os dias da semana", () => {
      // Marcar "Todos os dias" - primeiro checkbox
      cy.contains('Todos os dias').parent().find('input[type="checkbox"]').check({ force: true });
      
      // Verificar que foi marcado
      cy.contains('Todos os dias').parent().find('input[type="checkbox"]').should('be.checked');
    });

    it("deve selecionar todos os períodos do dia", () => {
      // Marcar todos os períodos - Manhã, Tarde, Noite
      cy.contains('Manhã').parent().find('input[type="checkbox"]').check({ force: true });
      cy.contains('Tarde').parent().find('input[type="checkbox"]').check({ force: true });
      cy.contains('Noite').parent().find('input[type="checkbox"]').check({ force: true });
      
      // Verificar que foram marcados
      cy.contains('Manhã').parent().find('input[type="checkbox"]').should('be.checked');
      cy.contains('Tarde').parent().find('input[type="checkbox"]').should('be.checked');
      cy.contains('Noite').parent().find('input[type="checkbox"]').should('be.checked');
    });

    it("deve selecionar cor do card", () => {
      cy.getByData('select-cor').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').first().click();
    });

    it("deve selecionar animação", () => {
      cy.getByData('select-animacao').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').first().click();
    });

    it("deve validar campos obrigatórios da etapa 3", () => {
      // Tentar finalizar sem preencher
      cy.getByData('btn-finalizar').click();
      
      // Verificar toast de erro
      cy.get('.Toastify__toast--error', { timeout: 5000 }).should('be.visible');
      cy.contains("Complete todos os campos obrigatórios").should("be.visible");
    });

    it("deve voltar para etapa 2 ao clicar em voltar", () => {
      cy.getByData('btn-voltar').click();
      cy.contains("Imagens do Evento", { timeout: 5000 }).should("exist");
    });
  });

  describe("Fluxo Completo", () => {
    it("deve criar evento completo com sucesso", () => {
      // ETAPA 1
      cy.getByData('input-titulo').clear().type(eventoData.titulo);
      cy.getByData('input-descricao').clear().type(eventoData.descricao);
      cy.getByData('input-local').clear().type(eventoData.local);
      
      cy.getByData('select-categoria').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').last().click();
      
      cy.getByData('input-data-inicio').type(eventoData.dataInicio);
      cy.getByData('input-data-fim').type(eventoData.dataFim);
      cy.getByData('input-link').type(eventoData.link);
      
      eventoData.tags.forEach((tag) => {
        cy.getByData('input-tag').type(`${tag}{enter}`);
      });
      
      cy.getByData('btn-continuar').click();

      // ETAPA 2
      cy.contains("Imagens do Evento", { timeout: 5000 }).should("exist");
      cy.getByData('input-upload-imagens').selectFile('public/image-teste.png', { force: true });
      
      cy.wait(1000);
      cy.getByData('btn-continuar').click();

      // ETAPA 3
      cy.contains("Configurações de Exibição", { timeout: 5000 }).should("exist");
      
      // Marcar "Todos os dias"
      cy.contains('Todos os dias').parent().find('input[type="checkbox"]').check({ force: true });
      
      // Marcar todos os períodos
      cy.contains('Manhã').parent().find('input[type="checkbox"]').check({ force: true });
      cy.contains('Tarde').parent().find('input[type="checkbox"]').check({ force: true });
      cy.contains('Noite').parent().find('input[type="checkbox"]').check({ force: true });
      
      cy.getByData('input-exib-inicio').type(eventoData.exibInicio);
      cy.getByData('input-exib-fim').type(eventoData.exibFim);
      
      // Selecionar primeira cor
      cy.getByData('select-cor').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').first().click();
      
      // Selecionar primeira animação
      cy.getByData('select-animacao').click();
      cy.get('[role="listbox"]', { timeout: 5000 }).should('be.visible');
      cy.get('[role="option"]').first().click();
      
      cy.getByData('btn-finalizar').click();

      // Aguardar requisição
      cy.wait('@createEvento', { timeout: 15000 }).then((interception) => {
        expect(interception.request.method).to.equal('POST');
        // A API pode retornar 200 ou 201
        expect([200, 201]).to.include(interception.response.statusCode);
      });

      // Verificar toast de sucesso
      cy.get('.Toastify__toast--success', { timeout: 10000 }).should('be.visible');
      cy.contains("Evento criado com sucesso", { timeout: 5000 }).should("be.visible");

      // Verificar redirecionamento
      cy.url({ timeout: 10000 }).should("include", "/meus_eventos");
    });
  });

  describe("Modal de Cancelamento", () => {
    it("deve abrir modal ao clicar em cancelar", () => {
      cy.getByData('btn-cancelar').should('be.visible').click();
      cy.contains("Cancelar criação do evento?", { timeout: 3000 }).should("exist");
      cy.contains("Os dados preenchidos serão perdidos").should("exist");
    });

    it("deve fechar modal ao clicar em voltar", () => {
      cy.getByData('btn-cancelar').should('be.visible').click();
      cy.contains("Cancelar criação do evento?", { timeout: 3000 }).should("exist");
      
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
