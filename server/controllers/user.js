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

// Toggle Follow User
module.exports.toggleFollow = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);
        
        if (currentUser.following.includes(targetUser._id)) {
            // Unfollow
            currentUser.following.pull(targetUser._id);
            targetUser.followers.pull(currentUser._id);
        } else {
            // Follow
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);
        }
        await currentUser.save();
        await targetUser.save();
        res.status(200).send({ message: "Follow status updated", following: currentUser.following });
    } catch (err) { res.status(500).send({ error: "Action failed" }); }
};

module.exports.getSuggestions = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        // Find 3 users that the current user is NOT already following
        const users = await User.find({
            _id: { $nin: [...currentUser.following, currentUser._id] }
        }).limit(3).select('username');
        res.status(200).send(users);
    } catch (err) { res.status(500).send({ error: "Failed to load suggestions" }); }
};

module.exports.getProfile = async (req, res) => {
    try {
        const profileUser = await User.findOne({ username: req.params.username })
            .select('-password')
            .populate('followers', 'username')
            .populate('following', 'username');
            
        if (!profileUser) return res.status(404).send({ message: "User not found" });
        
        const Post = require('../models/Post'); 
        const posts = await Post.find({ author: profileUser._id }).populate('author', 'username').sort({ creationDate: -1 });
        const replies = await Post.find({ "comments.author": profileUser._id }).populate('author', 'username').sort({ creationDate: -1 });
        
        res.status(200).send({ user: profileUser, posts, replies });
    } catch (err) { res.status(500).send({ error: "Failed to load profile" }); }
};

module.exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send({ message: "User not found" });

        user.username = req.body.username || user.username;

        if (req.body.profilePic !== undefined) {
            user.profilePic = req.body.profilePic;
        }

        await user.save();

        res.status(200).send({ message: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).send({ error: "Failed to update profile. Username might be taken." });
    }
};