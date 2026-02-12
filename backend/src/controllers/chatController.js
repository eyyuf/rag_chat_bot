const asyncHandler = require("express-async-handler");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Chunk = require("../models/Chunk");

// Utility for similarity search (Dot Product)
const calculateSimilarity = (vecA, vecB) => {
    return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
};

// Create a new conversation
const createConversation = asyncHandler(async (req, res) => {
    const conversation = await Conversation.create({ user: req.user._id });
    res.status(201).json(conversation);
});

// Send a message (user → RAG AI)
const sendMessage = asyncHandler(async (req, res) => {
    const { conversationId, content } = req.body;

    // 1. Store user message in DB
    const userMessage = await Message.create({
        conversation: conversationId,
        role: "user",
        content,
    });

    try {
        // 2. Generate embedding for the user query using Voyager AI
        const embedResponse = await fetch("https://api.voyager.ai/v1/embeddings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.VOYAGER_AI_API_KEY}`
            },
            body: JSON.stringify({
                input: [content],
                model: "voyager-embed-v1"
            })
        });

        const embedResult = await embedResponse.json();
        const queryEmbedding = embedResult.data[0].embedding;

        // 3. Simple Vector Search (Retrieve chunks and score them)
        // Note: For production with many documents, use MongoDB Atlas Vector Search
        const chunks = await Chunk.find().lean();
        const scoredChunks = chunks.map(chunk => ({
            ...chunk,
            score: calculateSimilarity(queryEmbedding, chunk.embedding)
        }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3); // Get top 3 chunks

        const context = scoredChunks.map(c => c.text).join("\n\n");

        // 4. Generate AI response using Voyager AI Chat endpoint
        const chatResponse = await fetch("https://api.voyager.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.VOYAGER_AI_API_KEY}`
            },
            body: JSON.stringify({
                model: "voyager-chat-v1",
                messages: [
                    { role: "system", content: "You are a helpful assistant. Use the provided context to answer the user's question accurately." },
                    { role: "user", content: `Context:\n${context}\n\nQuestion: ${content}` }
                ]
            })
        });

        const chatResult = await chatResponse.json();
        const aiResponseContent = chatResult.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

        // 5. Save AI response and its sources
        const aiMessage = await Message.create({
            conversation: conversationId,
            role: "assistant",
            content: aiResponseContent,
            source: scoredChunks.map(c => ({
                documentId: c.documentId,
                textSnippet: c.text.substring(0, 100) + "..."
            })),
        });

        res.status(201).json({ userMessage, aiMessage });

    } catch (error) {
        console.error("RAG Error:", error);
        res.status(500);
        throw new Error(`Chat processing failed: ${error.message}`);
    }
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
