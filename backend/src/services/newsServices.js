const { News, User } = require("../models");

exports.serviceCreateNews = async ({ title, content, userId }) => {
  const user = await User.findByPk(userId)
  if (!user) { return }

  let newNews
  try {
    newNews = await News.create({ title, content, UserId: userId })
  } catch (e) {
    console.error(e)
  }

  return newNews
}

// TODO:: trazer todos os serviços de notícias.
