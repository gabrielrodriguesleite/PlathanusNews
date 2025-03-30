const request = require("supertest")
const app = require("../server")
const { sequelize, News, User } = require("../src/models")
const { registerService, loginService } = require("../src/services/authServices")

describe("API de Notícias", () => {
  let token;
  let user;
  const name = "Um usuário"
  const email = "usuario@email.com"
  const password = "12345678"

  beforeAll(async () => {
    await sequelize.sync({ force: true })
    await registerService({ name, email, password })
    token = await loginService({ email, password })
    user = await User.findOne({ where: { email } })
  })

  afterAll(async () => {
    // await sequelize.close();
  })

  describe("🆙 - Teste App online", () => {
    it("Deve retornar sucesso", async () => {
      const res = await request(app).get('/app')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty("message")
      expect(res.body.message).toEqual("app ok")
    })
  })


  describe("🆕 - Criar uma notícia", () => {
    it("Deve criar uma notícia com sucesso", async () => {
      const res = await request(app).post("/news").send({
        title: "Título Teste",
        content: "Conteúdo da notícia...",
      }).auth(token, { type: "bearer" })

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty("news")
      expect(res.body.news.title).toBe("Título Teste")
    })

    it("Deve falhar ao criar uma notícia sem título", async () => {
      const res = await request(app).post('/news').send({
        content: "Texto válido",
      }).auth(token, { type: "bearer" })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe("O título é obrigatório.")
    })
  })

  describe("📝 - Editar uma notícia", () => {
    let noticia;

    beforeAll(async () => {
      noticia = await News.create({
        title: "Notícia Antiga",
        content: "Conteúdo original",
        userId: user.id
      })
    })

    it("Deve editar uma notícia existente", async () => {
      const res = await request(app).put(`/news/${noticia.id}`).send({
        title: "Notícia Atualizada",
        content: "Novo conteúdo",
      }).auth(token, { type: "bearer" })

      expect(res.status).toBe(200);
      expect(res.body.news.title).toBe("Notícia Atualizada")
    })

    it("Deve falar ao editar uma notícia inexistente", async () => {
      const res = await request(app).put("/news/9999").send({
        title: "Título Novo",
        content: "Novo Conteúdo",
      }).auth(token, { type: "bearer" })

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
        userId: user.id
      })
    })

    it("Deve excluir uma notícia existente", async () => {
      const res = await request(app).delete(`/news/${noticiaParaExcluir.id}`).auth(token, { type: "bearer" })
      expect(res.status).toBe(204)
    })

    it("Deve falhar ao excluir uma notícia inexistente", async () => {
      const res = await request(app).delete("/news/9999").auth(token, { type: "bearer" })
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Notícia não encontrada.")
    })

  })

  describe("🔍 - Buscar notícias", () => {
    beforeAll(async () => {
      await News.bulkCreate([
        { title: "Notícia A", content: "Texto A", userId: user.id },
        { title: "Notícia B", content: "Texto B", userId: user.id },
        { title: "Notícia C", content: "Texto C", userId: user.id },
        { title: "Notícia D", content: "Texto D", userId: user.id },
      ])
    })

    it("Deve listar todas as notícias", async () => {
      const res = await request(app).get("/news").auth(token, { type: "bearer" })
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(4)
    })

    it("Deve filtar notícias pelo título", async () => {
      const res = await request(app).get("/news?title=Notícia A").auth(token, { type: "bearer" })
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1)
      expect(res.body[0].title).toBe("Notícia A")
    })
  })
})
