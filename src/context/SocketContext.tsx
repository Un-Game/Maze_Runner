"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "./UserProvider";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const {user, refetchUser} = useUser();

  useEffect(() => {
    if (!user?._id) return;

    // socketRef.current = io("http://localhost:999", {
    socketRef.current = io("https://maze-runner-backend-2.onrender.com", {
      withCredentials: true,
    });

    socketRef.current.emit("identify", user._id);

    socketRef.current.on("connect", () => setConnected(true));
    socketRef.current.on("disconnect", () => setConnected(false));

    return () => {
      socketRef.current.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};
