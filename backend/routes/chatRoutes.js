const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimiter');
const { chatWithRAG } = require('../services/chatService');

// @desc    Chat with RAG AI
// @route   POST /api/chat
router.post('/', protect, chatLimiter, async (req, res, next) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                status: 'error',
                data: null,
                error: 'Question is required'
            });
        }

        console.log(`[CHAT] Received question: "${question}"`);
        const startTime = Date.now();

        const data = await chatWithRAG(question);

        const elapsed = Date.now() - startTime;
        console.log(`[CHAT] Response generated in ${elapsed}ms`);

        res.status(200).json({
            status: 'success',
            data,
            error: null
        });
    } catch (error) {
        console.error('[CHAT] Error:', error.message);
        next(error);
    }
});

module.exports = router;
