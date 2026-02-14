const express = require('express');
const router = express.Router();
const { register, login } = require('../services/authService');

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const data = await register(req.body);
        res.status(201).json({
            status: 'success',
            data,
            error: null
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await login(email, password);
        res.status(200).json({
            status: 'success',
            data,
            error: null
        });
    } catch (error) {
        res.status(401).json({
            status: 'error',
            data: null,
            error: error.message
        });
    }
});

module.exports = router;
