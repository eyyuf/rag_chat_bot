import { useState, useRef, useEffect } from "react";
import chatService from "../../services/chat.service";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import "../../styles/chat.css";

const ChatWindow = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");

        // Add user message to UI
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const response = await chatService.sendMessage(conversationId, userMessage);

            // Save conversation ID if new
            if (!conversationId && response.userMessage?.conversation) {
                setConversationId(response.userMessage.conversation);
            }

            // Add AI response
            if (response.aiMessage) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: response.aiMessage.content },
                ]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, something went wrong." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-window">
            <div className="chat-header">
                <h3>RAG Assistant</h3>
                <button onClick={onClose} className="chat-close">×</button>
            </div>
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} role={msg.role} content={msg.content} />
                ))}
                {loading && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask me anything..."
                    className="chat-input"
                    disabled={loading}
                />
                <button onClick={handleSend} disabled={loading} className="chat-send">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
