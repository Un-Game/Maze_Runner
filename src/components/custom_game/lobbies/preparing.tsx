import { PlusCircleIcon } from "lucide-react";

export default function Lobby(props) {

    const { lobbyInfo, setUserStatus } = props;

    const leave = () => {
        setUserStatus("menu");
    }


    return (
        <div className="w-full h-[calc(100vh-100px)] flex items-center overflow-auto flex-col gap-[40px]">
            <div className="w-[900px] flex justify-between mt-[70px]">
                <div className="text-[22px] flex text-cyan-400 gap-[15px]">Room name: <div className="text-white">{lobbyInfo.name}</div></div>
                <div className="text-[22px] flex text-cyan-400 gap-[15px]">Join code: <div className="text-white">{lobbyInfo.joinCode}</div></div>
            </div>
            <div className="w-[900px] h-[500px] bg-white/20 flex rounded-[10px] mt-[-20px] overflow-hidden">
                <div className="w-1/2 h-full bg-cyan-500/10 p-[50px]">
                    <div className="w-full h-full flex flex-col">
                        <div className="w-full h-fit flex flex-col gap-[30px] items-center">
                            <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                                <img src={lobbyInfo.players[0].avatar} />
                            </div>
                            <div className="flex text-[30px] gap-[20px] flex-wrap text-cyan-400">Player 1: <div className="text-white">{lobbyInfo.players[0].username}</div></div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 h-full p-[50px]">
                    <div className="w-full h-full flex flex-col">
                        {lobbyInfo.players[1] ? <div className="w-full h-fit flex flex-col gap-[30px] items-center">
                            <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                                <img src={lobbyInfo.players[1].avatar} />
                            </div>
                            <div className="flex text-[30px] gap-[20px] flex-wrap text-cyan-400">Player 2: <div className="text-white">{lobbyInfo.players[1].username}</div></div>
                        </div> : 
                        <div className="w-full h-full flex flex-col justify-center items-center gap-[10px]">
                            <PlusCircleIcon size={72} stroke="#4CAF50"/>
                            <div className="text-[30px] text-center text-[#4CAF50]">Invite your friends</div>
                        </div>}
                    </div>
                </div>
            </div>
            <div className="flex text-[20px] gap-[50px]">
                <button className="w-[300px] bg-red-500/80 rounded-[10px] text-[35px]" onClick={()=>leave()}>Leave</button>
                <button className="w-[300px] bg-cyan-600/80 rounded-[10px] text-[35px]">Start</button>
            </div>
        </div>
    )
}