module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  })

  Author.associate = (models) => {
    Author.hasMany(models.News, { foreignKey: "authorId", onDelete: "CASCADE" })
  }

  return Author
}
