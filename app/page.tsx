"use client";
import { collisionsMap } from "@/constants/collions";
import React, { useEffect, useRef, useState } from "react";
import { Sprite } from "@/managers/sprite";
import { Agent } from "@/managers/agent";
import { ManagerDialog } from "@/components/managerDialog";

const TILE_SIZE = 32;
const COLLISION_VALUE = 140;

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);

  const speed = 2;
  let keysPressed: { [key: string]: boolean } = {};
  let animationFrameId: number;
  let agents: Agent[] = [];

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
    const agentImage = new Image();

    mapImage.src = "/game-assets/map.png";
    playerImage.src = "/game-assets/user.png";
    agentImage.src = "/game-assets/agents.png";

    let player: Sprite;

    function handleKeyDown(e: KeyboardEvent) {
      keysPressed[e.key] = true;
    }

    function handleKeyUp(e: KeyboardEvent) {
      keysPressed[e.key] = false;
      player.frameX = 0;
    }

    function handleMovements() {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
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

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

      agents.forEach((agent) => {
        agent.draw(ctx);
      });

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

      agentImage.onload = () => {
        const frameWidth = agentImage.width / 8;
        const frameHeight = agentImage.height / 3;

        agents.push(new Agent(200, 200, 0, 0, frameHeight, frameWidth, agentImage, "Manager-GEMINI"));
      };
    };

    function handleInteraction(e: KeyboardEvent) {
      if (e.key === "e") {
        const interactingAgent = agents.find(
          (agent) =>
            player.x < agent.x + agent.frameWidth &&
            player.x + player.frameWidth > agent.x &&
            player.y < agent.y + agent.frameHeight &&
            player.y + player.frameHeight > agent.y
        );

        if (interactingAgent) {
          setActiveAgent(interactingAgent);
        }
      }
    }

    window.addEventListener("keydown", handleInteraction);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  return (
    <div className="relative flex flex-col mx-auto justify-center min-h-screen items-center ">
      <canvas ref={canvasRef}></canvas>
      {activeAgent && (
        <ManagerDialog
          active={!!activeAgent}
          agents={activeAgent}
          onClose={() => setActiveAgent(null)}
        />
      )}
    </div>
  );
};

export default Page;
