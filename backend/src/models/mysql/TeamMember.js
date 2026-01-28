const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');
const Team = require('./Team');

const TeamMember = sequelize.define('TeamMember',
    {
        member_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        team_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Team,
                key: 'team_id'
            }
        },
        member_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        registration_number: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('Player', 'Captain', 'Vice Captain'),
            defaultValue: 'Player',
        },
        faculty: {
            type: DataTypes.ENUM(
                'Faculty of Applied Science',
                'Faculty of Business Studies',
                'Faculty of Technology Studies'
            ),
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'team_members',
        timestamps: false
    }
);

module.exports = TeamMember;