"use client";
import { useKeyBind } from "@/context/KeybindContext";


const Save_button = () => {
  const { saveKeybinds } = useKeyBind();
  return (
    <div>
      <button
        onClick={() => saveKeybinds()}
        className="flex flex-col mt-[25px] p-20 w-[800px] py-5 text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] transition-transform duration-300 text-center px-[30px] justify-center gap-[20px] cursor-pointer"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Save_button;
