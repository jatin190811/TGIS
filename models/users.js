const { Sequelize, DataTypes, Model } = require('sequelize');
var sequelize = require('../config/database').sequelize;


const User = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING
    }
  }, {
    modelName: 'user' 
  });

  module.exports = User