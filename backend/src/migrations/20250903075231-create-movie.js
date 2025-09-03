'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false }, // Movie / TV Show
      director: Sequelize.STRING,
      budget: Sequelize.STRING,
      location: Sequelize.STRING,
      duration: Sequelize.STRING,
      year: Sequelize.STRING,
      image: Sequelize.STRING,
      approved: { type: Sequelize.BOOLEAN, defaultValue: false },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movies');
  },
};
