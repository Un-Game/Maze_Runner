

import { useUser } from "@/context/UserProvider";
import BackButton from "../_components/back_button";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
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

export default function CustomGame(props) {
    const { setMenuState, menuState } = props;
    const [maps, setMaps] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const socketLobby = useRef(null);
    const user = useUser();

    const handleSubmit = async (values) => {
        try {
            await createLobby(values.players, values.map, values.status, values.game_mode);
            setDialogOpen(false);
        } catch (error) {
            console.error("Failed to create lobby:", error);
        }
    }    

    const formik = useFormik({
        initialValues: {
            players: [user._id],
            map: "",
            game_mode: "",
            status: "starting"
        },
        onSubmit: async (values) => {
            console.log("Creating lobby with:", values);
            await handleSubmit(values);
        },
    });

    useEffect(() => {
        const fetchMap = async () => {
            try {
                const data = await getMap();
                setMaps(data || []);
            } catch (error) {
                console.error("Failed to fetch maps", error);
            }
        };
        fetchMap();
    }, []);

    return (
        <div>
            <BackButton setMenuState={setMenuState} menuState={menuState} />
            <div className="w-full h-[calc(100vh-100px)] flex flex-col items-center">
                <div className="flex gap-[50px] h-fit mt-[50px]">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="py-[10px] px-[20px] rounded-[5px] bg-cyan-700">
                                Create Lobby
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Lobby</DialogTitle>
                                <DialogDescription>
                                    Fill in the lobby settings and click create.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid gap-4 py-4">
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
                                            <SelectContent>
                                                <SelectItem value="custom">Custom</SelectItem>
                                                <SelectItem value="ranked">Ranked</SelectItem>
                                                <SelectItem value="unranked">Unranked</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                        />
                        <button className="py-[10px] px-[20px] rounded-[5px] bg-cyan-700">Join lobby</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
