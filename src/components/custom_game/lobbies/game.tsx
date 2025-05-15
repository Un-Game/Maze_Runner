import { useEffect, useState } from "react";
import GameAreaMultiplayer from "../game_folder/game_logic";
import axios from "axios";

export default function Ingame(props) {

    const {lobbyInfo, setUserStatus} = props;
    const [lobby, setLobby] = useState(null);
    const [loading, setLoading] = useState(true);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(()=>{

        const fetchLobby = async()=>{
            try{
                const response = await axios.get(`${BASE_URL}/lobby/${lobbyInfo}`);
                setLobby(response.data);
                setLoading(false);
            }catch(err){
                console.log(err);
            }
        }

        fetchLobby();
    },[])
    

    return loading ? <div className="w-full h-full items-center justify-center bg-black">
        <div className="text-[30px] text-cyan-300">Loading...</div>
    </div> : <div className="w-full h-full justify-center items-center">
        <GameAreaMultiplayer lobby={lobby} setUserStatus={setUserStatus}/>
    </div>
}