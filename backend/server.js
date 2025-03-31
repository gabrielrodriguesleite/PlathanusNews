require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const { sequelize } = require("./src/models")
const routes = require("./src/routes")

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use("/", routes)

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== "test") {
  sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
  })
}

module.exports = app;
