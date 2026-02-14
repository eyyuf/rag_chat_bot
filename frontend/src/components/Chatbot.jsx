import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChatbubbleEllipses, IoClose, IoSend } from 'react-icons/io5';
import { chatAPI } from '../utils/api';
import '../styles/Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Ethiopia Travel assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const userQuestion = input;
        setInput('');
        setLoading(true);

        try {
            console.log('Sending chat message:', userQuestion);
            const { data } = await chatAPI.sendMessage(userQuestion);
            console.log('Chat response received:', data);

            // The backend returns { status: 'success', data: { answer, sources }, error: null }
            const result = data.data;

            if (!result || !result.answer) {
                throw new Error('Invalid response format from server');
            }

            const botMsg = {
                text: result.answer,
                sender: 'bot',
                sources: result.sources
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Chat error:', error);
            let errorMessage = "Sorry, I'm having trouble connecting right now.";

            if (error.code === 'ECONNABORTED') {
                errorMessage = "The request timed out. The AI might be taking too long to respond.";
            } else if (error.response) {
                errorMessage = `Server error: ${error.response.data?.error || error.response.statusText}`;
            } else if (error.request) {
                errorMessage = "No response from server. Please check if the backend is running.";
            }

            setMessages(prev => [...prev, { text: errorMessage, sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-widget">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chat-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    >
                        <div className="chat-header">
                            <span>Travel Assistant</span>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', color: 'white' }}>
                                <IoClose size={20} />
                            </button>
                        </div>

                        <div className="chat-messages">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message ${msg.sender}`}>
                                    {msg.text}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.8 }}>
                                            Sources: {msg.sources.map(s => `${s.filename} (p.${s.pageNumber})`).join(', ')}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="message bot">
                                    <div className="typing">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-footer" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Ask about Ethiopia..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" className="send-btn" disabled={loading}>
                                <IoSend size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <IoClose /> : <IoChatbubbleEllipses />}
            </button>
        </div>
    );
};

export default Chatbot;
