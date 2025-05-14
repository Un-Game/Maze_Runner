import React, { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { useKeyBind } from "@/context/KeybindContext";
import { useUser } from "@/context/UserProvider";
import { useSocket } from "@/context/SocketContext";
import axios from "axios";

const { Engine, Runner, Bodies, Body, Composite, Events } = Matter;

const config = {
  containerWidth: 850,
  containerHeight: 850,
  wallThickness: 50,
  ballRadius: 5,
  moveForce: 0.001,
  maxSpeed: 5,
  firstPlayer: {
    mass: 1,
    restitution: 0,
    friction: 0.1,
    frictionAir: 0.02,
    label: "firstPlayer"
  },
  secondPlayer: {
    mass: 1,
    restitution: 0,
    friction: 0.1,
    frictionAir: 0.02,
    label: "secondPlayer"
  },
  inputKeys: {
    skill1: "c",
    skill2: "f",
    skill3: "t",
  }
};

const playerSetting = {
  skills: {
    skill1: {
      name: "Skill 1",
      description: "Skill 1 description",
      effectDuration: 2000,
      cooldown: 2000,
      isInCooldown: false,
      startedAt: 0,
    },
    skill2: {
      name: "Skill 2",
      description: "Skill 2 description",
      cooldown: 2000,
      usedState: false,
      markedCoordinate: { x: 0, y: 0 },
      isInCooldown: false,
      startedAt: 0,
    },
    skill3: {
      name: "Skill 3",
      description: "Skill 3 description",
      cooldown: 5000,
      isInCooldown: false,
      isInEffect: false,
      startedAt: 0,
    }
  },
  effects: {
    activeSkills: [],
    inCooldownSkills: []
  }
}


export default function GameAreaMultiplayer({ lobby,setUserStatus }) {
  const { keybinds } = useKeyBind()

  const [renderPosition, setRenderPosition] = useState({
    x: config.containerWidth / 2,
    y: config.containerHeight / 2,
  });
  const [renderEnemy, setRenderEnemy] = useState({
    x: 0,
    y: 0,
  });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [ping, setPing] = useState(0);
  const [currMap, setCurrMap] = useState(null);

  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Engine.create());
  const runnerRef = useRef(Runner.create());
  const playerBodyRef = useRef<Matter.Body | null>(null);
  const player2BodyRef = useRef<Matter.Body | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [matchResult, setMatchResult] = useState(null);
  const { user } = useUser()
  const socket = useSocket()
  const cellSize = 17

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysPressed.current[event.key.toLowerCase()] = true;
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysPressed.current[event.key.toLowerCase()] = false;
  }, []);


  const fetchMap = async () => {
    try {
      const response = await axios.get(`https://maze-runner-backend-2.onrender.com/map/${lobby.map}`);
      setCurrMap(response.data.layout);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchMap();

    const handleGameFinished = ({ winner }) => {
      if (winner === user._id) {
        setMatchResult("win");
      } else {
        setMatchResult("loss");
      }
      axios.put(`https://maze-runner-backend-2.onrender.com/user/${user._id}`, {exp: winner === user._id ? 10 : 5});
    };


    socket.on("game:finished", handleGameFinished);

    return () => {
      socket.off("game:finished", handleGameFinished);
    };
  }, []);

  const endMatch = () => {
    console.log("finish");
    socket.emit("game:finish", { room: lobby.joinCode });
  }

  useEffect(() => {

    if (!currMap) return;

    const engine = engineRef.current;
    const runner = runnerRef.current;

    engine.gravity.y = 0;

    const walls = [

      Bodies.rectangle(
        config.containerWidth / 2,
        -config.wallThickness / 2,
        config.containerWidth + 2 * config.wallThickness,
        config.wallThickness,
        { isStatic: true }
      ),

      Bodies.rectangle(
        config.containerWidth / 2,
        config.containerHeight + config.wallThickness / 2,
        config.containerWidth + 2 * config.wallThickness,
        config.wallThickness,
        { isStatic: true }
      ),

      Bodies.rectangle(
        -config.wallThickness / 2,
        config.containerHeight / 2,
        config.wallThickness,
        config.containerHeight + 2 * config.wallThickness,
        { isStatic: true }
      ),

      Bodies.rectangle(
        config.containerWidth + config.wallThickness / 2,
        config.containerHeight / 2,
        config.wallThickness,
        config.containerHeight + 2 * config.wallThickness,
        { isStatic: true }
      ),
    ];

    const mazeBody = [];

    for (let row = 0; row < currMap.maze.length; row++) {
      for (let col = 0; col < currMap.maze[row].length; col++) {
        if (currMap.maze[row][col] === 1) {
          const wall = Bodies.rectangle(
            col * cellSize + cellSize / 2,
            row * cellSize + cellSize / 2,
            cellSize,
            cellSize,
            { isStatic: true }
          );
          mazeBody.push(wall);
        }
      }
    }

    const { x, y, w, h } = currMap.exitPoint;
    const finish = Bodies.rectangle(
      x + w / 2,
      y + h / 2,
      w,
      h,
      { isStatic: true, isSensor: true, label: "finish" }
    );


    Composite.add(engine.world, walls);
    Composite.add(engine.world, mazeBody);
    Composite.add(engine.world, finish);


    console.log(currMap.spawnPoint[0]);

    const player = Bodies.circle(
      currMap.spawnPoint[0].x,
      currMap.spawnPoint[0].y,
      config.ballRadius,
      lobby.players[0].username === user.username ? config.firstPlayer : config.secondPlayer,
    );

    const player2 = Bodies.circle(
      currMap.spawnPoint[1].x,
      currMap.spawnPoint[1].y,
      config.ballRadius,
      lobby.players[0].username === user.username ? config.secondPlayer : config.firstPlayer,
    );
    if (lobby.players[0].username == user.username) {
      playerBodyRef.current = player;
      player2BodyRef.current = player2;
    } else {
      playerBodyRef.current = player2;
      player2BodyRef.current = player;
    }
    Composite.add(engine.world, player);
    Composite.add(engine.world, player2);


    const updateCallback = () => {



      const playerBody = playerBodyRef.current;
      const player2Body = player2BodyRef.current;
      if (!playerBody || !player2Body) return;

      socket.on("game:move", (data) => {
        const { x, y } = data;
        Body.setPosition(player2Body, {
          x: x,
          y: y,
        });



      })

      setRenderEnemy({ x: player2Body.position.x, y: player2Body.position.y });

      let forceX = 0;
      let forceY = 0;
      if (keysPressed.current[keybinds.up]) forceY -= config.moveForce;
      if (keysPressed.current[keybinds.down]) forceY += config.moveForce;
      if (keysPressed.current[keybinds.left]) forceX -= config.moveForce;
      if (keysPressed.current[keybinds.right]) forceX += config.moveForce;

      if (keysPressed.current[keybinds.skill1] && !playerSetting.skills.skill1.isInCooldown) {
        playerSetting.skills.skill1.isInCooldown = true;
        config.maxSpeed = 7.5;

        setTimeout(() => {
          config.maxSpeed = 5;
        }, playerSetting.skills.skill1.effectDuration);

        setTimeout(() => {
          playerSetting.skills.skill1.isInCooldown = false;
        }, playerSetting.skills.skill1.cooldown);
      };

      if (keysPressed.current[keybinds.skill2] && !playerSetting.skills.skill2.isInCooldown) {

        if (playerSetting.skills.skill2.usedState) {


          playerSetting.skills.skill2.isInCooldown = true;
          playerSetting.skills.skill2.usedState = false;

          Matter.Body.setPosition(playerBody, {
            x: playerSetting.skills.skill2.markedCoordinate.x,
            y: playerSetting.skills.skill2.markedCoordinate.y,
          });

          setTimeout(() => {
            playerSetting.skills.skill2.isInCooldown = false;
          }, playerSetting.skills.skill2.cooldown);
        } else {
          playerSetting.skills.skill2.markedCoordinate = { x: playerBody.position.x, y: playerBody.position.y };
          setTimeout(() => {
            playerSetting.skills.skill2.usedState = true;
          }, 500);
        }
      }

      if (keysPressed.current[keybinds.skill3] && !playerSetting.skills.skill3.isInCooldown) {
        playerSetting.skills.skill3.isInCooldown = true
        playerSetting.skills.skill3.isInEffect = true;
        Matter.Body.set(playerBody, { isSensor: true });
        setTimeout(() => {
          playerSetting.skills.skill3.isInCooldown = false;
        }, playerSetting.skills.skill3.cooldown);
        setTimeout(() => {
          Matter.Body.set(playerBody, { isSensor: false });
          playerSetting.skills.skill3.isInEffect = false;
        }, 200)
      }




      if (forceX !== 0 || forceY !== 0) {
        Body.applyForce(playerBody, playerBody.position, { x: forceX, y: forceY });
      }



      const currentVelocity = playerBody.velocity;
      const speed = Math.sqrt(currentVelocity.x ** 2 + currentVelocity.y ** 2);

      if (speed > config.maxSpeed) {
        const scale = config.maxSpeed / speed;
        Body.setVelocity(playerBody, {
          x: currentVelocity.x * scale,
          y: currentVelocity.y * scale,
        });
      }



      setRenderPosition({ x: playerBody.position.x, y: playerBody.position.y });

      socket.emit("game:move", { x: playerBody.position.x, y: playerBody.position.y, room: lobby.joinCode.toString() });

      setVelocity({ x: playerBody.velocity.x, y: playerBody.velocity.y });

    };
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (pair.bodyA.label === "finish" && pair.bodyB.label === "firstPlayer") {
          endMatch();
        }
        if (pair.bodyA.label === "firstPlayer" && pair.bodyB.label === "finish") {
          endMatch();
        }
      }
    });
    

    const pingCheck = setInterval(() => {
      const timeStamp = Date.now();
      socket.emit("game:ping", { timeStamp: timeStamp });

    }, 2000);
    socket.on("game:ping", (data) => {
      const { timeStamp } = data;
      const now = Date.now();
      setPing(now - timeStamp);
    })
    Events.on(engine, 'afterUpdate', updateCallback);


    Runner.run(runner, engine);


    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);



    return () => {

      clearInterval(pingCheck);

      Runner.stop(runner);

      Events.off(engine, 'afterUpdate', updateCallback);

      Composite.clear(engine.world, false);

      Engine.clear(engine);

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);


      playerBodyRef.current = null;


    };

  }, [handleKeyDown, handleKeyUp, currMap]);

  return currMap ? !matchResult ? (
    <div className="w-full h-full flex justify-center">
      <div
        ref={sceneRef}
        style={{
          width: `${config.containerWidth}px`,
          height: `${config.containerHeight}px`,
        }}
        className="border items-center border-green-300 relative overflow-hidden w-fit h-fit bg-gray-800 scale-100"
      >

        <div
          className="absolute rounded-full bg-red-500"
          style={{
            width: `${config.ballRadius * 2}px`,
            height: `${config.ballRadius * 2}px`,
            opacity: playerSetting.skills.skill3.isInEffect ? 0.2 : 1,
            transform: `translate(${renderPosition.x - config.ballRadius}px, ${renderPosition.y - config.ballRadius}px)`,

          }}
        />
        <div
          className="absolute rounded-full bg-green-500"
          style={{
            width: `${config.ballRadius * 2}px`,
            height: `${config.ballRadius * 2}px`,

            transform: `translate(${renderEnemy.x - config.ballRadius}px, ${renderEnemy.y - config.ballRadius}px)`,

          }}
        />

        <div
          className="absolute bg-blue-500 z-[-1]"
          style={{
            width: `${currMap.exitPoint.w}px`,
            height: `${currMap.exitPoint.h}px`,
            transform: `translate(${currMap.exitPoint.x}px, ${currMap.exitPoint.y}px)`
          }}
        ></div>


        {currMap.maze.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            cell === 1 ? (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute bg-purple-200"
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  transform: `translate(${colIndex * cellSize}px, ${rowIndex * cellSize}px)`,
                }}
              />
            ) : cell === 2 ? (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute bg-green-200"
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  transform: `translate(${colIndex * cellSize}px, ${rowIndex * cellSize}px)`,
                }}
              />
            ) : null
          )
        )}
      </div>

      <div className="absolute top-2 right-2 text-white text-xs font-mono mt-[100px]">
        Velocity: X: {velocity.x.toFixed(2)}, Y: {velocity.y.toFixed(2)}
        <br />
        Position: X: {renderPosition.x.toFixed(0)}, Y: {renderPosition.y.toFixed(0)}
        <br />
        Ping: {ping}
      </div>
      <div className="absolute bottom-96 right-24 text-white text-xs font-mono flex flex-col gap-[20px]">
        <button disabled={playerSetting.skills.skill1.isInCooldown} className={`border bg-black p-[20px] rounded-[10px] ${playerSetting.skills.skill1.isInCooldown ? "border-red-500" : "border-green-500"}`}>Skill 1: {playerSetting.skills.skill1.isInCooldown ? "In Cooldown" : "Ready"}</button>
        <button disabled={playerSetting.skills.skill2.isInCooldown} className={`border bg-black p-[20px] rounded-[10px] ${playerSetting.skills.skill2.isInCooldown ? "border-red-500" : playerSetting.skills.skill2.usedState ? "border-yellow-500" : "border-green-500"}`}>Skill 2: {playerSetting.skills.skill2.isInCooldown ? "In Cooldown" : "Ready"}</button>
        <button disabled={playerSetting.skills.skill3.isInCooldown} className={`border bg-black p-[20px] rounded-[10px] ${playerSetting.skills.skill3.isInCooldown ? "border-red-500" : "border-green-500"}`}>Skill 3: {playerSetting.skills.skill3.isInCooldown ? "In Cooldown" : "Ready"}</button>
      </div>
    </div>
  ) : (
    <div className="w-full h-[calc(100vh-100px)] flex justify-center pt-[100px] md:pt-[200px] bg-black/50" onClick={()=>setUserStatus("lobby")}>
      <div className="w-fit h-fit flex flex-col items-center">
        <div
          className={`
          text-6xl font-bold p-8 m-4 rounded-lg shadow-lg text-center 
          transition-all duration-500 transform hover:scale-105
          ${matchResult === "win"
              ? "bg-gradient-to-r from-green-400 to-blue-500 text-[70px] text-transparent bg-clip-text"
              : "bg-gradient-to-r from-red-500 to-purple-500 text-[70px] text-transparent bg-clip-text"}
        `}
        >
          {matchResult === "win" ? "Victory" : "Defeat"}
        </div>
        <div>{matchResult === "win" ? "+10 exp" : "+5 exp"}</div>
        <div className="text-[50px]">Tap annywhere to continue</div>
      </div>
    </div>
  ) : (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="text-[30px] text-cyan-300">Loading...</div>
    </div>
  );
}