const userModel = require('../models/userModel');
const userService = require('../services/userService');

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json({ user: req.user });
};