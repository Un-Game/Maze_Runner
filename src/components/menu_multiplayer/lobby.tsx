'use client';

import { useLobbySocket } from '@/hooks/useLobbySocket';
import { useEffect, useState } from 'react';

export const LobbyPage = () => {
  const socketRef = useLobbySocket();
  const [players, setPlayers] = useState<string[]>([]);

  const lobbyId = 'maze-lobby-1'; // you can make this dynamic

  // Join the lobby
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.emit('join-lobby', lobbyId);

    // Listen for updates
    socketRef.current.on('lobby-updated', (data) => {
      setPlayers(data.players);
      console.log('👥 Lobby updated:', data.players);
    });

    // Clean up on unmount
    return () => {
      socketRef.current?.emit('leave-lobby', lobbyId);
    };
  }, [socketRef.current]);

  return (
    <div>
      <h1>Lobby: {lobbyId}</h1>
      <ul>
        {players.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </div>
  );
}