const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');

const ContactRequest = sequelize.define('ContactRequest',
    {
        request_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING(100),
        email: DataTypes.STRING(100),
        role: DataTypes.ENUM('Student', 'Coach', 'Staff'),
        university_id: DataTypes.STRING(50),
        subject: DataTypes.STRING(150),
        message: DataTypes.TEXT,
        attachment: DataTypes.STRING(255),
        status: {
            type: DataTypes.ENUM('Pending', 'Read', 'Resolved'),
            defaultValue: 'Pending'
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'contact_requests',
        timestamps: false
    }
);

module.exports = ContactRequest;