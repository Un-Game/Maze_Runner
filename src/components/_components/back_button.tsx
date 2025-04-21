import { MoveLeft } from "lucide-react"

export default function BackButton(props: { setMenuState: React.Dispatch<React.SetStateAction<string>> }) {
    const { setMenuState } = props;
    return (
        <button className="bg-black w-[150px] h-[80px] flex justify-center items-center rounded-[20px] border-2 border-cyan-400 shadow-[0_0_20px_#00ffff] hover:scale-105 hover:shadow-[0_0_40px_#00ffff] transition-transform duration-300 m-[30px] absolute" onClick={()=>setMenuState("0")}>
            <div className="text-[30px] bg-gradient-to-b from-blue-800 via-blue-500 to-white bg-clip-text text-transparent">Back</div>
        </button>
    )
}