import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/context/UserProvider";
import axios from "axios";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Lobby(props) {

    const { lobbyInfo, setUserStatus } = props;
    const [lobby, setLobby] = useState(lobbyInfo);
    const {user, refetchUser} = useUser();
    const socket = useSocket();

    useEffect(()=>{
        if(!socket)
            return;

        // if(lobbyInfo.players[0].username !== user.username)

        socket.on("lobby:update", async()=> {
            const response = await axios.get(`https://maze-runner-backend-1.onrender.com/lobby/${lobby.joinCode}`);
            console.log(response.data);
            setLobby(response.data);
        })

        socket.on("lobby:start", ()=> {
            setUserStatus("game");
        })

    },[socket])


    const leave = () => {
        socket.emit("lobby:leave", {room: lobby.joinCode.toString()});
        setUserStatus("menu");
    }
    const start = () => {
        if(lobby.players.length!==2) return;
        socket.emit("lobby:start", {room: lobby.joinCode.toString()});
    }
    


    return (
        <div className="w-full h-[calc(100vh-100px)] flex items-center overflow-auto flex-col gap-[40px]">
            <div className="w-[900px] flex justify-between mt-[70px]">
                <div className="text-[22px] flex text-cyan-400 gap-[15px]">Room name: <div className="text-white">{lobby.name}</div></div>
                <div className="text-[22px] flex text-cyan-400 gap-[15px]">Join code: <div className="text-white">{lobby.joinCode}</div></div>
            </div>
            <div className="w-[900px] h-[500px] bg-white/20 flex rounded-[10px] mt-[-20px] overflow-hidden">
                <div className="w-1/2 h-full bg-cyan-500/10 p-[50px]">
                    <div className="w-full h-full flex flex-col">
                        <div className="w-full h-fit flex flex-col gap-[30px] items-center">
                            <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                                <img src={lobby.players[0].avatar ? lobby.players[0].avatar : "./globe.svg"} />
                            </div>
                            <div className="flex text-[30px] gap-[20px] flex-wrap text-cyan-400">Player 1: <div className="text-white">{lobby.players[0].username}</div></div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 h-full p-[50px]">
                    <div className="w-full h-full flex flex-col">
                        {lobby.players[1] ? <div className="w-full h-fit flex flex-col gap-[30px] items-center">
                            <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                                <img src={lobby.players[1].avatar ? lobby.players[1].avatar : "./globe.svg"} />
                            </div>
                            <div className="flex text-[30px] gap-[20px] flex-wrap text-cyan-400">Player 2: <div className="text-white">{lobby.players[1].username}</div></div>
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
                {lobby.players[0].username === user.username &&  <button className={`w-[300px] bg-cyan-600/80 rounded-[10px] text-[35px] ${lobby.players.length!==2 && "bg-gray-500"}`} onClick={()=>start()}>Start</button>}
            </div>
        </div>
    )
}