const Booking = require("../models/mysql/Booking");
const Sport = require("../models/mysql/Sport");
const Venue = require("../models/mysql/Venue");

// Create a Booking
exports.create = async (req, res) => {
    try {
        const {
            name,
            email,
            role,
            university_id,
            team,
            sport_id,
            venue_id,
            date,
            time_slot,
            purpose,
            additional_notes
        } = req.body;

        const booking = await Booking.create({
            name,
            email,
            role,
            university_id,
            team,
            sport_id,
            venue_id,
            date,
            time_slot,
            purpose,
            additional_notes
        });

        res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all bookings
exports.getAll = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: Sport, as: 'sport' },
                { model: Venue, as: 'venue' }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(bookings);
    } 
    catch (error) {
        res.status(500).json({ error: error.message })    
    }
};

// Get booking by id
exports.getOne = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                { model: Sport, as: 'sport' },
                { model: Venue, as: 'venue' }
            ]
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a booking
exports.update = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await booking.update(req.body);

        res.json({
            message: "Booking updated successfullly",
            booking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Booking
exports.delete = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await booking.destroy();

        res.json({ message: "Booking deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get bookings by sport
exports.getBySport = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { sport_id: req.params.sportId }
        });

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get bookings by venue
exports.getByVenue = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { venue_id: req.params.venueId }
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};