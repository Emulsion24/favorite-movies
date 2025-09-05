'use strict';

/** @type {import('sequelize-cli').Migration} */
  module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Movies", "deleted", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("Movies", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Movies", "deleted");
    await queryInterface.removeColumn("Movies", "deletedAt");
  },
};

