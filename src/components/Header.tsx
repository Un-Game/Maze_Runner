import { Shield } from "lucide-react";
import { useRef, useState } from "react";
import { useUser } from "@/context/UserProvider";

type props = {
  setMenuState: React.Dispatch<React.SetStateAction<string>>;
};

export default function Header(props: props) {
  const musicList = [
    "/music/music1.mp3",
    "/music/lofi.mp3",
    "/music/chill-lofi.mp3",
    "/music/rock.mp3",
    "/music/sad.mp3",
    "/music/stardust.mp3",
  ];

    const {user, refetchUser} = useUser();
    const { setMenuState } = props;
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentTrackRef = useRef(musicList[1]);
    const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log("Audio playback error:", err);
          });
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };
  const shuffleMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      let randomIndex = Math.floor(Math.random() * musicList.length);
      while (musicList[randomIndex] === audio.src && musicList.length > 1) {
        randomIndex = Math.floor(Math.random() * musicList.length);
      }
      const newTrack = musicList[randomIndex];
      currentTrackRef.current = newTrack;
      audio.src = newTrack;
      audio.load();
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log("Audio playback error:", err);
        });
    }
  };
  return (
    <div className="w-screen h-[100px] bg-black/50 flex justify-center">
      <div className="h-full w-[calc(100vw-400px)]">
        <div className="flex justify-between h-full items-center px-[50px]">
          <button
            className="w-[100px] h-[50px]"
            onClick={() => {
              setMenuState("");
            }}
          >
            <img src="./game-logo.png" className="w-full h-full" />
          </button>
          <div className="flex gap-3">
            <button onClick={toggleAudio}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={shuffleMusic}>Shuffle</button>
            <audio ref={audioRef} src={musicList[1]} loop />
          </div>
        </div>
      </div>
      <button className="h-full w-[400px] bg-[linear-gradient(90deg,_rgba(2,0,36,1)_0%,_rgba(9,9,121,1)_50%,_rgba(0,212,255,1)_100%)] p-[30px] transition-colors duration-[1s] flex items-center justify-between">
        <div className="text-[22px] flex items-center gap-[10px]">
          <div className="text-start">
            <div>{user.username}</div>
            <div>Lvl: {Math.floor(user.exp / 100) + 1}</div>
          </div>
          <div className="w-[40px] h-[40px]">
            <Shield className=" w-full h-full" stroke="yellow" fill="gray" />
            {/* Rank badge placeholder */}
          </div>
        </div>
        <div className="w-[50px] h-[50px]">
          {user.avatar ? (
            <img
              src={user.avatar}
              className="w-full h-full object-cover rounded-[50%]"
            />
          ) : (
            <img src="./globe.svg" className="w-full h-full object-cover" />
          )}
          {/* Avatar image placeholder */}
        </div>
      </button>
    </div>
  );
}
