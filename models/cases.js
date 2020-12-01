'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cases extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Cases.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    cedula: DataTypes.STRING,
    sexo: DataTypes.STRING,
    nacimiento: DataTypes.STRING,
    casa: DataTypes.STRING,
    trabajo: DataTypes.STRING,
    examen: DataTypes.STRING,
    fechaex: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cases',
  });
  return Cases;
};