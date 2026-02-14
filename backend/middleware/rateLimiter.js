const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 requests per window
    message: {
        status: 'error',
        data: null,
        error: 'Too many requests, please try again after a minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { chatLimiter };
