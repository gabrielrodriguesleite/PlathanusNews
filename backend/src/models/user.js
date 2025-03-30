module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  })

  User.associate = (models) => {
    User.hasMany(models.News, { foreingKey: "id", onDelete: "CASCADE" })
  }

  return User;
}
