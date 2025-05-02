import { Shield } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import { useUser } from "@/context/UserProvider";
import { Progress } from "@radix-ui/react-progress";

type Props = {
  setMenuState: React.Dispatch<React.SetStateAction<string>>;
};

export default function Header({ setMenuState }: Props) {
  const { user } = useUser() ?? {};
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const currentLevel = user ? Math.floor(user.exp / 100) : 0;
  const progressInLevel = user ? user.exp % 100 : 0;

  useEffect(() => {
    setProgress(progressInLevel);
  }, [user?.exp]);

  const playAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((err) => {
        console.log("Audio playback error:", err);
      });
    }
  };

  if (!user) return null;

  return (
    <div className="w-screen h-[100px] bg-black/50 flex justify-center">
      <div className="h-full w-[calc(100vw-400px)]">
        <div className="flex justify-between h-full items-center px-[50px]">
          <button
            className="w-[100px] h-[50px]"
            onClick={() => setMenuState("")}
          >
            <img
              src="./game-logo.png"
              className="w-full h-full"
              alt="Game Logo"
            />
          </button>
          <button onClick={playAudio}>Play Music</button>
          <audio ref={audioRef} src="/music/music1.mp3" loop />
        </div>
      </div>

      <button className="h-full w-[400px] bg-[linear-gradient(90deg,_rgba(2,0,36,1)_0%,_rgba(9,9,121,1)_50%,_rgba(0,212,255,1)_100%)] p-[30px] transition-colors duration-[1s] flex items-center justify-between">
        <div className="text-[22px] flex items-center gap-[10px] w-full">
          <div className="text-start flex-1">
            <div>{user.username}</div>
            <div>Lvl: {currentLevel + 1}</div>
            <div className="mt-1 w-[80%]">
              <Progress
                value={progress}
                max={100}
                className="relative overflow-hidden h-[6px] rounded-full bg-gray-700"
              >
                <div
                  className="absolute h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </Progress>
            </div>
          </div>
          <div className="w-[40px] h-[40px]">
            <Shield className="w-full h-full" stroke="yellow" fill="gray" />
          </div>
          <div className="w-[50px] h-[50px]">
            {user.avatar ? (
              <img
                src={user.avatar}
                className="w-full h-full object-cover rounded-full"
                alt="User Avatar"
              />
            ) : (
              <img
                src="./globe.svg"
                className="w-full h-full object-cover"
                alt="Default Avatar"
              />
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
