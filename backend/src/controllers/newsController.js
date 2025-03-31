const { News, User } = require("../models");
const { serviceCreateNews } = require("../services/newsServices");

exports.createNews = async (req, res) => {
  const { userId } = req
  const { title, content } = req.body;

  if (!title || title == "") {
    return res.status(400).json({ error: "O título é obrigatório." })
  }

  try {
    const newNews = await serviceCreateNews({ userId, title, content })
    if (!newNews) {
      return res.status(400).json({ error: "Autor não encontrado." })
    }


    return res.status(201).json({ message: "Notícia criada com sucesso.", news: newNews })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro interno do servidor." })
  }
}

exports.getAllNews = async (req, res) => {
  try {
    const { title } = req.query

    if (title) {
      const news = await News.findAll({
        where: {
          title
        }
      })
      return res.status(200).json(news)
    }

    const newsList = await News.findAll({
      include: [{ model: User, attributes: ["name"] }],
    })
    return res.status(200).json(newsList)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro ao buscar notícias." })
  }
}

exports.getNewsById = async (req, res) => {
  const { id } = req.params

  try {
    const news = await News.findByPk(id, {
      include: [{ model: User, attributes: ["name"] }],
    })

    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada." })
    }

    return res.status(200).json(news)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro ao buscar notícias." })
  }
}

exports.updateNews = async (req, res) => {
  const { userId } = req
  const { id } = req.params
  const { title, content } = req.body

  try {
    const news = await News.findByPk(id)
    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada." })
    }

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: "Autor não encontrado." })
    }

    news.title = title || news.title
    news.content = content || news.content
    news.userId = userId || news.userId

    await news.save()

    return res.status(200).json({ message: "Notícia atualizada.", news })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Erro ao atualizar notícia." })
  }
}

exports.deleteNews = async (req, res) => {
  const { id } = req.params

  try {
    const news = await News.findByPk(id)
    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada." })
    }

    await news.destroy()
    return res.status(204).json({ message: "Notícia excluída com sucesso." })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro ao excluir notícia." })
  }
}
