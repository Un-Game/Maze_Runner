"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

type Keybinds = {
  up: string;
  down: string;
  left: string;
  right: string;
  skillOne: string;
  skillTwo: string;
  skillThree: string;
};

type KeyBindContextType = {
  keybinds: Keybinds;
  updateKeybind: (key: keyof Keybinds, value: string) => void;
};

const Key_Bind_Context = createContext<KeyBindContextType | undefined>(
  undefined
);

export const useKeyBind = () => {
  const context = useContext(Key_Bind_Context);
  if (!context)
    throw new Error("useKeyBind must be used within a KeyBindProvider");
  return context;
};

export const KeyBindProvider = ({ children }: { children: ReactNode }) => {
  const [keybinds, setKeybinds] = useState<Keybinds>({
    up: "w",
    down: "s",
    left: "a",
    right: "d",
    skillOne: "c",
    skillTwo: "f",
    skillThree: "t",
  });

  const updateKeybind = (key: keyof Keybinds, value: string) => {
    setKeybinds((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Key_Bind_Context.Provider value={{ keybinds, updateKeybind }}>
      {children}
    </Key_Bind_Context.Provider>
  );
};
