"use client";
import { useUser } from "./UserProvider";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type Keybinds = {
  up: string;
  down: string;
  left: string;
  right: string;
  skill1: string;
  skill2: string;
  skill3: string;
};

const defaultKeybinds: Keybinds = {
  up: "w",
  down: "s",
  left: "a",
  right: "d",
  skill1: "c",
  skill2: "f",
  skill3: "t",
};

type KeyBindContextType = {
  keybinds: Keybinds;
  updateKeybind: (key: keyof Keybinds, value: string) => void;
  saveKeybinds: () => Promise<void>;
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
  const [keybinds, setKeybinds] = useState<Keybinds>(defaultKeybinds);
  const user = useUser();

  const updateKeybind = (key: keyof Keybinds, value: string) => {
    setKeybinds((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchKeybinds = async () => {
      const currentUserId = user._id;
      try {
        const res = await fetch(`http://localhost:999/user/${currentUserId}`);
        if (!res.ok) throw new Error("Failed to fetch keybinds");
        const data = await res.json();

        if (data.control) {
          setKeybinds(data.control);
        }
      } catch (err) {
        console.error("Failed to load keybinds", err);
      }
    };

    if (user?._id) {
      fetchKeybinds();
    }
  }, [user]);

  const saveKeybinds = async () => {
    const currentUserId = user._id;

    try {
      const res = await fetch(`http://localhost:999/user/${currentUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ control: keybinds }),
      });
      if (!res.ok) throw new Error("Failed to save keybinds");
      alert("Keybinds saved successfully!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save keybinds");
    }
  };

  return (
    <Key_Bind_Context.Provider
      value={{ keybinds, updateKeybind, saveKeybinds }}
    >
      {children}
    </Key_Bind_Context.Provider>
  );
};
