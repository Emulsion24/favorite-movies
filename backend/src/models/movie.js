'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    type: DataTypes.STRING,
    director: DataTypes.STRING,
    budget: DataTypes.STRING,
    location: DataTypes.STRING,
    duration: DataTypes.STRING,
    year: DataTypes.STRING,
    image: DataTypes.STRING,
    approved: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};