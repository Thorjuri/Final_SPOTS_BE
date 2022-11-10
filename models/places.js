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
            sports: {
                type: DataTypes.STRING,
                allowNull: false,
            },    
            place: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            spot: {
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
            hours: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.STRING,
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
