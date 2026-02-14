const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (userData) => {
    const { email, password, role } = userData;

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        email,
        password,
        role: role || 'user'
    });

    return {
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    };
};

const login = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        throw new Error('Invalid credentials');
    }

    return {
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
    };
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

module.exports = { register, login };
