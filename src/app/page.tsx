"use client";

import Header from "@/components/Header";
import MainMenu from "@/components/MainMenu";
import Multiplayer from "@/components/menu_multiplayer/Multiplayer";
import Solo from "@/components/menu_solo/Solo";
import Settings from "@/components/menu_settings/Settings";
import MapMaker from "@/components/map_maker/mapMaker";
import GameAreaTest from "@/components/game_container/game_area_test";
import GameAreaPracticeMatter from "@/components/game_container/game_area_practice";
import { useEffect, useState } from "react";
import Login from "@/components/login/Login";
import ChatBox from "@/components/chat_system/ChatBox";
import Signup from "@/components/signup/Signup";
import { useUser } from "@/context/UserProvider";
import { MessageCircleMore, UserRoundPlus } from "lucide-react";
import Friend_list from "@/components/friends_list/Friends_list";
import Key_Bind from "@/components/key_bind/key_bind";
import { AnimatePresence, motion } from "framer-motion";

export default function Game() {

  const [menuState, setMenuState] = useState("");
  const [friendMenu, setFriendMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const user = useUser();
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMenuState("login")
    } else {
      setMenuState("");
    }

    if (menuState !== "login" && menuState !== "signup") {
      window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          showChat ? null : setShowChat(true);
          document.getElementById("chat_input")?.focus();
        }
      });
    }
    return () => {
      window.removeEventListener("keydown", () => { document.getElementById("chat_input")?.focus(); });
    };

  }, [])

  return menuState === "login" ? (
    <Login setMenuState={setMenuState} />
  ) : menuState === "signup" ? (
    <Signup setMenuState={setMenuState} />
  ) : user ? (
    <div className="w-screen h-screen">
      {friendMenu && <Friend_list setFriendMenu={setFriendMenu} />}
      <img src="./nature-background.jpg" className="w-full h-full absolute object-cover z-[-1] opacity-20" />
      <Header setMenuState={setMenuState} />
      {menuState === "" && (<MainMenu setMenuState={setMenuState} />)}

      {menuState === "1" && (<Multiplayer setMenuState={setMenuState} menuState={menuState} />)}
      {menuState === "2" && (<Solo setMenuState={setMenuState} menuState={menuState} />)}
      {menuState === "3" && (<Settings setMenuState={setMenuState} menuState={menuState} />)}

      {menuState === "21" && (<GameAreaPracticeMatter setMenuState={setMenuState} menuState={menuState} />)}
      {menuState === "22" && (<GameAreaTest setMenuState={setMenuState} menuState={menuState} />)}

      {menuState === "31" && (<MapMaker setMenuState = {setMenuState} menuState = {menuState}/>)}
      {menuState === "32" && (<Key_Bind setMenuState = {setMenuState} menuState = {menuState}/>)}
        {showChat && 
        <AnimatePresence>
        {showChat && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.20 }}
          >
            <ChatBox setShowChat={setShowChat} />
          </motion.div>
        )}
      </AnimatePresence>}
        {!showChat && <button className="flex gap-2 absolute right-0 bottom-16 p-5 bg-black/30 rounded-lg" onClick={() => setShowChat(true)}>
          <div>Chat</div>
          <MessageCircleMore />
        </button>}
        <button className="flex gap-2 absolute right-0 bottom-0 p-5 bg-black/30 rounded-lg" onClick={() => setFriendMenu(true)}>
          <div>Friends</div>
          <UserRoundPlus />
        </button>
    </div>
  ) : (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col">
        <div className="border-t-[10px] border-cyan-400 bg-gradient-to-r from-purple-400 to-pink-400 w-[40px] h-[40px] rounded-full animate-spin"></div>
        <div>Loading...</div>
      </div>
    </div>
  );
}