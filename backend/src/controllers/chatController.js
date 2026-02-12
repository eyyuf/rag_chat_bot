const asyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Create a new conversation
const createConversation = asyncHandler(async (req, res) => {
    const conversation = await Conversation.create({ user: req.user._id });
    res.status(201).json(conversation);
});

// Send a message (user → AI)
const sendMessage = asyncHandler(async (req, res) => {
    const { conversationId, content } = req.body;

    // Store user message
    const userMessage = await Message.create({
        conversation: conversationId,
        role: "user",
        content,
    });

    // TODO: Call your RAG + LLM to generate AI response
    const aiResponseContent = "AI response goes here"; // replace with real RAG

    const aiMessage = await Message.create({
        conversation: conversationId,
        role: "assistant",
        content: aiResponseContent,
        sources: [], // fill with RAG sources
    });

    res.status(201).json({ userMessage, aiMessage });
});

// Get all messages of a conversation
const getConversationMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({ conversation: req.params.id });
    res.status(200).json(messages);
});

// Get all conversations of a user
const getUserConversations = asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({ user: req.user._id });
    res.status(200).json(conversations);
});

module.exports = {
    createConversation,
    sendMessage,
    getConversationMessages,
    getUserConversations,
};
