const request = require('supertest')
const app = require('../server')
const { sequelize, User } = require('../src/models/')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

describe("Autheticação", () => {
  let user
  let token

  beforeAll(async () => {
    await sequelize.sync({ force: true })

    user = await User.create({
      name: "Nome do Usuário de Teste",
      email: "email@teste.com",
      password: await bcrypt.hash("12345678", 10),
    })

    token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
  })

  afterAll(async () => {
    // await sequelize.close();
  })

  describe("🔑 - Login", () => {
    it("Deve fazer login com credenciais corretas", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "email@teste.com",
        password: "12345678",
      })

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token")
    })

    it("Deve falhar com credenciais erradas", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "email@teste.com",
        password: "senhaErrada",
      })

      expect(res.status).toBe(401)
      expect(res.body.error).toBe("Credenciais inválidas.")
    })
  })

  describe("🛂 - Cadastro de usuário", () => {
    it("Deve cadastrar um novo usuário", async () => {
      const res = await request(app).post("/auth/register").send({
        name: "Novo Usuário",
        email: "novo@email.com",
        password: "senhaNova"
      })

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty("token")
    })

    it("Deve impedir o cadastro com email já existente", async () => {
      const res = await request(app).post("/auth/register").send({
        name: "Usuário Repetido",
        email: "email@teste.com",
        password: "outraSenha",
      })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe("Email já cadastrado.")
    })
  })

  describe("🔒 - Proteção de rotas", () => {
    it("Deve permitir acesso a uma rota protegida com um token válido", async () => {
      const res = await request(app).get("/news").set("Authorization", `Bearer ${token}`)
      expect(res.status).toBe(200)
    })

    it("Deve bloquear acesso sem token", async () => {
      const res = await request(app).get("/news")
      expect(res.status).toBe(401)
      expect(res.body.error).toBe("Token não fornecido.")
    })

    it("Deve bloquear acesso com token inválido", async () => {
      const res = await request(app).get("/news").set("Authorization", "Bearer token_invalido")
      expect(res.status).toBe(403)
      expect(res.body.error).toBe("Token inválido.")

    })
  })
})
