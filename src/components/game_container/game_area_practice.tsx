import { useState, useEffect, useRef } from "react";

export default function GameAreaPractice() {
  const [position, setPosition] = useState({ x: 750, y: 450 }); // Initial position of the ball
  const keysPressed = useRef<{ [key: string]: boolean }>({}); // Track pressed keys
  const animationFrameId = useRef<number | null>(null); // Track the animation frame ID

    const [step, setStep] = useState(5);
    const [keyCount, setKeyCount] = useState(0);


  const moveBall = () => {
    setPosition((prev) => {
      const newPosition = { ...prev };
      if (keysPressed.current["w"]) newPosition.y = Math.max(0, prev.y - step); // Move up
      if (keysPressed.current["a"]) newPosition.x = Math.max(0, prev.x - step); // Move left
      if (keysPressed.current["s"]) newPosition.y = Math.min(890, prev.y + step); // Move down
      if (keysPressed.current["d"]) newPosition.x = Math.min(1490, prev.x + step); // Move right
      return newPosition;
    });

    // Request the next animation frame
    animationFrameId.current = requestAnimationFrame(moveBall);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed.current[event.key] = false;
  };


  console.log(step, keysPressed);
  

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);


  setInterval(() => {
    if(keysPressed.current["w"] || keysPressed.current["a"] || keysPressed.current["s"] || keysPressed.current["d"]) {
        setStep((prev) => prev + 1);
    }else {
        if(step > 2) {
            setStep((prev) => prev - 1);
        }
    }
  }, 100);

    // Start the animation loop
    animationFrameId.current = requestAnimationFrame(moveBall);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      // Cancel the animation frame when the component unmounts
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="w-[1500px] h-[900px] border border-green-300 relative overflow-hidden">
      {/* Ball */}
      <div
        className="w-[10px] h-[10px] bg-red-500 rounded-full absolute"
        style={{
          top: position.y,
          left: position.x,
        }}
      ></div>
    </div>
  );
}