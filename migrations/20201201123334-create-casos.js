'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Casos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      apellido: {
        type: Sequelize.STRING
      },
      cedula: {
        type: Sequelize.STRING
      },
      sexo: {
        type: Sequelize.STRING
      },
      nacimiento: {
        type: Sequelize.STRING
      },
      casa: {
        type: Sequelize.STRING
      },
      trabajo: {
        type: Sequelize.STRING
      },
      examen: {
        type: Sequelize.STRING
      },
      fechaex: {
        type: Sequelize.STRING
      },
      idcaso: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Casos');
  }
};