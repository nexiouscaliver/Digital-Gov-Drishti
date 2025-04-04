"use client";
import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { FloatingActionButton } from "@/components/user/feed/FloatingActionButton";
import ChatBot from "./ChatBot";

const ChatBotButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <FloatingActionButton
        onClick={handleToggleChat}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg hover:shadow-blue-500/20"
      >
        <FaRobot size={24} />
      </FloatingActionButton>
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default ChatBotButton;