

import { useUser } from "@/context/UserProvider";
import BackButton from "../_components/back_button";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getMap } from "@/utils/mapRequest";
import { useFormik } from "formik";
import { createLobby } from "@/utils/lobbyRequest";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import Lobby from "./lobbies/preparing";
import { toast, ToastContainer } from "react-toastify";
import { Input } from "../ui/input";

export default function CustomGame(props) {
    const { setMenuState, menuState } = props;
    const [maps, setMaps] = useState([]);
    const [lobbies, setLobbies] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [userStatus, setUserStatus] = useState("menu");
    const [lobbyInfo, setLobbyInfo] = useState(null);
    const user = useUser();
    const socket = useSocket();

    useEffect(()=>{
        if(!socket) return;

        // socket.on("lobby:join",)

    },[socket])

    const handleSubmit = async (values) => {
        try {
            const response = await createLobby(values.players, values.map, values.status, values.game_mode, values.isPrivate, values.name);
            console.log(response);
            setLobbyInfo(response.lobby);
            setUserStatus("lobby");
        } catch (error) {
            console.error("Failed to create lobby:", error);
        }
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            players: [user._id],
            map: "",
            game_mode: "",
            status: "starting",
            isPrivate: false
        },
        onSubmit: async (values) => {
            console.log("Creating lobby with:", values);
            await handleSubmit(values);
        },
    });

    const fetchLobby = async () => {
        try {
            const data = await axios.get("http://localhost:999/lobby");
            setLobbies(data.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchMap = async () => {
            try {
                const data = await getMap();
                setMaps(data || []);
            } catch (error) {
                console.error("Failed to fetch maps", error);
            }
        };
        fetchLobby();
        fetchMap();
    }, []);

    const joinLobby = async(code) => {
        try{
            const response = await axios.get(`http://localhost:999/lobby/${code}`);
            console.log(response);
            
            if(response.data === "Not found"){
                toast.error("Lobby not found");
            }else{
                setLobbyInfo(response.data);
                setUserStatus("lobby");
            }
        } catch(err){
            console.log(err);
        }
        
    }
    

    return userStatus === "menu" ? (
        <div>
            <ToastContainer theme="dark" position="top-center" autoClose={1000} hideProgressBar/>
            <BackButton setMenuState={setMenuState} menuState={menuState} />
            <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center gap-[50px]">
                <div className="flex gap-[50px] h-fit mt-[50px]">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="py-[10px] px-[20px] rounded-[5px] bg-cyan-700">
                                Create Lobby
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-black/50">
                            <DialogHeader>
                                <DialogTitle className="text-[25px]">Create Lobby</DialogTitle>
                                <DialogDescription>
                                    {/* Fill in the lobby settings and click create. */}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            type="text"
                                            placeholder="Enter lobby name"
                                            className="w-40"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="map" className="text-right">Map</Label>
                                        <Select
                                            value={formik.values.map}
                                            onValueChange={(value) => formik.setFieldValue("map", value)}
                                        >
                                            <SelectTrigger className="">
                                                <SelectValue placeholder="Select game map" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0e0d0e]">
                                                {(maps ?? []).map((m) => (
                                                    <SelectItem key={m._id} value={m._id} className="">
                                                        {m.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="game_mode" className="text-right">Game Mode</Label>
                                        <Select
                                            value={formik.values.game_mode}
                                            onValueChange={(value) => formik.setFieldValue("game_mode", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select game mode" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black">
                                                <SelectItem value="custom">Custom</SelectItem>
                                                <SelectItem value="ranked">Ranked</SelectItem>
                                                <SelectItem value="unranked">Unranked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex">
                                        <div className="w-[100px]">Private</div>
                                        <input type="checkbox" checked={formik.values.isPrivate} onChange={() => formik.setFieldValue("isPrivate", !formik.values.isPrivate)} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <div className="text-[40px]">or</div>
                    <div className="flex gap-[20px]">
                        <input
                            type="text"
                            className="border outline-none rounded-[5px] w-[300px] text-[20px] px-[15px]"
                            placeholder="Join existing lobby"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => { e.code === "Enter" && joinLobby(searchValue) }}
                        />
                        <button className="py-[10px] px-[20px] rounded-[5px] bg-cyan-700" onClick={() => joinLobby(searchValue)}>Join lobby</button>
                    </div>
                </div>
                <div className="flex flex-col w-[800px] h-fit overflow-y-scroll gap-[20px] items-center mt-[20px] py-[10px]">
                    <button className="absolute w-fit flex h-[30px] mt-[-40px] ml-[-640px] gap-[5px] items-center rounded-[5px] bg-cyan-100/30 px-[10px]" onClick={() => fetchLobby()}>
                        <div>Refresh</div>
                        <RefreshCcw className="w-[23px] h-[23px]" />
                    </button>
                    {lobbies.length === 0 ? <div className="w-full text-[30px] h-[300px] flex items-center justify-center">
                        No public lobby to show here
                    </div> :
                        lobbies.map((el, ind) => (
                            <button key={ind} className="w-[750px] h-[80px] rounded-[10px] bg-gray-400/20 flex px-[30px] items-center justify-between hover:scale-103 transition duration-100" onClick={() => joinLobby(el.joinCode)}>
                                <div className="flex gap-[20px]">
                                    <div className="text-cyan-400 text-[20px]">Map:</div>
                                    <div className="text-[20px]">{el.map.name}</div>
                                </div>
                                <div className="flex gap-[20px]">
                                    <div className="text-cyan-400 text-[20px]">Player count:</div>
                                    <div className="text-[20px]">{el.players.length}/2</div>
                                </div>
                                <div className="flex gap-[20px]">
                                    <div className="text-cyan-400 text-[20px]">Host:</div>
                                    <div className="text-[20px]">{el.players[0].username}</div>
                                </div>
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>
    ) : userStatus === "lobby" ? <Lobby lobbyInfo={lobbyInfo} setUserStatus={setUserStatus}/> : <div></div>
}
