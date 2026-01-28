const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');

const Venue = sequelize.define('Venue',
    {
        venue_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        location: DataTypes.STRING(255),
        capacity: DataTypes.INTEGER,
        status: {
            type: DataTypes.ENUM('Available', 'Unavailable'),
            defaultValue: 'Available'
        }
    },
    {
        tableName: 'venues',
        timestamps: false
    }
);

module.exports = Venue;