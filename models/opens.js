'use strict';
const { Model }  = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Opens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Opens.init(
    {
        opensId: {
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER,
        },
        minclassnm: { 
              type: DataTypes.STRING,
              allowNull: false,
        },    
        svcstatnm: { 
          type: DataTypes.STRING,
          allowNull: false,
        },
        svcnm: { 
          type: DataTypes.STRING,
          allowNull: false,
        },
        placenm: { 
          type: DataTypes.STRING,
          allowNull: false,
        },
        svcurl: { 
          type: DataTypes.STRING,
          allowNull: false,
        },
        x: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        y: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        areanm: { 
          type: DataTypes.STRING,
          allowNull: false,
        },
        imgurl: { 
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Opens',
      });
      return Opens;
};