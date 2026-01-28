const { DataTypes } = require('sequelize');
const sequelize = require('../../config/mysql');

const Media = sequelize.define('Media',
    {
        media_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING(150),
        image_path: DataTypes.TEXT,
        category: DataTypes.ENUM('Sport', 'Venue', 'Announcement', 'News'),
        uploaded_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'media',
        timestamps: false
    }
);

module.exports = Media;