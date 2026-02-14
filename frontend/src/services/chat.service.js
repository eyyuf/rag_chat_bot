import api from "../app/axios";

// Send message to chat API
const sendMessage = async (conversationId, content) => {
    const response = await api.post("/chat", { conversationId, content });
    return response.data;
};

// Get conversations
const getConversations = async () => {
    const response = await api.get("/chat/conversations");
    return response.data;
};

// Get messages for a specific conversation
const getMessages = async (id) => {
    const response = await api.get(`/chat/conversation/${id}`);
    return response.data;
};

const chatService = {
    sendMessage,
    getConversations,
    getMessages
};

export default chatService;
