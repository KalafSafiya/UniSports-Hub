const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');
const Sport = require('./Sport');
const Team = require('./Team');
const Venue = require('./Venue');

const Schedule = sequelize.define('Schedule',
    {
        schedule_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sport_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Sport,
                key: 'sport_id',
            }
        },
        team1_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Team,
                key: 'team_id'
            }
        },
        team2_id: {
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
        date: DataTypes.DATE,
        start_time: DataTypes.TIME,
        end_time: DataTypes.TIME,
        type: DataTypes.ENUM('Practice', 'Match'),
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
        tableName: 'schedules',
        timestamps: false
    }
);

module.exports = Schedule;