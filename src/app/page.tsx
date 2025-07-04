"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MainMenu from "@/components/MainMenu";
import Multiplayer from "@/components/menu_multiplayer/Multiplayer";
import Solo from "@/components/menu_solo/Solo";
import Settings from "@/components/menu_settings/Settings";
import MapMaker from "@/components/map_maker/mapMaker";
import GameAreaTest from "@/components/game_container/game_area_test";
import GameAreaPracticeMatter from "@/components/game_container/game_area_practice";
import Login from "@/components/login/Login";
import Signup from "@/components/signup/Signup";
import { useUser } from "@/context/UserProvider";
import { UserRoundPlus } from "lucide-react";
import Friend_list from "@/components/friends_list/Friends_list";
import Key_Bind from "@/components/key_bind/key_bind";
import CustomGame from "@/components/custom_game/friendly_match";
import Edit_Profile from "@/components/profile/edit_profile";
import ChatBox from "@/components/chat_system/ChatBox";

export default function Game() {
  const [menuState, setMenuState] = useState("");
  const [friendMenu, setFriendMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const {user, refetchUser} = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMenuState("login");
    } else {
      setMenuState("");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex flex-col">
          <div className="border-t-[10px] border-cyan-400 bg-gradient-to-r from-purple-400 to-pink-400 w-[40px] h-[40px] rounded-full animate-spin"></div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return menuState === "login" ? (
    <Login setMenuState={setMenuState} />
  ) : menuState === "signup" ? (
    <Signup setMenuState={setMenuState} />
  ) : user ? (
    <div className="w-screen h-screen">
      {friendMenu && <Friend_list setFriendMenu={setFriendMenu} />}
      <img
        src="./nature-background.jpg"
        className="w-full h-full absolute object-cover z-[-1] opacity-20"
      />
      <Header setMenuState={setMenuState} />
      {menuState === "" && (<MainMenu setMenuState={setMenuState} />)}

      {menuState === "1" && (<Multiplayer setMenuState={setMenuState} menuState={menuState} />)}
      {menuState === "2" && (<Solo setMenuState={setMenuState} menuState={menuState} />)}
      {menuState === "3" && (<Settings setMenuState={setMenuState} menuState={menuState} />)}

      {menuState === "11" && (<CustomGame setMenuState={setMenuState} menuState={menuState}/>)}

      {menuState === "21" && (<GameAreaPracticeMatter setMenuState={setMenuState} menuState={menuState} />)}
      {menuState === "22" && (<GameAreaTest setMenuState={setMenuState} menuState={menuState} />)}

      {menuState === "31" && (<MapMaker setMenuState = {setMenuState} menuState = {menuState}/>)}
      {menuState === "32" && (<Key_Bind setMenuState = {setMenuState} menuState = {menuState}/>)}
      {menuState === "33" && (<Edit_Profile setMenuState = {setMenuState} menuState = {menuState}/>)}
      <ChatBox />
      <button
        className="flex gap-2 absolute right-0 bottom-0 p-5 bg-black/30 rounded-lg"
        onClick={() => setFriendMenu(true)}
      >
        <div>Friends</div>
        <UserRoundPlus />
      </button>
    </div>
  ) : null; // Return null when user is not logged in
}
