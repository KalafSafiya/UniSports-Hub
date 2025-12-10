const Announcement = require('../models/mongo/Announcement');

// Create announcement
exports.create = async (req, res) => {
    try {
        const {
            title,
            description,
            created_by
        } = req.body;

        const announcement = await Announcement.create({
            title,
            description,
            created_by
        });

        res.status(201).json({
            message: "Announcement created successfully",
            announcement
        });

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

// Get all announcements
exports.getAll = async (req, res) => {
    try{
        const announcements = await Announcement.findAll().sort({ created_at: -1 });

        res.json(announcements);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get announcement by id
exports.getById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.json(announcement);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Update announcement
exports.getOne = async (req, res) => {
    try {
        const updated = await Announcement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.json({
            message: "Announcement updated successfully",
            announcement: updated
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete announcement
exports.delete = async (req, res) => {
    try {
        const deleted = await Announcement.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Announcement not found"});
        }

        res.json({ message: "Announcement deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}