"use client";
import { useKeyBind } from "@/context/KeybindContext";
import { useEffect } from "react";

const KB_button_l = () => {
  const { keybinds, updateKeybind } = useKeyBind();

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^[a-zA-Z]$/.test(value)) {
      updateKeybind("left", value);
    } else if (value === "") {
      updateKeybind("left", "");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === keybinds.left) {
        console.log("left key pressed");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keybinds.left]);

  return (
    <div className="flex flex-col mt-[25px] p-20 w-[800px] py-5 text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] transition-transform duration-300 text-start px-[30px] justify-start gap-[20px]">
      <div className="w-full flex gap-20 justify-between">
        <div className="flex items-start justify-start">
          <h3>left:</h3>
        </div>
        <div className="flex justify-end items-end pr-[100px]">
          <input
            className="w-[40px] text-center text-2xl uppercase caret-transparent outline-none cursor-pointer focus:outline-none"
            type="text"
            maxLength={1}
            value={keybinds.left}
            onChange={handleKeyChange}
            onFocus={() => {
              if (keybinds.left !== "") updateKeybind("left", "");
            }}
            onClick={() => {
              if (keybinds.left !== "") updateKeybind("left", "");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default KB_button_l;
