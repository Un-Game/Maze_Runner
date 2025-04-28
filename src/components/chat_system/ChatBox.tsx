import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:999");

    socketRef.current.on("chat-message", (message) => {
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
      socketRef.current.emit("chat-message", { text: input });
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-md h-[600px] p-4 bg-gradient-to-b from-pink-600/30 via-purple-600/30 to-black text-cyan-400 flex flex-col rounded-lg shadow-lg absolute bottom-0 right-0 m-12">
      <div className="flex-1 overflow-y-auto mb-2 pr-2">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`mb-2 p-2 rounded ${
              msg.userId === socketRef.current?.id 
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
          placeholder="Type a message..."
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