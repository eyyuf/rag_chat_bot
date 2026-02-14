const asyncHandler = require("../../middleware/asyncHandler");
const { Conversation, Message } = require("./chat.model");
const chatService = require("./chat.service");

// Send Message
const sendMessage = asyncHandler(async (req, res) => {
    let { conversationId, content } = req.body;
    if (!content) { res.status(400); throw new Error("Content is required"); }

    // Auto-create chat if missing
    if (!conversationId) {
        const chat = await Conversation.create({ user: req.user._id });
        conversationId = chat._id;
    }

    // 1. Save User Message
    const userMessage = await Message.create({
        conversation: conversationId,
        role: "user",
        content
    });

    // 2. RAG Logic
    const relevantChunks = await chatService.findRelevantChunks(content);
    let aiResponseContent = "";

    if (relevantChunks.length > 0) {
        const context = relevantChunks.map(c => c.text).join("\n\n");
        const aiResponse = await chatService.getGrokResponse(context, content);

        if (aiResponse) {
            aiResponseContent = aiResponse;
        } else {
            // Fallback to top chunk
            aiResponseContent = relevantChunks[0].text.substring(0, 500) + "...";
        }
    } else {
        aiResponseContent = "I don't have enough information to answer that based on the documents.";
    }

    // 3. Save AI Response
    const aiMessage = await Message.create({
        conversation: conversationId,
        role: "assistant",
        content: aiResponseContent
    });

    res.status(201).json({ userMessage, aiMessage });
});

// Get User Conversations
const getUserConversations = asyncHandler(async (req, res) => {
    const chats = await Conversation.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(chats);
});

// Get Messages
const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 });
    res.status(200).json(messages);
});

module.exports = { sendMessage, getUserConversations, getMessages };
