const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');
const Sport = require('./Sport');
const Venue = require('./Venue');
const { defaultValueSchemable } = require('sequelize/lib/utils');

const SportRequest = sequelize.define('SportRequest', 
    {
        request_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sport_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Sport,
                key: 'sport_id'
            }
        },
        venue_id: {

            type: DataTypes.INTEGER,
            references: {
                model: Venue,
                key: 'venue_id'
            }
        },
        type: DataTypes.ENUM('New Sport', 'New Event'),
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            defaultValue: 'Pending'
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'sports_requests',
        timestamps: false
    }
);

module.exports = SportRequest;