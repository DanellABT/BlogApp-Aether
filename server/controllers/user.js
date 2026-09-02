const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');

module.exports.register = async (req, res) => {
    try {
        let newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });
        const savedUser = await newUser.save();
        res.status(201).send({ message: "Registered Successfully", user: savedUser });
    } catch (err) {
        res.status(500).send({ error: "Registration failed", details: err.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).send({ message: "User not found" });

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordCorrect) return res.status(401).send({ message: "Incorrect password" });

        res.status(200).send({ access: auth.createAccessToken(user) });
    } catch (err) {
        res.status(500).send({ error: "Login failed", details: err.message });
    }
};