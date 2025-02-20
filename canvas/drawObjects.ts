import React from "react";
import { Agent } from "@/managers/agent";
import { User } from "@/managers/user";

interface DrawObjectsProps {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  agent: Agent[];
  user: User;
}

const DrawObjects = ({ ctx, width, height, agent, user }: DrawObjectsProps) => {
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "red";
  agent.forEach((agent) => {
    ctx.drawImage(agent.image, agent.x - agent.size / 4, agent.y - agent.size / 4, agent.size, agent.size);

  });


  ctx.drawImage(user.image, user.x - user.size / 4, user.y - user.size / 4, user.size, user.size);
};

export default DrawObjects;
