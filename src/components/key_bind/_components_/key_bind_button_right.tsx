"use client";
import { useKeyBind } from "@/context/KeybindContext";
import { useEffect } from "react";

const KB_button = () => {
  const { keybinds, updateKeybind } = useKeyBind();

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow only letters, and store them in uppercase
    if (/^[a-zA-Z]$/.test(value)) {
      updateKeybind("right", value.toUpperCase());
    } else if (value === "") {
      updateKeybind("right", "");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === keybinds.right) {
        console.log("right key pressed");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keybinds.right]);

  return (
    <div className="flex flex-col mt-[25px] p-20 w-[800px] py-5 text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] transition-transform duration-300 text-start px-[30px] justify-start gap-[20px]">
      <div className="w-full flex gap-20 justify-between">
        <div className="flex items-start justify-start">
          <h3>right:</h3>
        </div>
        <div className="flex justify-end items-end pr-[100px]">
          <input
            className="w-[40px] text-center text-2xl uppercase caret-transparent outline-none cursor-pointer focus:outline-none"
            type="text"
            maxLength={1}
            value={keybinds.right}
            onChange={handleKeyChange}
            onFocus={() => {
              if (keybinds.right !== "") updateKeybind("right", "");
            }}
            onClick={() => {
              if (keybinds.right !== "") updateKeybind("right", "");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default KB_button;
