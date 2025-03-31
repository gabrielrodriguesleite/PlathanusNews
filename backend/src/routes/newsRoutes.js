const express = require("express")

const newsController = require("../controllers/newsController")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/", authMiddleware, newsController.createNews)
router.get("/", authMiddleware, newsController.getAllNews)
router.get("/:id", authMiddleware, newsController.getNewsById)
router.put("/:id", authMiddleware, newsController.updateNews)
router.delete("/:id", authMiddleware, newsController.deleteNews)

module.exports = router 
