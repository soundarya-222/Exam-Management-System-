const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');


async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

async function createUser({ firstname, lastname, email, password }) {
    if (!firstname || !lastname || !email || !password) {
        throw new Error('All fields are required');
    }

    const hashed = await hashPassword(password);
    const user = new userModel({
        fullname: { firstname, lastname },
        email,
        password: hashed
    });

    return user.save();
}

async function findByEmail(email) {
    // include password for login comparison
    return userModel.findOne({ email }).select('+password');
}

module.exports = {
    hashPassword,
    createUser,
    findByEmail,
};
