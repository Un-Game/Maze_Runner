import { useState, useEffect, useRef } from "react";
import BackButton from "../_components/back_button";
import { useKeyBind } from "@/context/KeybindContext";
import { useUser } from "@/context/UserProvider";

type props = {
  setMenuState: React.Dispatch<React.SetStateAction<string>>;
  menuState: string;
};

export default function GameAreaTest(props: props) {
  const {user, refetchUser} = useUser();
  const currentUserId = user._id;
  const { keybinds } = useKeyBind();
  const { setMenuState, menuState } = props;
  const baseWidth = 900;
  const baseHeight = 600;
  const maxWidth = 1300;
  const maxHeight = 820;

  const [difficulty, setDifficulty] = useState(1);
  const [mazeSize, setMazeSize] = useState({
    cols: 15,
    rows: 10,
    cellSize: 20,
  });
  const [exit, setExit] = useState({ x: 0, y: 0 });
  const [spawn, setSpawn] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [maze, setMaze] = useState<number[][]>([]);
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [inputLocked, setInputLocked] = useState(false);

  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    setDifficulty(1);
    setTimer(10);
    setGameOver(false);
    setVelocity({ x: 0, y: 0 });
  }, []);

  const accelerationBase = 0.5;
  const friction = 0.9;
  const maxSpeedBase = 10;

  useEffect(() => {
    if (gameOver) return;

    const timerDeduction = setInterval(() => {
      setTimer((prev) => {
        const newTimer = prev - 1;
        if (newTimer <= 0) {
          clearInterval(timerDeduction);
          setGameOver(true);
          return 0;
        }
        return Math.round(newTimer);
      });
    }, 1000);

    return () => {
      clearInterval(timerDeduction);
    };
  }, [gameOver]);

  const isInBounds = (x: number, y: number, cols: number, rows: number) =>
    x >= 0 && y >= 0 && x < cols && y < rows;

  const generateMaze = (
    cols: number,
    rows: number,
    startX: number,
    startY: number
  ): {
    maze: number[][];
    exit: { x: number; y: number };
    spawn: { x: number; y: number };
  } => {
    const maze = Array.from({ length: rows }, () => Array(cols).fill(1));

    const carve = (x: number, y: number) => {
      const dirs = [
        [0, -2],
        [0, 2],
        [2, 0],
        [-2, 0],
      ];
      for (let i = dirs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
      }

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;

        if (isInBounds(nx, ny, cols, rows) && maze[ny][nx] === 1) {
          maze[ny - dy / 2][nx - dx / 2] = 0;
          maze[ny][nx] = 0;
          carve(nx, ny);
        }
      }
    };

    maze[startY][startX] = 0;
    carve(startX, startY);

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue: { x: number; y: number; dist: number }[] = [
      { x: startX, y: startY, dist: 0 },
    ];
    visited[startY][startX] = true;
    let farthest = { x: startX, y: startY, dist: 0 };

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.dist > farthest.dist) {
        farthest = current;
      }

      const directions = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ];
      for (const [dx, dy] of directions) {
        const nx = current.x + dx;
        const ny = current.y + dy;
        if (
          ny >= 0 &&
          ny < rows &&
          nx >= 0 &&
          nx < cols &&
          maze[ny][nx] === 0 &&
          !visited[ny][nx]
        ) {
          visited[ny][nx] = true;
          queue.push({ x: nx, y: ny, dist: current.dist + 1 });
        }
      }
    }

    const hasOpenSpaceAround = (x: number, y: number): boolean => {
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      return directions.some(
        ([dx, dy]) =>
          isInBounds(x + dx, y + dy, cols, rows) && maze[y + dy][x + dx] === 0
      );
    };

    const findValidSpawn = (): { x: number; y: number } => {
      let x, y;
      do {
        x = Math.floor(Math.random() * cols);
        y = Math.floor(Math.random() * rows);
      } while (maze[y][x] !== 0 || !hasOpenSpaceAround(x, y));
      return { x, y };
    };

    const spawn = findValidSpawn();
    return {
      maze,
      exit: { x: farthest.x, y: farthest.y },
      spawn,
    };
  };

  const checkCollisionWithWalls = (hitbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === 1) {
          const wall = {
            x: x * mazeSize.cellSize,
            y: y * mazeSize.cellSize,
            width: mazeSize.cellSize,
            height: mazeSize.cellSize,
          };

          if (
            hitbox.x < wall.x + wall.width &&
            hitbox.x + hitbox.width > wall.x &&
            hitbox.y < wall.y + wall.height &&
            hitbox.y + hitbox.height > wall.y
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const moveBall = () => {
    if (gameOver || inputLocked) {
      animationFrameId.current = requestAnimationFrame(moveBall);
      return;
    }

    const acceleration = accelerationBase + difficulty * 0.1;
    const maxSpeed = maxSpeedBase + difficulty * 0.3;

    const newVelocity = { ...velocity };

    if (keysPressed.current[keybinds.up]) newVelocity.y -= acceleration;
    if (keysPressed.current[keybinds.down]) newVelocity.y += acceleration;
    if (keysPressed.current[keybinds.left]) newVelocity.x -= acceleration;
    if (keysPressed.current[keybinds.right]) newVelocity.x += acceleration;

    newVelocity.x *= friction;
    newVelocity.y *= friction;

    newVelocity.x = Math.max(-maxSpeed, Math.min(maxSpeed, newVelocity.x));
    newVelocity.y = Math.max(-maxSpeed, Math.min(maxSpeed, newVelocity.y));

    const newX = position.x + newVelocity.x;
    const newY = position.y + newVelocity.y;

    let updatedX = position.x;
    let updatedY = position.y;

    const hitboxX = {
      x: newX,
      y: position.y,
      width: 10,
      height: 10,
    };

    if (!checkCollisionWithWalls(hitboxX)) {
      updatedX = newX;
    }

    const hitboxY = {
      x: updatedX,
      y: newY,
      width: 10,
      height: 10,
    };

    if (!checkCollisionWithWalls(hitboxY)) {
      updatedY = newY;
    }

    updatedX = Math.max(
      0,
      Math.min(updatedX, (mazeSize.cols - 1) * mazeSize.cellSize)
    );
    updatedY = Math.max(
      0,
      Math.min(updatedY, (mazeSize.rows - 1) * mazeSize.cellSize)
    );

    setPosition({ x: updatedX, y: updatedY });
    setVelocity(newVelocity);

    const hitbox = {
      x: updatedX,
      y: updatedY,
      width: 10,
      height: 10,
    };

    const exitBox = {
      x: exit.x * mazeSize.cellSize,
      y: exit.y * mazeSize.cellSize,
      width: mazeSize.cellSize,
      height: mazeSize.cellSize,
    };

    if (
      hitbox.x < exitBox.x + exitBox.width &&
      hitbox.x + hitbox.width > exitBox.x &&
      hitbox.y < exitBox.y + exitBox.height &&
      hitbox.y + hitbox.height > exitBox.y
    ) {
      setInputLocked(true);
      const gainedExp = Math.floor(Math.random() * 6) + 1;
      const newTotalExp = (user?.exp || 0) + gainedExp;
      console.log("Gained:", gainedExp, "New Total:", newTotalExp);

      if (gainedExp) {
        fetch(`https://maze-runner-backend-2.onrender.com/user/${currentUserId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exp: newTotalExp }),
        }).catch((err) => {
          console.error("Failed to update EXP:", err);
        });
      }
      setTimeout(() => {
        setDifficulty((prev) => Math.min(prev + 0.3, 4));
        setInputLocked(false);
      }, 500);
    }

    animationFrameId.current = requestAnimationFrame(moveBall);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    keysPressed.current[event.key.toLowerCase()] = true;
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keysPressed.current[event.key.toLowerCase()] = false;
  };

  useEffect(() => {
    const newWidth = Math.min(baseWidth + difficulty * 100, maxWidth);
    const newHeight = Math.min(baseHeight + difficulty * 50, maxHeight);
    const adjustedTime = 10 + difficulty * 10;

    const baseCols = 15;
    const baseRows = 10;

    const cols = Math.floor(baseCols * difficulty);
    const rows = Math.floor(baseRows * difficulty);

    const rawCellSize = Math.min(
      Math.floor(newWidth / cols),
      Math.floor(newHeight / rows)
    );

    const cellSize = Math.max(20, rawCellSize);

    const startX = cols - 2;
    const startY = rows - 2;

    const {
      maze: newMaze,
      exit: newExit,
      spawn: newSpawn,
    } = generateMaze(cols, rows, startX, startY);

    setMazeSize({ cols, rows, cellSize });
    setMaze(newMaze);
    setExit(newExit);
    setSpawn(newSpawn);

    const forcedSpawn = {
      x: newSpawn.x * cellSize,
      y: newSpawn.y * cellSize,
    };

    setPosition(forcedSpawn);
    setVelocity({ x: 0, y: 0 });
    setTimer(adjustedTime);

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [difficulty]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    animationFrameId.current = requestAnimationFrame(moveBall);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [velocity, position, mazeSize]);

  return (
    <div>
      <BackButton setMenuState={setMenuState} menuState={menuState} />
      <div className="flex flex-col items-center">
        <h2 className="mb-2 font-bold">Difficulty: {difficulty.toFixed(1)}</h2>
        <h2 className="font-bold">Timer: {timer}</h2>
        {gameOver && (
          <div>
            <button
              className="w-[55px] h-[25px] text-red-400"
              onClick={() => {
                setGameOver(false);
                setDifficulty(1);
                setTimer(10);
                setPosition({ x: 0, y: 0 });
                setVelocity({ x: 0, y: 0 });
              }}
            >
              Retry?
            </button>
          </div>
        )}
        <div
          className="relative border border-green-300"
          style={{
            width: Math.min(baseWidth + difficulty * 100, maxWidth),
            height: Math.min(baseHeight + difficulty * 50, maxHeight),
            backgroundColor: "#f0f0f0",
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) =>
              cell === 1 ? (
                <div
                  key={`${x}-${y}`}
                  className="absolute bg-black"
                  style={{
                    width: mazeSize.cellSize,
                    height: mazeSize.cellSize,
                    top: y * mazeSize.cellSize,
                    left: x * mazeSize.cellSize,
                  }}
                />
              ) : null
            )
          )}

          <div
            className="absolute bg-green-500"
            style={{
              width: mazeSize.cellSize,
              height: mazeSize.cellSize,
              top: exit.y * mazeSize.cellSize,
              left: exit.x * mazeSize.cellSize,
            }}
          />

          <div
            className="absolute"
            style={{
              width: mazeSize.cellSize,
              height: mazeSize.cellSize,
              top: spawn.y * mazeSize.cellSize,
              left: spawn.x * mazeSize.cellSize,
              backgroundImage: "url('/spawn_point.png')",
              backgroundSize: "cover",
              pointerEvents: "none",
            }}
          />

          <div
            className="absolute bg-red-500 rounded-full"
            style={{
              width: 10,
              height: 10,
              top: position.y,
              left: position.x,
            }}
          />
        </div>
      </div>
    </div>
  );
}
