import { useUser } from "@/context/UserProvider";
import { MessageCircleMore, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSocket } from "@/context/SocketContext";

export default function ChatBox(props) {

  const [messages, setMessages] = useState([]);
  const [dms, setDms] = useState({});
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("global");
  const [activeUser, setActiveUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useSocket();

  const user = useUser();

  useEffect(() => {
    // // socketRef.current = io("https://maze-runner-backend-1.onrender.com", {
    // socketRef.current = io("http://localhost:999",{
    //   withCredentials: true
    // });


    if(!socket) return;

    socket.on("chat:message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("chat:dm", (dm) => {
      console.log(dm);

      setDms((prevDmsObj) => {
        const newDmsObj = { ...prevDmsObj };

        const currentUserId = user._id;
        const conversationPartnerId = dm.userId === currentUserId ? dm.to : dm.userId;

        if (newDmsObj[conversationPartnerId]) {
          newDmsObj[conversationPartnerId] = [...newDmsObj[conversationPartnerId], dm];
        } else {
          newDmsObj[conversationPartnerId] = [dm];
        }

        return newDmsObj;
      });
    });
    // return () => {
    //   socketRef.current.disconnect();
    // };
  }, [socket]);
  


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showChat]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dms, activeUser, showChat]);

  const handleSendMessage = () => {
    if (socket && input.trim() !== "") {
      if (activeTab === "global") {
        socket.emit("chat:message", { text: input, sender: user.username, channel: "global" });
      } else {
        socket.emit("chat:dm", { text: input, sender: user.username, to: activeUser[0] })
      }
      setInput("");
    }
  };

  //680f6b6f29f03262ff0f44ae

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const tabs = [
    { id: "global", label: "Global" },
    { id: "private", label: "Private" }
  ];

  return showChat ? (
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
              className={`relative w-full py-2 text-sm font-medium transition-colors duration-200 z-10 ${activeTab === tab.id ? "text-white" : "text-gray-400"
                }`}
              onClick={() => { setActiveTab(tab.id); setActiveUser(null) }}
            >
              {tab.label}
            </button>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto mb-2 pr-2 chat-scroll">
        {activeTab === "global" ?
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded max-w-xs ${msg.userId === user._id
                ? "bg-cyan-900 ml-auto"
                : "bg-gray-900 mr-auto"
                }`}
            >
              <div className="text-[15px] text-gray-500">{msg.sender}</div>
              <div>{msg.text}</div>
              <div className="text-xs text-gray-500 mt-1 text-end">
                {msg.userId !== "system" && msg.timestamp
                  ? new Date(msg.timestamp).toLocaleTimeString()
                  : null}
              </div>
            </div>
          )) : activeUser === null ?
            user.friends.map((friend, index) => (
              <div key={index} className="w-full my-[10px] p-[10px] py-[15px] rounded-[5px] bg-black/50 flex gap-[20px] cursor-pointer" onClick={() => setActiveUser([friend._id, friend.username, friend.avatar])}>
                <div className="w-[30px] h-[30px] rounded-full">
                  <img src={friend.avatar ? friend.avatar : "./globe.svg"} className="w-full h-full object-cover"/>
                </div>
                <div>{friend.username}</div>
              </div>
            ))
            : (
              <>
                <div className="w-full h-[40px] bg-white/20 sticky top-0 flex items-center gap-[15px] px-[10px] rounded-[5px] backdrop-blur-[10px] mb-[10px]">
                  <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                    <img src={activeUser[2] ? activeUser[2] : "./globe.svg"}/>
                  </div>
                  <div>{activeUser[1]}</div>
                </div>
                {dms[activeUser[0]] && dms[activeUser[0]].map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 rounded max-w-xs ${msg.userId === user._id
                      ? "bg-cyan-900 ml-auto"
                      : "bg-gray-900 mr-auto"
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.userId !== "system" && msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString()
                        : null}
                    </div>
                  </div>
                ))}
              </>
            )
        }
        <div ref={messagesEndRef} />
      </div>

      {activeTab === "global" || activeUser ? <div className="flex h-10 gap-2">
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
      </div> : null}
    </div>
  ) : (
    <button className="flex gap-2 absolute right-0 bottom-16 p-5 bg-black/30 rounded-lg" onClick={() => setShowChat(true)}>
      <div>Chat</div>
      <MessageCircleMore />
    </button>)
}