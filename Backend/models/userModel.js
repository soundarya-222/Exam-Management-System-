const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
        type: String,
        required: true,
        minlength: [3, 'First name must be at least 3 characters long']
    },
    lastname: {
        type: String,
        required: true,
        minlength: [3, 'Last name must be at least 3 characters long']
    },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: true, 
        select: false,
    },
    role: {
        type: String,   
        enum: ['teacher', 'student'],
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
};

userSchema.methods.comparePassword = async function(password) {
    // bcrypt.compare will handle the comparison against the stored hash
    return await bcrypt.compare(password, this.password);
};

// static (class) method to hash a password; we generate a salt internally
userSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
