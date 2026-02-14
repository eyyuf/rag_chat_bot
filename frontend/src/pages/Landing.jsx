import ChatWidget from "../components/chat/ChatWidget";

const Landing = () => {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <h1>Welcome to RAG Chat</h1>
                <p>Ask questions about your uploaded documents using AI.</p>
                <p className="landing-hint">Click the chat button to start 💬</p>
            </div>
            <ChatWidget />
        </div>
    );
};

export default Landing;
