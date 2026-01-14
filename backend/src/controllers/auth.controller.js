const bcrypt = require('bcryptjs');
const User = require('../models/mysql/User');

/*
    User Login
*/
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username }});
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        res.status(200).json({
            user_id: user.user_id,
            name: user.name,
            role: user.role
        });
    }
    catch {
        res.status(500).json({ message: 'Login Failed' });
    }
}