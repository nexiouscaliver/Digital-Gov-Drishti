"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaPaperPlane, FaRobot, FaInfoCircle } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "next/navigation";

// Define user information type
type UserInfo = {
  viewedPages: string[];
  lastInteraction: Date;
  preferredTopics?: string[];
};

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
};

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Website context information for the chatbot
const WEBSITE_CONTEXT = `
You are the Digital Gov Drishti assistant, a helpful chatbot for a government complaint and issue reporting platform.
Here's some information about the platform:

- Digital Gov Drishti is a platform for citizens to report complaints, issues, and suggestions to government authorities.
- The platform features: My Feed (view posts from other citizens), Hot Topics (trending issues), Complaints (file and track complaints), and Profile sections.
- Users can submit complaints about infrastructure, utilities, public services, safety issues, environmental concerns, etc.
- Complaints go through stages: Submitted → Assigned → Review → Forwarded → Resolved.
- Users can collaborate on issues, provide witnesses/proof, and track progress.

Navigation guidance:
- My Feed: Browse and interact with other citizen's reports and complaints
- Hot Topics: Find trending issues in your area that need attention
- Submit Complaint: File a new complaint with the authorities
- Track Complaints: Follow the status of your submitted complaints

When helping users:
1. Be friendly, professional, and concise
2. Provide clear navigation guidance when asked about website features
3. Don't make up features that don't exist on the platform
4. When in doubt, suggest visiting relevant sections of the website
5. Maintain the context of the conversation
`;

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
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
  const [userInfo, setUserInfo] = useState<UserInfo>({
    viewedPages: [],
    lastInteraction: new Date(),
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track current page for context
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (!userInfo.viewedPages.includes(currentPath)) {
      setUserInfo(prev => ({
        ...prev,
        viewedPages: [...prev.viewedPages, currentPath],
        lastInteraction: new Date(),
      }));
    }
  }, [userInfo.viewedPages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to get conversation history in a format suitable for the AI
  const getConversationHistory = () => {
    // Only include the last 10 messages to avoid token limits
    const recentMessages = messages.slice(-10);
    return recentMessages.map(msg => msg.content).join("\n");
  };

  // Function to extract user preferences from conversation
  const updateUserPreferences = (userMessage: string) => {
    // Simple keyword-based preference extraction
    const topicKeywords = {
      infrastructure: ["road", "bridge", "construction", "building"],
      utilities: ["water", "electricity", "power", "gas", "supply"],
      safety: ["crime", "theft", "accident", "safety", "security"],
      environment: ["pollution", "waste", "garbage", "tree", "park"],
    };

    const messageLower = userMessage.toLowerCase();
    const detectedTopics: string[] = [];

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => messageLower.includes(keyword))) {
        detectedTopics.push(topic);
      }
    });

    if (detectedTopics.length > 0) {
      setUserInfo(prev => {
        // Create a combined array of existing and new topics
        const existingTopics = prev.preferredTopics || [];
        const combinedTopics = [...existingTopics, ...detectedTopics];
        
        // Filter for unique topics without using Set
        const uniqueTopics = combinedTopics.filter((topic, index) => 
          combinedTopics.indexOf(topic) === index
        );
        
        return {
          ...prev,
          preferredTopics: uniqueTopics,
          lastInteraction: new Date(),
        };
      });
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
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

    // Update user preferences based on message
    updateUserPreferences(input);

    try {
      // Get API key from environment variable
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error("API key is not configured");
      }

      // Initialize the Google Generative AI with the API key
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Create generative model with the correct model name
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: {
          role: "system",
          parts: [{ text: WEBSITE_CONTEXT }],
        },
      });
      
      // Prepare chat history and user context
      const conversationHistory = getConversationHistory();
      const currentPage = window.location.pathname;
      const userContext = `
        User is currently on: ${currentPage}
        Previously viewed pages: ${userInfo.viewedPages.join(", ")}
        User interests: ${userInfo.preferredTopics ? userInfo.preferredTopics.join(", ") : "Not yet determined"}
      `;
      
      // Combined prompt with context
      const contextualPrompt = `
        [Conversation History]
        ${conversationHistory}
        
        [User Context]
        ${userContext}
        
        [Current User Question]
        ${input}
      `;
      
      // Generate content from the model
      const result = await model.generateContent(contextualPrompt);
      const response = result.response;
      const text = response.text();

      // Check for navigation commands in response
      const navigationCommands = {
        "GO_TO_FEED": "/",
        "GO_TO_HOT_TOPICS": "/hot-topic",
        "GO_TO_COMPLAINTS": "/complaints",
        "GO_TO_PROFILE": "/profile",
      };

      // Check if the response contains navigation commands
      let finalText = text;
      Object.entries(navigationCommands).forEach(([command, path]) => {
        if (text.includes(command)) {
          // Remove the command from the displayed text
          finalText = text.replace(command, "");
          // Schedule navigation after the message is displayed
          setTimeout(() => handleNavigation(path), 1500);
        }
      });

      const botMessage: Message = {
        content: finalText.trim(),
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

  // Suggested questions based on current page and user context
  const getSuggestedQuestions = () => {
    const currentPath = window.location.pathname;
    
    if (currentPath === "/") {
      return [
        "How do I submit a new complaint?",
        "What are hot topics?",
        "How can I collaborate on an issue?",
      ];
    } else if (currentPath.includes("hot-topic")) {
      return [
        "Why are these topics trending?",
        "How can I add my input to a hot topic?",
        "How do topics become 'hot'?",
      ];
    } else if (currentPath.includes("complaints")) {
      return [
        "How do I track my complaint?",
        "What are the stages of complaint resolution?",
        "Can I add more information to my complaint?",
      ];
    }
    
    return [
      "What can I do on Digital Gov Drishti?",
      "How do I navigate the platform?",
      "What type of issues can I report?",
    ];
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
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

          {/* Suggested Questions */}
          {messages.length < 3 && (
            <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/80">
              <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {getSuggestedQuestions().map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-full px-3 py-1 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

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