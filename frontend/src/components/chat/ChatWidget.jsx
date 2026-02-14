import { useState } from "react";
import ChatWindow from "./ChatWindow";
import "../../styles/chat.css";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {!isOpen && (
                <button className="chat-widget-button" onClick={() => setIsOpen(true)}>
                    💬
                </button>
            )}
            <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default ChatWidget;
