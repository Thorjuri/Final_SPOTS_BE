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
            place: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            sports: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false,
            },
            review: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "등록된 리뷰가 없습니다."
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
