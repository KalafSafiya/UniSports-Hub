const { Op } = require('sequelize');
const User = require('../models/mysql/User');
const Sport = require('../models/mysql/Sport');
const Team = require('../models/mysql/Team');

exports.getCoachDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const coach = await User.findOne({
            where: { user_id: id, role: "Coach" },
            attributes: ["user_id", "name", "email", "status"]
        });

        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }

        const sports = await Sport.findAll({
            where: { coach_id: id },
            attributes: ["sport_id", "sport_name"]
        });

        const sportIds = sports.map(s => s.sport_id);

        const teams = sportIds.length
            ? await Team.findAll({
                where: { sport_id: sportIds },
                attributes: ["team_id", "team_name", "sport_id"]
            })
            :[];

        res.status(200).json({ coach, sports, teams});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to load coach details" });
    }
}

exports.getAllCoaches = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: "Coach" },
            attributes: [
                'user_id',
                'name',
                'username',
                'email',
                'role',
                'status',
                'created_at'
            ]
        });

        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
}