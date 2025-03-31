module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define("News", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
  })

  News.associate = (models) => {
    News.belongsTo(models.User, { foreignKey: "UserId", allowNull: false })
  }

  return News
}
