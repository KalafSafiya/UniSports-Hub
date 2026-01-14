const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        date: Date,
        image_path: String,
        link: String,
        created_at: {
            type: Date,
            default: Date.now
        }
    },
    { collection: 'announcements' } // <-- force the collection name
);

module.exports = mongoose.model('Announcement', announcementSchema);
