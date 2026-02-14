const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            status: 'error',
            data: null,
            error: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            throw new Error('User not found');
        }

        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err.message);
        return res.status(401).json({
            status: 'error',
            data: null,
            error: 'Not authorized - Token failed'
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                data: null,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
