require("dotenv").config()
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." })
  }

  const [, token] = authHeader.split(" ")

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId

    return next()
  } catch (error) {
    return res.status(403).json({ error: "Token inválido." })
  }
}
