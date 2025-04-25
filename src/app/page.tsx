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

export default function Game() {

  const [menuState, setMenuState] = useState("");

  useEffect(()=> {
    const token = localStorage.getItem("token");
    if(!token) {
      setMenuState("login")
    }else{
      setMenuState("");
    }
  },[])

  return menuState === "login" ? (
    <Login setMenuState={setMenuState}/>
  ) : (
    <div className="w-screen h-screen">
      <img src="./nature-background.jpg" className="w-full h-full absolute object-cover z-[-1] opacity-20"/>
      <Header setMenuState = {setMenuState}/>
      {menuState === "" && (<MainMenu setMenuState = {setMenuState}/>)}

      {menuState === "1" && (<Multiplayer setMenuState = {setMenuState} menuState = {menuState}/>)}
      {menuState === "2" && (<Solo setMenuState = {setMenuState} menuState = {menuState}/>)}
      {menuState === "3" && (<Settings setMenuState = {setMenuState} menuState = {menuState}/>)}

      {menuState === "21" && (<GameAreaPracticeMatter setMenuState = {setMenuState} menuState = {menuState}/>)}
      {menuState === "22" && (<GameAreaTest setMenuState = {setMenuState} menuState = {menuState}/>)}

      {menuState === "31" && (<MapMaker setMenuState = {setMenuState} menuState = {menuState}/>)}
    </div>
  );
}