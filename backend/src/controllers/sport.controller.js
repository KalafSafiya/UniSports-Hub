const Sport = require('../models/mysql/Sport');
const User = require('../models/mysql/User');

/*
    Create new sport
    @route: POST /api/sports
*/
exports.createSport = async (req, res) => {
    try {
        const { sport_name, image, coach_id } = req.body;

        // Check if sport name already exists
        const existingSport = await Sport.findOne({ where: { sport_name }});
        if (existingSport) {
            return res.status(400).json({ message: 'Sport name already exists' });
        }

        // Check if coach exists 
        const coach = await User.findByPk(coach_id);
        if (!coach) {
            return res.status(404).json({ message: 'Coach not found' });
        }

        // Create new sport
        const sport = await Sport.create({
            sport_name,
            image,
            coach_id
        });

        res.status(201).json(sport);
    }
    catch (error) {
        console.error('Error creating sport: ', error);
        res.status(500).json({ message: 'Failed to create sport' });
    }
}

/*
    Get all sports
    @route: GET /api/sports
*/
exports.getAllSports = async (req, res) => {
    try {
        const sports = await Sport.findAll({
            include: {
                model: User,
                as: 'coach',
                attributes: ['user_id', 'name', 'username', 'email', 'role']
            }
        });
        res.status(200).json(sports);
    }
    catch (error) {
        console.error('Error fetching sports', error);

    }
}

/*
    Get sport by ID
    @route: GET /api/sports/:id
*/
exports.getSportById = async (req, res) => {
    try {
        const { id } = req.params;
        const sport = await Sport.findByPk(id, {
            include: {
                model: User,
                as: 'coach',
                attributes: ['user_id', 'name', 'username', 'email', 'role']
            }
        });

        if (!sport) {
            return res.status(404).json({ message: 'Sport not found' });
        }

        res.status(200).json(sport);
    }   
    catch (error) {
        console.error('Error fetching sport: ', error);
        res.status(500).json({ message: 'Failed to fetch sport' });
    }
}

/* 
    Update a sport
    @routes: PUT /api/sports/:id
*/
exports.updateSport = async (req, res) => {
    try {
        const { id } = req.params;
        const { sport_name, image, coach_id } = req.body;

        const sport = await Sport.findByPk(id);
        if (!sport) {
            return res.status(404).json({ message: 'Sport not found' })
        }

        if (coach_id) {
            const coach = await User.findByPk(coach_id);
            if (!coach_id) {
                return res.status(400).json({ message: 'Coach not found.' });
            }
        }

        await sport.update({
            sport_name,
            image,
            coach_id
        });

        res.status(200).json(sport);
    }
    catch (error) {
        console.error('Error updating sport: ', error);
        res.status(500).json({ message: 'Failed to update sport' });
    }
}

/*
    Delete a sport
    @routes: DELETE /api/sports/:id
*/
exports.deleteSport = async (req, res) => {
    try {
        const { id } = req.params;
        const sport = await Sport.findByPk(id);
        if (!sport) {
            return res.status(404).json({ message: 'Sport not found' });
        }

        await sport.destroy();

        res.status(200).json({ message: 'Sport deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting sport: ', error);
        res.status(500).json({ message: 'Failed to delete sport' });
    }
}