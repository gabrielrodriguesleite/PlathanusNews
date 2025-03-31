const express = require("express")

const appRoutes = require("./appRoutes");
const newsRoutes = require("./newsRoutes");
const authRoutes = require("./authRoutes");

const router = express.Router()

router.use("/app", appRoutes)
router.use("/news", newsRoutes)
router.use("/auth", authRoutes)

module.exports = router;
