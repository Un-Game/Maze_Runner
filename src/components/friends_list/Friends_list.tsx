"use client";

import { useUser } from "@/context/UserProvider";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react";
import axios from "axios";
import { Check, MessageSquare, UserPlus, UserRoundX, X } from "lucide-react";
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
    const [searchInput,setSearchInput] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [isSending, setSending] = useState(null);
    const [incomingRequests, setIncomingRequests] = useState([]);

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

    const searchUser = async () => {
        setSending(null);
        setSearchResult("loading");
        try{
            const response = await axios.get(`http://localhost:999/user/find/${searchInput}`)
            setSearchResult(response.data);
        } catch(err){
            console.log(err);
            setSearchResult("");
        }
    }

    const addFriendButton = async() => {
        setSending("sending");
        try{
            await axios.post("http://localhost:999/request/", {
                senderId: user._id,
                receiverId: searchResult._id
            } );
            setSending("sent");
        } catch(err) {
            console.log(err);
            setSending(null);
        }
    }

    const acceptRequest = async(id) => {
        try{
            const resp = await axios.delete("http://localhost:999/request/accept",{
                data: {
                    senderId: id,
                    receiverId: user._id
                }
            });
            console.log(resp);
        } catch(err){
            console.log(err);
        }
    }
    const declineRequest = async(id) => {
        try{
            const resp = await axios.delete("http://localhost:999/request/decline",{
                data: {
                    senderId: id,
                    receiverId: user._id
                }
            });
            console.log(resp);
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=> {

        const fetchIncoming = async() => {
            try{
                const res = await axios.get(`http://localhost:999/request/incoming/${user._id}`);
                setIncomingRequests(res.data);
                console.log(res.data);
                
            } catch(err){
                console.log(err);
            }
        }

        fetchIncoming()
    },[])

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
                    <div className="text-[25px] pb-[20px] border-b border-cyan-400 flex justify-between">
                        <div>Friend list</div>
                        <Dialog>
                            <DialogTrigger>
                                <UserPlus className="border  bg-cyan-700 rounded-[5px] p-[4px]" size={32}/>
                            </DialogTrigger>
                            <DialogContent className="bg-black">
                                <DialogTitle className="text-center text-cyan-300 text-[25px]">Add friend</DialogTitle>
                                <div className="flex flex-col gap-[10px]">
                                    <div>Search with username</div>
                                    <div className="flex w-full gap-[20px]">
                                        <input type="text" className="w-full border outline-none text-[18px] rounded-[5px] py-[5px] px-[10px]" onChange={(e)=>{setSearchInput(e.target.value); setSearchResult(null)}} onKeyDown={(e)=> {e.key === "Enter" ? searchUser() : null}} value={searchInput}/>
                                        <button className="text-[20px] hover:text-cyan-300" onClick={searchUser}>Find</button>
                                    </div>
                                    {searchResult === "loading" ? (
                                        <div className="w-full text-center">Loading...</div>
                                    ) : searchResult ? (
                                        <div className="w-full flex justify-between mt-[20px] text-[20px]">
                                            <div className="flex items-center gap-[10px]">
                                                <div className="w-[30px] h-[30px]">
                                                    <img src={searchResult.avatar ? searchResult.avatar : "./globe.svg"} className="w-full h-full object-cover"/>
                                                </div>
                                                <div>{searchResult.username}</div>
                                            </div>
                                            <button className="text-[15px] border py-[5px] bg-cyan-400/60 rounded-[5px] w-[100px]" onClick={addFriendButton}>{isSending === "sending" ? "Sending..." : isSending === "sent" ? "Request sent" : "Add friend"}</button>
                                        </div>
                                    ) : searchResult === "" && <div className="w-full ml-[5px] text-red-400/80">Player not found</div>}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
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
                    <div className="w-full border-b">
                        <Collapsible>
                            <CollapsibleTrigger className="w-full pb-[10px] flex justify-center"><div className="text-20px">Incoming requests ~ </div>&nbsp;<div className="bg-gray-600 px-[5px] rounded-[8px]">{incomingRequests.length}</div></CollapsibleTrigger>
                            <CollapsibleContent>
                                {incomingRequests.map((req,index)=>{
                                    return(
                                        <div key={index} className="w-full flex justify-between p-[10px]">
                                            <div className="flex gap-[15px]">
                                                <div className="w-[30px] h-[30px]">
                                                    <img src={req.senderAvatar ? req.senderAvatar : "./globe.svg"} className="w-full h-full object-cover" />
                                                </div>
                                                <div>{req.senderUsername}</div>
                                            </div>
                                            <div className="flex gap-[20px]">
                                                <button className="w-[25px] h-[25px] bg-cyan-400 rounded-[5px]" onClick={()=>acceptRequest(req.senderId)}><Check/></button>
                                                <button className="w-[25px] h-[25px] bg-red-400 rounded-[5px]" onClick={()=>declineRequest(req.senderId)}><X/></button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </div>
            </div>
        </div>
    )
}