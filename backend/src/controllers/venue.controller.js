const Venue = require('../models/mysql/Venue');

// Create a Venue
exports.createVenue = async (req, res) => {
    try {
        const { name, location, capacity, status } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Venue name is required' });
        }

        const existingVenue = await Venue.findOne({ where: { name }});
        if (existingVenue) {
            return res.status(400).json({ message: 'Venue already exists' });
        }

        const venue = await Venue.create({
            name, 
            location, 
            capacity,
            status: status || 'Available'
        });

        res.status(201).json(venue);
    }
    catch (error) {
        console.error('Error creating venue: ', error);
        res.status(500).json({ message: 'Failed to create venue' });
    }
}

// Get all venues
exports.getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.findAll();
        if (!venues) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        res.status(200).json(venues);
    }
    catch (error) {
        console.error('Error fetching venues: ', error);
        res.status(500).json({ message: 'Failed to fetch venues' });
    }
}