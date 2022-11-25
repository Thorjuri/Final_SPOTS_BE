'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Teams extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Teams.hasMany(models.Users, {
            //     foreignKey: 'teamName',
            //     targetKey: 'teamName',
            // });
        }
    }
    Teams.init(
        {
            teamId: {
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER,
            },
            teamName: {
                type: DataTypes.STRING,
                // unique: true,
                allowNull: false,
            },
            sports: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            admin: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            member: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            wins: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            lose: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }

        },
        {
            sequelize,
            modelName: 'Teams',
            timestamps: true,
            paranoid: true,
        }
    );
    return Teams;
};
