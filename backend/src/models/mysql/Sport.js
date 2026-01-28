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
            type: DataTypes.TEXT
        },
        coach_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'user_id'
            }
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            defaultValue: 'Pending'
        }
    },
    {
        tableName: 'sports',
        timestamps: false
    }
);

module.exports = Sport;