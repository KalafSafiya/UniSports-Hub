const bycrypt = require('bcrypt');
const User = require('../models//mysql/User');

/*
    Create user (Admin Only)
*/
exports.createUser = async (req, res) => {
    try { 
        const { name, username, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bycrypt.hash(password, 10);

        const user = await User.create({
            name,
            username, 
            password: hashedPassword,
            role
        });

        res.status(201).json({
            user_id: user.user_id,
            name: user.name,
            username: user.username,
            role: user.role
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'User Creation Failed' });
    }
}