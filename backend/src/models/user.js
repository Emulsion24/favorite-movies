'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {  this.hasMany(models.Movie, { foreignKey: 'userId' });}
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user', // 'user' or 'admin'
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
