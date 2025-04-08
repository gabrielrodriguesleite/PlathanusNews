const { User } = require('../models/')
const { registerService, loginService } = require("../services/authServices")


exports.register = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado." })
    }

    const token = await registerService({ name, email, password })
    return res.status(201).json({ message: "Usuário registrado com sucesso", token })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const credentials = await loginService({ email, password })

    if (!credentials) {
      return res.status(401).json({ error: "Credenciais inválidas." })
    }

    const { token, user } = credentials
    const data = { token, user: { name: user.name, email: user.email } }

    return res.status(200).json({ message: "Login bem-sucedido", ...data })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}

exports.verify = async (_, res) => {
  return res.status(200).json({ message: "Token válido" })
}
