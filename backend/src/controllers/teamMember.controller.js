const TeamMember = require('../models/mysql/TeamMember');
const Team = require('../models/mysql/Team');

/*
    Create new team member
    @route: POST /api/team-members
*/
exports.createTeamMember = async (req, res) => {
    try {
        const { 
            team_id,
            member_name,
            registration_number,
            role,
            faculty,
            year
        } = req.body;

        const team = await Team.findByPk(team_id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const member = await TeamMember.create({
            team_id,
            member_name,
            registration_number,
            role,
            faculty,
            year
        });

        res.status(201).json(member);
    }
    catch (error) {
        console.error('Error creating team member: ', error)   ;
        res.status(500).json({ message: 'Failed to create team member' });
    }
}

/*
    Get all team members
    @route: GET /api/team-members
*/
exports.getAllTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.findAll();
        res.status(200).json(members);
    }
    catch (error) {
        console.error('Error fetching team members: ', error);
        res.status(500).json({ message: 'Failed to fetch team members' });
    }
}

/*
    Get team member by ID
    @route: GET /api/team-members/:id
*/
exports.getTeamMemberById = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await TeamMember.findByPk(id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found.' });
        }

        res.status(200).json(member);
    }
    catch (error) {
        console.error('Error fetching team members: ', error);
        res.status(500).json({ message: 'Failed to fetch team members' });
    }
}

/*
    Get team members by team
    @route: GET /api/team-members/team/:team_id
*/
exports.getTeamMemberByTeam = async (req, res) => {
    try {
        const { team_id } = req.params;

        const members = await TeamMember.findAll({ where:  {team_id } });
        if (!members) {
            return res.status(404).json({ message: 'Team member not found.' });
        }

        res.status(200).json(members);
    }
    catch (error) {
        console.error('Error fetching team members: ', error);
        res.status(500).json({ message: 'Failed to fetch team members.' });
    }
}

/*
    Update team member
    @route: PUT /api/team-members/:id
*/
exports.updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await TeamMember.findByPk(id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found.' });
        }

        await member.update(req.body);

        res.status(200).json(member);
    }
    catch (error) {
        console.error('Error updating team member: ', error);
        res.status(500).json({ message: 'Failed to update team member.' });
    }
}

/*
    Delete team member
    @route: DELETE /api/team-members/:id
*/
exports.deleteTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found.' });
        }

        await member.destroy();

        res.status(200).json({ message: 'Team member deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting team member: ', error);
        res.status(500).json({ message: 'Failed to delete team member.' });
    }
}