const request = require("supertest")
const app = require("../server")
const { sequelize, News, Author } = require("../src/models")

jest.mock('../src/middlewares/authMiddleware', () => jest.fn((req, res, next) => next()))

describe("API de Notícias", () => {
  let author;

  beforeAll(async () => {
    await sequelize.sync({ force: true })
    author = await Author.create({ name: "Author Teste" })
  })

  afterAll(async () => {
    // await sequelize.close();
  })

  describe("🆙 - Teste App online", () => {
    it("Deve retornar sucesso", async () => {
      const res = await request(app).get('/app')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toEqual("api ok")
    })
  })


  describe("🆕 - Criar uma notícia", () => {
    it("Deve criar uma notícia com sucesso", async () => {
      const res = await request(app).post("/news").send({
        title: "Título Teste",
        content: "Conteúdo da notícia...",
        authorId: author.id,
      })

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty("news")
      expect(res.body.news.title).toBe("Título Teste")
    })

    it("Deve falhar ao criar uma notícia sem título", async () => {
      const res = await request(app).post('/news').send({
        content: "Texto válido",
        authorId: author.id,
      })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe("O título é obrigatório.")
    })

    it("Deve falhar ao criar uma notícia sem autor", async () => {
      const res = await request(app).post('/news').send({
        title: "Notícia sem autor",
        content: "Texto válido",
      })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe("O autor é obrigatório.")
    })
  })

  describe("📝 - Editar uma notícia", () => {
    let noticia;

    beforeAll(async () => {
      noticia = await News.create({
        title: "Notícia Antiga",
        content: "Conteúdo original",
        authorId: author.id,
      })
    })

    it("Deve editar uma notícia existente", async () => {
      const res = await request(app).put(`/news/${noticia.id}`).send({
        title: "Notícia Atualizada",
        content: "Novo conteúdo",
        authorId: author.id,
      })

      expect(res.status).toBe(200);
      expect(res.body.news.title).toBe("Notícia Atualizada")
    })

    it("Deve falar ao editar uma notícia inexistente", async () => {
      const res = await request(app).put("/news/9999").send({
        title: "Título Novo",
        content: "Novo Conteúdo",
        authorId: author.id,
      })

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Notícia não encontrada.")
    })
  })

  describe("🗑️  - Excluir uma notícia", () => {
    let noticiaParaExcluir;

    beforeAll(async () => {
      noticiaParaExcluir = await News.create({
        title: "Para excluir",
        content: "Texto qualquer",
        authorId: author.id,
      })
    })

    it("Deve excluir uma notícia existente", async () => {
      const res = await request(app).delete(`/news/${noticiaParaExcluir.id}`)
      expect(res.status).toBe(204)
    })

    it("Deve falhar ao excluir uma notícia inexistente", async () => {
      const res = await request(app).delete("/news/9999")
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Notícia não encontrada.")
    })

  })

  describe("🔍 - Buscar notícias", () => {
    beforeAll(async () => {
      await News.bulkCreate([
        { title: "Notícia A", content: "Texto A", authorId: author.id },
        { title: "Notícia B", content: "Texto B", authorId: author.id },
        { title: "Notícia C", content: "Texto C", authorId: author.id },
        { title: "Notícia D", content: "Texto D", authorId: author.id },
      ])
    })

    it("Deve listar todas as notícias", async () => {
      const res = await request(app).get("/news")
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(4)
    })

    it("Deve filtar notícias pelo título", async () => {
      const res = await request(app).get("/news?title=Notícia A")
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1)
      expect(res.body[0].title).toBe("Notícia A")
    })
  })


})
