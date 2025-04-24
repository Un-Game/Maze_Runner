import React, { useEffect, useRef } from "react";
import { Engine, Render, World, Bodies, Body, Events } from "matter-js";

// Define the ball's properties in TypeScript
interface Ball extends Body {
  restitution: number;
}

const Testing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);

  useEffect(() => {
    // Create engine and renderer
    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: document.body,
      engine: engine,
      canvas: canvasRef.current!,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });
    renderRef.current = render;

    // Create maze walls (static bodies)
    const mazeWalls = [
      Bodies.rectangle(400, 200, 600, 20, { isStatic: true }),
      Bodies.rectangle(200, 300, 20, 400, { isStatic: true }),
      Bodies.rectangle(600, 300, 20, 400, { isStatic: true }),
      Bodies.rectangle(400, 500, 600, 20, { isStatic: true }),
    ];

    // Create ball (dynamic body)
    const ball = Bodies.circle(50, 50, 20, {
      restitution: 0.7,
      frictionAir: 0.05,
    }) as Ball;

    // Create exit (static body)
    const exit = Bodies.rectangle(750, 550, 50, 50, {
      isStatic: true,
      render: { fillStyle: "green" },
    });

    // Add walls, ball, and exit to the world
    World.add(engine.world, [...mazeWalls, ball, exit]);

    // Run the engine and renderer
    Engine.run(engine);
    Render.run(render);

    // Keyboard control for ball movement
    const moveBall = (event: KeyboardEvent) => {
      const forceMagnitude = 0.05;
      switch (event.key) {
        case "ArrowUp":
          Body.applyForce(ball, ball.position, { x: 0, y: -forceMagnitude });
          break;
        case "ArrowDown":
          Body.applyForce(ball, ball.position, { x: 0, y: forceMagnitude });
          break;
        case "ArrowLeft":
          Body.applyForce(ball, ball.position, { x: -forceMagnitude, y: 0 });
          break;
        case "ArrowRight":
          Body.applyForce(ball, ball.position, { x: forceMagnitude, y: 0 });
          break;
        default:
          break;
      }
    };

    // Listen for keyboard events
    window.addEventListener("keydown", moveBall);

    // Check for collision with the exit (win condition)
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === exit || pair.bodyB === exit) {
          alert("You reached the exit!");
        }
      });
    });

    // Cleanup on component unmount
    return () => {
      Render.stop(renderRef.current!); // Stop the render
      Engine.clear(engineRef.current!); // Clear the engine
      window.removeEventListener("keydown", moveBall); // Remove the keydown event listener
    };
  }, []);

  return (
    <div>
      <h1>Ball in the Maze Game</h1>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Testing;
