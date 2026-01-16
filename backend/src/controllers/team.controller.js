const Team = require('../models/mysql/Team');
const Sport = require('../models/mysql/Sport');
const TeamMember = require('../models/mysql/TeamMember');

/*
    Create Team
    @route: POST /api/teams
*/
exports.createTeam = async (req, res) => {
    try {
        const { team_name, sport_id, status } = req.body;

        if (!team_name || !sport_id) {
            return res.status(400).json({ message: "Team name and sport id are required." });
        }

        const team = await Team.create({
            team_name,
            sport_id,
            status
        });

        res.status(201).json(team);
    }
    catch (error) {
        console.error('Error creating team: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/*
    Get all teams
    @route: GET /api/teams
*/
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.findAll({
            include: [
                {
                    model: Sport,
                    attributes: ['sport_id', 'sport_name', 'coach_id']
                },
                {
                    model: TeamMember
                }
            ],
            order: [['created_at', 'DESC']]
        });

        if (!teams) {
            return res.status(404).json({ message: 'No team found' });
        }

        res.status(200).json(teams);
    }
    catch (error) {
        console.error('Error fetching teams: ', error);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
}

/*
    Get team by id
    @route: GET /api/teams/:d
*/
exports.getTeamById = async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findByPk(id, {
            include: [
                {
                    model: Sport,
                    attributes: ['sport_id', 'sport_name', 'coach_id']
                },
                {
                    model: TeamMember
                }
            ]
        });

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        res.status(200).json(team);
    }
    catch (error) {
        console.error('Error fetching teams: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/*
    Update a team
    @route: PUT /api/teams/:id
*/
exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { team_name, sport_id, status } = req.body;

        const team = await Team.findByPk(id);
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        await team.update({
            team_name,
            sport_id,
            status
        });

        res.status(200).json(team);
    }
    catch (error) {
        console.error('Error updating team: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
/*
    Delete a team
    @route: POST /api/teams
*/
exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findByPk(id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.destroy();

        res.status(200).json({ message: 'Team deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting team: ', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
