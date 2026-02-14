import "../../styles/chat.css";

const MessageBubble = ({ role, content }) => {
    return (
        <div className={`message-bubble ${role === "user" ? "message-user" : "message-assistant"}`}>
            <div className="message-content">{content}</div>
        </div>
    );
};

export default MessageBubble;
