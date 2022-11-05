'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Reservations extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Reservations.hasOne(models.Places, {
            //     foreignKey: 'place',
            //     targetKey: 'place',
            // });
            // Reservations.hasOne(models.Teams, {
            //     foreignKey: 'teamName',
            //     targetKey: 'teamName',
            // });
        }
    }
    Reservations.init(
        {
            reservationId: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            matchId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            teamName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            place: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            result: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "승부 전"
            }
        },
        {
            sequelize,
            modelName: 'Reservations',
            timestamps: true,
            paranoid: true,
        }
    );
    return Reservations;
};
