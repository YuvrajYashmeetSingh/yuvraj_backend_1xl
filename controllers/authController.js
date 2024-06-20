const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');


exports.register = async (req, res) => {
    const { name, email, password, adminpass } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });
        let isadmin = false;

        // We can make it more safe by hashing
        if( adminpass == process.env.ADMIN_PASS )
            isadmin = true;

        user = new User({ name, email, password, isAdmin: isadmin });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { id: user.id };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { id: user.id };
        //   res.json({text:"user connect"
        //   })

        jwt.sign(payload, process.env.JWT_SECRET,  (err, token) => {
            if (err) throw err;
            res.json({ token });
            console.log({token})
            res.status(400).send({"auth_token": {token}});
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
