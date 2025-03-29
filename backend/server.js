require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use("/", (req, res) =>
  res.status(200).json({ message: "api ok" }))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))

module.exports = app;
