import { Settings } from "lucide-react"
import { Dispatch, SetStateAction } from "react";

type Props = {
    setMenuState: Dispatch<SetStateAction<string>>;
}

export default function MainMenu(props: Props) {
    const { setMenuState } = props;
    return (
        <div className="w-full h-[calc(100vh-100px)] flex items-start md:items-center justify-center">
            <div className="flex flex-col gap-[100px] items-center 2xl:mt-[-100px]">
            <div className="text-[70px] font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_20px_rgba(255,0,255,0.6)] text-center mt-[-100px]">Welcome to Maze Runner</div>
                <div className="flex flex-col gap-[30px]">
                    <button className="w-[1000px] py-5 text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 text-start px-[30px] flex gap-[20px]" onClick={()=>setMenuState("1")}><img src="multiplayer-icon.svg" className="w-[40px] h-[40px]"/>MULTIPLAYER</button>
                    <button className="w-[1000px] py-5 text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 text-start px-[30px] flex gap-[20px]" onClick={()=>setMenuState("2")}><img src="solo-icon.svg" className="w-[40px] h-[40px]"/>SOLO</button>
                    <button className="w-[1000px] py-5 text-4xl font-extrabold tracking-widest text-cyan-300 uppercase bg-black border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 text-start px-[30px] flex gap-[20px]" onClick={()=>setMenuState("3")}><Settings className="w-[40px] h-[40px]" stroke="white"/>SETTINGS</button>
                </div>
            </div>
        </div>
    )
}