import { useUser } from "@/context/UserProvider";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

export default function ChatBox(props) {
  const { setShowChat } = props;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("global");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const user = useUser();

  useEffect(() => {
    socketRef.current = io("http://localhost:999", {
      withCredentials: true
    });
    socketRef.current.emit("identify", user._id);

    socketRef.current.on("chat:message", (message) => {
      console.log(message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (socketRef.current && input.trim() !== "") {
      socketRef.current.emit("chat:message", { text: input, channel: activeTab });
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const tabs = [
    { id: "global", label: "Global" },
    { id: "local", label: "Local" },
    { id: "private", label: "Private" }
  ];

  return (
    <div className="w-full max-w-md h-[600px] p-4 bg-gradient-to-b from-pink-600/30 via-purple-600/30 to-black text-cyan-400 flex flex-col rounded-lg shadow-lg absolute bottom-0 right-0 my-18">
      <button
        className="absolute top-0 right-0 w-[40px] h-[40px] p-[8px] rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 transition duration-500 m-[10px]"
        onClick={() => {
          setShowChat(false);
        }}
      >
        <X />
      </button>

      <div className="flex mb-4 bg-gray-900/50 rounded-lg p-1 w-[370px]">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative flex-1">
            {activeTab === tab.id && (
              <motion.div
                className="absolute inset-0 bg-cyan-700 rounded-md"
                layoutId="activeTab"
                initial={false}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <button
              className={`relative w-full py-2 text-sm font-medium transition-colors duration-200 z-10 ${
                activeTab === tab.id ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto mb-2 pr-2 chat-scroll">
        {messages
          .filter(msg => !msg.channel || msg.channel === activeTab)
          .map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 rounded ${
                msg.userId === user._id
                  ? "bg-cyan-900 ml-auto max-w-xs"
                  : "bg-gray-900 max-w-xs"
              }`}
            >
              {msg.text}
              <div className="text-xs text-gray-500 mt-1">
                {msg.userId !== "system" && new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex h-10 gap-2">
        <input
          id="chat_input"
          type="text"
          className="flex-1 px-3 py-2 bg-gray-900 text-white outline-none rounded"
          placeholder={`Message ${activeTab} channel...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}