describe("Tela de Edição de Evento", () => {

  beforeEach(() => {
    // Mock da sessão do next-auth
    cy.intercept("GET", "/api/auth/session", {
      statusCode: 200,
      body: {
        user: {
          name: "Admin",
          email: "admin@admin.com",
          accesstoken: "token-falso-123",
        }
      }
    })

    // Mock do evento sendo carregado
    cy.intercept("GET", "/api/eventos/*", {
      statusCode: 200,
      body: {
        data: {
          _id: "123",
          nome: "Evento Teste",
          descricao: "Um evento para testar",
          permissoes: [
            { usuario: "1", email: "user1@email.com" }
          ],
          imagens: [],
          configuracoes: {
            tema: "padrao",
            animacao: "fade"
          }
        }
      }
    })

    // Mock do PUT (salvar alterações)
    cy.intercept("PUT", "/api/eventos/123", {
      statusCode: 200,
      body: { ok: true }
    }).as("editarEvento")

    cy.visit("http://localhost:3000/eventos/editar/123")
  })

  it("carrega a página corretamente", () => {
    cy.contains("Editar Evento").should("exist")
    cy.contains("Informações Básicas").should("exist")
  })

  it("preenche etapa 1 e avança", () => {
    // Campos da etapa 1 (ajuste se os data-test forem diferentes)
    cy.get('input[name="nome"]').clear().type("Evento Editado")
    cy.get('textarea[name="descricao"]').clear().type("Descrição atualizada")

    // Avançar
    cy.contains("button", "Continuar").click()

    // Verifica se estamos na etapa 2
    cy.contains("Upload de Mídia").should("exist")
  })

  it("realiza upload de imagem na etapa 2 e avança", () => {

    // Simula upload de imagem
    cy.get('input[type="file"]').selectFile("cypress/fixtures/imagem.jpg", { force: true })

    // Avançar
    cy.contains("button", "Continuar").click()

    // Verifica se estamos na etapa 3
    cy.contains("Configurações").should("exist")
  })

  it("altera configuração e salva o evento", () => {
    // Estamos na etapa 3 agora

    // Simula alguma configuração (ajuste conforme teu campo)
    cy.get('select[name="tema"]').select("dark")

    // Simula abrir o preview
    cy.contains("button", "Preview").click()

    // Fecha a aba do preview automaticamente
    cy.window().then((win) => win.close())

    // Salvar
    cy.contains("button", "Salvar Alterações").click()

    // Espera rota ser chamada
    cy.wait("@editarEvento").its("request.body").should((body) => {
      expect(body.nome).to.equal("Evento Editado")
    })

    // Verifica se redirecionou
    cy.url().should("include", "/meus_eventos")
  })

})
