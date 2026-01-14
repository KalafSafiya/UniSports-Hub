const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');
const User = require('./User');

const Sport = sequelize.define('Sport', 
    {
        sport_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sport_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        image: {
            type: DataTypes.STRING(255)
        },
        coach_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'user_id'
            }
        }
    },
    {
        tableName: 'sports',
        timestamps: false
    }
);

module.exports = Sport;