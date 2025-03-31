const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { User } = require('../models/')

exports.registerService = async ({ name, email, password }) => {
  const hashedPass = await bcrypt.hash(password, 10)
  const newUser = await User.create({ name, email, password: hashedPass })
  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
  return token
}

exports.loginService = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
  return token
}
