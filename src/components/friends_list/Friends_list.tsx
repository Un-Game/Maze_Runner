"use client";

import { useUser } from "@/context/UserProvider";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import axios from "axios";
import { MessageSquare, UserRoundX } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';

type props = {
    setFriendMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Friend_list(props: props) {

    const user = useUser();
    const { setFriendMenu } = props;
    const [viewFriend, setViewFriend] = useState(null);
    const [error, setError] = useState(false);
    const [deletionConfirm, setDeletionConfirm] = useState(false);
    const [deletionLoading, setDeletionLoading] = useState(false);

    const fetchUser = async(id) => {
        setDeletionConfirm(false);
        setViewFriend(null);
        setError(false);
        try {
            const response = await axios.get(`http://localhost:999/user/${id}`);
            setViewFriend(response.data);
        } catch(error) {
            setError(true);
        }
    }

    const deleteFriend = async(id) => {
        setDeletionLoading(true);
        try{
            await axios.put("http://localhost:999/user/removefriend",{
                senderId: user._id,
                receiverId: id
            });
            toast.info("Successfully removed");
        } catch(err){
            console.log(err);
        }
    }

    return (
        <div className="w-full h-full fixed flex z-10">
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="h-full w-[calc(100vw-350px)] bg-gradient-to-r from-black/10 via-black/10 to-black/20" onClick={()=>setFriendMenu(false)}></div>
            <div className="h-full w-[350px] bg-black p-[30px]">
                <div className="w-full h-full flex flex-col gap-[20px]">
                    <div className="text-[25px] pb-[20px] border-b border-cyan-400">Friends list:</div>
                    <div className="flex flex-col gap-[10px] w-full h-full">
                        {user.friends.length > 0 ? user.friends.map((friend, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <Popover>
                                    <PopoverTrigger asChild onClick={()=>fetchUser(friend._id)}>
                                        <div className="flex gap-[15px] w-full cursor-pointer">
                                            <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                                <img src={friend.avatar ? friend.avatar : "./globe.svg"}/>
                                            </div>
                                            <div className="text-[20px] w-full truncate">{friend.username}</div>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent side="left" align="start" sideOffset={10} className="bg-black">
                                        {error ? (
                                            "Couldn't fetch user data"
                                        ) : viewFriend ? (
                                            <div className="flex flex-col gap-[15px]">
                                                <div className="flex gap-[15px] items-center">
                                                    <img src={viewFriend.avatar ? viewFriend.avatar : "./globe.svg"} className="w-[30px] h-[30px]"/>
                                                    <div className="w-[140px] truncate">{viewFriend.username}</div>
                                                    <button className="bg-white/20 p-[5px] rounded-[5px] align-end">
                                                        <MessageSquare />
                                                    </button>
                                                </div>
                                                <div className="">Level: {Math.floor(viewFriend.exp/100)+1} <br/> Spare exp: {viewFriend.exp%100}</div>
                                                <div className="flex justify-end">
                                                    {deletionLoading ? 
                                                        <div>Removing...</div>
                                                     : deletionConfirm ? <div className="flex flex-col gap-[10px] items-end">
                                                        <div>Remove friend?</div>
                                                        <div className="flex text-[13px] gap-[10px]">
                                                            <button className="text-red-500" onClick={()=>deleteFriend(friend._id)}>DELETE</button>
                                                            <button className="text-cyan-200" onClick={()=>setDeletionConfirm(false)}>NVM</button>
                                                        </div>
                                                    </div> :
                                                    <button onClick={()=>setDeletionConfirm(true)}><UserRoundX className="text-red-400"/></button>}
                                                </div>
                                            </div>
                                        ) : (
                                            "Loading..."
                                        )}
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )) : (
                            <div className="text-[20px] py-[10px]">No friends added yet</div>
                        )}
                    </div>
                    <div className="w-full h-[100px]">
                        <Collapsible>
                            <CollapsibleTrigger className="w-full border-b pb-[10px]"><div className="text-20px">Incoming requests ~</div></CollapsibleTrigger>
                        </Collapsible>
                    </div>
                </div>
            </div>
        </div>
    )
}