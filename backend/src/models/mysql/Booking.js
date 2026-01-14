const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');
const Sport = require('./Sport');
const Venue = require('./Venue');
const Team = require('./Team');

const Booking = sequelize.define('Booking',
    {
        booking_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.ENUM('Staff', 'Coach', 'Student'),
            allowNull: false
        },
        sport_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Sport,
                key: 'sport_id'
            }
        },
        team_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Team,
                key: 'team_id'
            }
        },
        venue_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Venue,
                key: 'venue_id'
            }
        },
        date: DataTypes.INTEGER,
        start_time: DataTypes.TIME,
        end_time: DataTypes.TIME,
        event_name: DataTypes.STRING(150),
        additional_notes: DataTypes.TEXT,
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
        tableName: 'bookings',
        timestamps: false
    }
);

module.exports = Booking;