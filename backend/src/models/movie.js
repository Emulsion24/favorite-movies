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
    budget: DataTypes.INTEGER,
    location: DataTypes.STRING,
    duration: DataTypes.STRING,
    year: DataTypes.STRING,
    image: DataTypes.STRING,
    status:{
        type: DataTypes.STRING,
        defaultValue: 'Pending', // 'Pending' or 'Aprooved' or 'Rejected'
      },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};