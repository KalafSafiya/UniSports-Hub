const Sport = require('../models/mysql/Sport');
const User = require('../models/mysql/User');

/**
 * Coach: Request a new sport
 * @route POST /api/sports
 */
exports.createSport = async (req, res) => {
    try {
        const { sport_name, description, image } = req.body;
        // req.user comes from your auth.middleware.js decoded token
        const coach_id = req.user.user_id || req.user.id; 

        // Check for existing sport name to prevent duplicates
        const existingSport = await Sport.findOne({ where: { sport_name }});
        if (existingSport) {
            return res.status(400).json({ message: 'This sport name already exists' });
        }

        const sport = await Sport.create({
            sport_name,
            description,
            image,
            coach_id,
            status: 'Pending' // Explicitly set as Pending for admin review
        });

        res.status(201).json({ message: 'Sport request submitted successfully', sport });
    } catch (error) {
        console.error('Error creating sport request:', error);
        res.status(500).json({ message: 'Failed to submit sport request' });
    }
};

/**
 * Admin: Get all Pending requests
 * @route GET /api/sports/pending
 */
exports.getPendingRequests = async (req, res) => {
    try {
        const requests = await Sport.findAll({
            where: { status: 'Pending' },
            include: {
                model: User,
                as: 'coach',
                attributes: ['name', 'email'] // Retrieves coach details via FK
            }
        });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Failed to fetch pending requests' });
    }
};

/*
    Admin Action: Approve with Image or Reject
    @route: PATCH /api/sports/:id/status
*/
exports.updateSportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, image } = req.body; 

        const sport = await Sport.findByPk(id);
        if (!sport) return res.status(404).json({ message: 'Sport not found' });

        if (action === 'approve') {
            await sport.update({ 
                status: 'Approve',
                image: image // This comes from the text field we just added
            });
            return res.status(200).json({ message: 'Approved' });
        } else {
            await sport.destroy();
            return res.status(200).json({ message: 'Rejected' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
    Get all Approved sports for Grid Display
    @route: GET /api/sports/approved
*/
exports.getApprovedSports = async (req, res) => {
    try {
        const sports = await Sport.findAll({
            where: { status: 'Approve' }, // Only show approved ones
            order: [['sport_name', 'ASC']]
        });
        res.status(200).json(sports);
    } catch (error) {
        console.error('Error fetching approved sports:', error);
        res.status(500).json({ message: 'Failed to fetch sports list' });
    }
};
