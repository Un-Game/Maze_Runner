// hooks/useLobbySocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useLobbySocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:4000/lobby'); // or your backend URL

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to /lobby:', socketRef.current?.id);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Disconnected from /lobby');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef;
};
