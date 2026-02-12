import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const scrollRef = useRef();

    // Init conversation
    useEffect(() => {
        if (isOpen && !conversationId) {
            startChat();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const startChat = async () => {
        try {
            const res = await api.post('/chat/conversation');
            setConversationId(res.data._id);
            // Optionally load existing history if needed, but here we start fresh
        } catch (err) {
            console.error('Failed to start chat', err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat/message', {
                conversationId,
                content: input
            });

            setMessages(prev => [...prev, res.data.aiMessage]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error processing your request.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-widget">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="chat-window glass-morphism"
                    >
                        <header className="chat-header">
                            <div className="bot-info">
                                <Bot size={24} />
                                <div>
                                    <h3>Voyager AI</h3>
                                    <span className="status">Online</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="close-btn">
                                <ChevronDown />
                            </button>
                        </header>

                        <div className="chat-messages" ref={scrollRef}>
                            {messages.length === 0 && (
                                <div className="welcome-msg">
                                    <Bot size={48} />
                                    <p>Hello! I'm your AI assistant. Ask me anything about your uploaded documents.</p>
                                </div>
                            )}
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message-wrapper ${msg.role}`}>
                                    <div className="avatar">
                                        {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className="message-content">
                                        <p>{msg.content}</p>
                                        {msg.source && msg.role === 'assistant' && msg.source.length > 0 && (
                                            <div className="sources">
                                                <span>Sources:</span>
                                                <ul>
                                                    {msg.source.map((s, i) => (
                                                        <li key={i}>{s.textSnippet}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="message-wrapper assistant">
                                    <div className="avatar"><Bot size={16} /></div>
                                    <div className="typing-indicator">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form className="chat-input" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Ask a question..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" disabled={!input || loading}>
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="chat-toggle-btn"
                    >
                        <MessageSquare size={28} />
                    </motion.button>
                )}
            </AnimatePresence>

            <style jsx>{`
                .chat-widget {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 1000;
                }
                .chat-toggle-btn {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
                }
                .chat-window {
                    width: 400px;
                    height: 600px;
                    border-radius: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }
                .chat-header {
                    padding: 1.25rem;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .bot-info { display: flex; align-items: center; gap: 0.75rem; }
                .bot-info h3 { font-size: 1rem; margin: 0; }
                .bot-info .status { font-size: 0.7rem; opacity: 0.8; }
                .close-btn { background: none; color: white; }

                .chat-messages {
                    flex: 1;
                    padding: 1.5rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    background: #0f172a;
                }
                .welcome-msg { text-align: center; color: var(--text-muted); margin-top: 4rem; }
                .welcome-msg p { margin-top: 1rem; font-size: 0.9rem; }

                .message-wrapper { display: flex; gap: 0.75rem; max-width: 85%; }
                .message-wrapper.user { align-self: flex-end; flex-direction: row-reverse; }
                
                .avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: var(--bg-card);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .user .avatar { background: var(--primary); }

                .message-content {
                    padding: 0.75rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                .assistant .message-content { background: var(--bg-card); border-bottom-left-radius: 0.2rem; }
                .user .message-content { background: var(--primary); color: white; border-bottom-right-radius: 0.2rem; }

                .sources {
                    margin-top: 0.75rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid var(--border);
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                .sources span { font-weight: 600; display: block; margin-bottom: 0.25rem; }
                .sources ul { list-style: none; padding: 0; }
                .sources li { margin-bottom: 0.2rem; font-style: italic; }

                .chat-input {
                    padding: 1rem;
                    background: var(--bg-card);
                    display: flex;
                    gap: 0.5rem;
                }
                .chat-input input { flex: 1; height: 40px; }
                .chat-input button {
                    width: 40px;
                    height: 40px;
                    border-radius: 0.5rem;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .typing-indicator { display: flex; gap: 4px; padding: 8px 0; }
                .typing-indicator span {
                    width: 6px; height: 6px; background: var(--text-muted);
                    border-radius: 50%; animation: bounce 1.4s infinite ease-in-out;
                }
                .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }

                @media (max-width: 500px) {
                    .chat-window { width: calc(100vw - 2rem); height: 400px; }
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;
