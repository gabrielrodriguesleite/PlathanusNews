// require("dotenv").config()

const SQLite = require("sqlite3")


module.exports = {
  development: {
    dialect: "sqlite",
    storage: ':memory:',
    dialectOptions: {
      mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
    },
    logging: false
  },

  production: {
    dialect: "sqlite",
    storage: ':memory:',
    dialectOptions: {
      mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
    },
    logging: false
  },

  test: {
    dialect: "sqlite",
    storage: ':memory:',
    dialectOptions: {
      mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
    },
    logging: false
  }
}
