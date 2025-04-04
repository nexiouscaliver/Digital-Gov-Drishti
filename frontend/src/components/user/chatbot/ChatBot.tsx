"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaPaperPlane, FaRobot, FaInfoCircle } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
};

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your Digital Gov Drishti assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get API key from environment variable
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("API key is not configured");
      }

      // Initialize the Google Generative AI with the API key
      const genAI = new GoogleGenerativeAI(apiKey);
      // Get the generative model - using the correct model name for v1beta API
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Generate content from the model
      const result = await model.generateContent(input);
      const response = result.response;
      const text = response.text();

      const botMessage: Message = {
        content: text,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setApiKeyError(false);
    } catch (error) {
      console.error("Error generating response:", error);
      
      let errorMessage = "Sorry, I encountered an error. Please try again later.";
      
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = "The chatbot is not properly configured. Please add your Gemini API key to the environment variables.";
          setApiKeyError(true);
        } else if (error.message.includes("not found for API version")) {
          errorMessage = "The Gemini model could not be found. The API may have been updated or the model name changed.";
        }
      }
      
      const errorResponse: Message = {
        content: errorMessage,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 h-[500px] bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-gradient-to-r from-blue-600 to-cyan-600">
            <div className="flex items-center">
              <FaRobot className="text-white mr-2 text-lg" />
              <h3 className="font-medium text-white">Digital Drishti Assistant</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaTimes />
            </motion.button>
          </div>

          {/* API Key Error Banner */}
          {apiKeyError && (
            <div className="bg-red-900/60 px-4 py-2 flex items-center text-white text-sm">
              <FaInfoCircle className="mr-2 text-red-300" />
              <p>Please add a valid Gemini API key to your environment variables as NEXT_PUBLIC_GEMINI_API_KEY</p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-zinc-950 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 max-w-[85%] ${
                  msg.isUser ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl shadow-md ${
                    msg.isUser
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none"
                      : "bg-zinc-800 text-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <div
                  className={`text-xs mt-1 text-gray-500 ${
                    msg.isUser ? "text-right" : "text-left"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 max-w-[85%] mr-auto">
                <div className="p-3 rounded-2xl shadow-md bg-zinc-800 text-gray-200 rounded-tl-none flex items-center space-x-2">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900">
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-l-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-r-lg disabled:opacity-50"
              >
                <FaPaperPlane />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      <style jsx global>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: #9ca3af;
          border-radius: 50%;
          display: inline-block;
          opacity: 0.6;
        }
        
        .typing-indicator span:nth-child(1) {
          animation: bounce 1.2s infinite 0.1s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation: bounce 1.2s infinite 0.3s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation: bounce 1.2s infinite 0.5s;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </>
  );
};

export default ChatBot;