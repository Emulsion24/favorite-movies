'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Movies', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending', // pending / approved / rejected
    });

    // Optional: remove the old approved column if it exists
    await queryInterface.removeColumn('Movies', 'approved');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Movies', 'status');

    // Optional: restore the approved column
    await queryInterface.addColumn('Movies', 'approved', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
