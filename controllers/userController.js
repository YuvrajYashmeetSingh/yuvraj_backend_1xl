const User = require('../models/user');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updateUserProfile = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findById(req.user.id);

        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
};
