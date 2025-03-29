
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User } = require('../models/')


exports.register = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado." })
    }

    const hashedPass = await bcrypt.hash(password, 10)
    const newUser = await User.create({ name, email, password: hashedPass })
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    return res.status(201).json({ message: "Usuário registrado com sucesso", token })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({ error: "Credenciais inválidas." })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas." })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
    return res.status(200).json({ message: "Login bem-sucedido", token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Erro interno do servidor" })
  }

}
