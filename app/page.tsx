"use client";
import { User } from "@/managers/user";
import { Agent } from "@/managers/agent";
import React, { useEffect, useRef } from "react";
import DrawObjects from "@/canvas/drawObjects";

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const user = useRef(new User());
  const agent = useRef([
    new Agent(200, 200, "./agent-1.png"),
    new Agent(400, 100, "./agent-2.png"),
    new Agent(600, 200, "./agent-3.png"),

  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    const moveUser = (direction: string) => {
      user.current.move(direction);

      DrawObjects({
        ctx,
        width: canvas.width,
        height: canvas.height,
        agent: agent.current, 
        user: user.current,
      });

      agent.current.forEach((agent) => agent.interact(user.current));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const directionMap: Record<string, string> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };

      if (event.key in directionMap) {
        moveUser(directionMap[event.key]);
      }
    };

    DrawObjects({
      ctx,
      width: canvas.width,
      height: canvas.height,
      agent: agent.current,
      user: user.current,
    });

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <canvas ref={canvasRef} className="border border-white bg-black"></canvas>
    </div>
  );
};

export default Page;
