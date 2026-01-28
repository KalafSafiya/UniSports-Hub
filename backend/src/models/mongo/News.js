const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
    {
        title: String,
        date: Date,
        image_path: String,
        link: String,
        description: String,
        created_at: {
            type: Date,
            default: Date.now
        }
    },
    { collection: 'news' } // <-- force the collection name
);

module.exports = mongoose.model('News', newsSchema);