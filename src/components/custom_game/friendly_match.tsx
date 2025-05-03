import { useUser } from "@/context/UserProvider";
import BackButton from "../_components/back_button";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function CustomGame(props) {

    const {setMenuState, menuState} = props;
    const socketLobby = useRef(null);
    const user = useUser();

    return (
        <div>
            <BackButton setMenuState={setMenuState} menuState={menuState}/>
            <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center">
                <div className="flex gap-[50px] h-fit mt-[50px]">
                    <button className="py-[10px] px-[20px] rounded-[5px] bg-cyan-700">Create Lobby</button>
                    <div className="text-[40px]">or</div>
                    <div className="flex gap-[20px]">
                        <input type="text" className="border outline-none rounded-[5px] w-[300px] text-[20px] px-[15px]" placeholder="Join existing lobby"/>
                        <button className="py-[10px] px-[20px] rounded-[5px] bg-cyan-700">Join lobby</button>
                    </div>
                </div>
            </div>
        </div>
    )
}