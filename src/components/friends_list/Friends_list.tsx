"use client";

import { useUser } from "@/context/UserProvider";

type props = {
    setFriendMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Friend_list(props: props) {

    const user = useUser();
    const { setFriendMenu } = props;

    return (
        <div className="w-full h-full fixed flex z-10">
            <div className="h-full w-[calc(100vw-350px)] bg-gradient-to-r from-black/10 via-black/10 to-black/20" onClick={()=>setFriendMenu(false)}></div>
            <div className="h-full w-[350px] bg-black p-[30px]">
                <div className="w-full h-full flex flex-col gap-[20px]">
                    <div className="text-[25px] pb-[20px] border-b border-cyan-400">Friends list:</div>
                    <div className="flex flex-col gap-[10px] w-full h-full">
                        {user.friends.length > 0 ? user.friends.map((friend, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="text-[20px]">{friend}</div>
                                <button className="bg-cyan-400 text-white px-[10px] py-[5px] rounded-[10px]">Remove</button>
                            </div>
                        )) : (
                            <div className="text-[20px] py-[10px]">No friends added yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}