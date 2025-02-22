"use client";
import { collisionsMap } from "@/constants/collions";
import React, { useEffect, useRef, useState } from "react";
import { Sprite } from "@/managers/sprite";
import { Agent } from "@/managers/agent";

const TILE_SIZE = 32;
const COLLISION_VALUE = 140;

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  const speed = 2;
  let keysPressed: { [key: string]: boolean } = {};
  let animationFrameId: number;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const MAP_WIDTH = collisionsMap[0]?.length || 30;
    const MAP_HEIGHT = collisionsMap.length || 20;
    canvas.width = MAP_WIDTH * TILE_SIZE;
    canvas.height = MAP_HEIGHT * TILE_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mapImage = new Image();
    const playerImage = new Image();
    const agentImage = new Image()

    mapImage.src = "/game-assets/map.png";
    playerImage.src = "/game-assets/user.png";
    agentImage.src = "/game-assets/agents.png"


    let player: Sprite;
    let agent: Agent[] = [];


    function handleMovements() {
      window.addEventListener("keydown", (e) => {
        keysPressed[e.key] = true;
      });

      window.addEventListener("keyup", (e) => {
        keysPressed[e.key] = false;
        player.frameX = 0;
      });
    }

    function canMove(newX: number, newY: number): boolean {
      const tileX = Math.floor(newX / TILE_SIZE);
      const tileY = Math.floor(newY / TILE_SIZE);

      return (
        tileX >= 0 &&
        tileX < MAP_WIDTH &&
        tileY >= 0 &&
        tileY < MAP_HEIGHT &&
        collisionsMap[tileY][tileX] !== COLLISION_VALUE
      );
    }

    function movePlayer() {
      let newX = player.x;
      let newY = player.y;
      let moving = false;

      if (keysPressed["w"] && canMove(newX, newY - speed)) {
        newY -= speed;
        player.frameY = 1;
        moving = true;
      }
      if (keysPressed["a"] && canMove(newX - speed, newY)) {
        newX -= speed;
        player.frameY = 3;
        moving = true;
      }
      if (keysPressed["s"] && canMove(newX, newY + speed)) {
        newY += speed;
        player.frameY = 0;
        moving = true;
      }
      if (keysPressed["d"] && canMove(newX + speed, newY)) {
        newX += speed;
        player.frameY = 2;
        moving = true;
      }

      if (moving) {
        player.x = newX;
        player.y = newY;
        player.updateFrame();
      }
    }

    function drawCollisionTiles(ctx: CanvasRenderingContext2D) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
          if (collisionsMap[y][x] === COLLISION_VALUE) {
            ctx.fillStyle = "transparent";
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
      agent.forEach((agent)=>{
      agent.draw(ctx)
      })
      drawCollisionTiles(ctx);
      movePlayer();
      player.draw(ctx);

      animationFrameId = requestAnimationFrame(animate);
    }

    mapImage.onload = () => {
      playerImage.onload = () => {
        const frameWidth = playerImage.width / 4;
        const frameHeight = playerImage.height / 4;

        player = new Sprite(
          canvas.width / 2 - frameWidth / 2,
          canvas.height / 2 - frameHeight / 2,
          playerImage,
          frameWidth,
          frameHeight
        );

        setLoaded(true);
        handleMovements();
        animate();
      };

      agentImage.onload=()=>{
        const frameWidth = agentImage.width / 8
        const frameHeight = agentImage.height / 3

        agent.push(new Agent(200, 200, 0, 0, frameHeight, frameWidth, agentImage))
        agent.push(new Agent(400, 200, 0, 0, frameHeight, frameWidth, agentImage))
        agent.push(new Agent(600, 300, 0, 0, frameHeight, frameWidth, agentImage))
        agent.push(new Agent(800, 400, 0, 0, frameHeight, frameWidth, agentImage))

      }
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", (e) => {
        keysPressed[e.key] = true;
      });
      window.removeEventListener("keyup", (e) => {
        keysPressed[e.key] = false;
      });
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {!loaded && <p>Loading...</p>}
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Page;