"use client";

import Header from "@/components/Header";
import MainMenu from "@/components/MainMenu";
import Multiplayer from "@/components/menu_multiplayer/Multiplayer";
import Solo from "@/components/menu_solo/Solo";
import Settings from "@/components/menu_settings/Settings";
import { useState } from "react";

export default function Game() {

  const [menuState, setMenuState] = useState("0");


  return (
    <div className="w-screen h-screen">
      <img src="./nature-background.jpg" className="w-full h-full absolute object-cover z-[-1] opacity-20"/>
      <Header setMenuState = {setMenuState}/>
      {menuState === "0" && (<MainMenu setMenuState = {setMenuState}/>)}
      {menuState === "1" && (<Multiplayer setMenuState = {setMenuState}/>)}
      {menuState === "2" && (<Solo setMenuState = {setMenuState}/>)}
      {menuState === "3" && (<Settings setMenuState = {setMenuState}/>)}
    </div>
  )
}