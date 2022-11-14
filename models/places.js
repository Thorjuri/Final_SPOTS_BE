'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Places extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    Places.init(
        {
            placesId: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            loginId: {
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
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            sports: {
                type: DataTypes.STRING,
                allowNull: false,
            },    
            spotName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            spotKind: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            comforts: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: {"comforts" : []}
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            desc: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "설명을 적어주세요."
            }
        },
        {
            sequelize,
            modelName: 'Places',
            timestamps: true,
            paranoid: true,
        }
    );
    return Places;
};
