const express = require("express");
const router = express.Router();

const {
    createConversation,
    sendMessage,
    getConversationMessages,
    getUserConversations
} = require("../controllers/chatController");

const { protect } = require("../middleWare/authMiddleware");

// Create a new conversation
router.post("/conversation", protect, createConversation);

// Get all conversations of current user
router.get("/conversation", protect, getUserConversations);

// Get messages in a conversation
router.get("/conversation/:id", protect, getConversationMessages);

// Send a message (user → AI)
router.post("/message", protect, sendMessage);

module.exports = router;
