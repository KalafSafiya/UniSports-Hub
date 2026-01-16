const bcrypt = require('bcryptjs');
const User = require('../models//mysql/User');

/*
    Create user (Admin Only)
*/
exports.createUser = async (req, res) => {
    try { 
        const { name, username, email, password, role, status } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already in use.'});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            username, 
            email,
            password: hashedPassword,
            role,
            status: status || 'Active'
        });

        res.status(201).json({
            user_id: user.user_id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status,
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'User Creation Failed' });
    }
}

/*
    Get all users (Admin Only)
*/
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
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

/*
    Update user by ID (Admin Only)
*/
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, email, role, status } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        // Email uniqueness check
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email }});
            if (emailExists) {
                return res.status(400).json({ message: 'Email alread in use.'});
            }
        }

        await user.update({
            name: name ?? user.name,
            email: email ?? user.email,
            username: username ?? user.username,
            status: status ?? user.status
        });

        res.status(200).json({
            message: 'User Updated Successfully.'
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'User Update Failed' });
    }
}

/*
    Delete user by ID (Admin Only)
*/
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        res.status(200).json({ message: 'User Deleted Successfully.' });
    }
    catch (error) {
        console.error('Error deleting user: ', error);
        res.status(500).json({ message: 'User Deletion Failed' });
    }
}

exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = status;
        await user.save();

        res.json({
            message: 'Status updated successfully',
            user_id: user.user_id,
            status: user.status
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update status" });
    }
}
