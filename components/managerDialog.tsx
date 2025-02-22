"use client";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Agent } from "@/managers/agent";

export function ManagerDialog({
  active,
  onClose,
  agent,
}: {
  active: boolean;
  onClose: () => void;
  agent: Agent;
}) {
  const [query, setQuery] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    agent.execute(query);
  }

  return (
    <Dialog open={active} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agent Interaction</DialogTitle>
          <DialogDescription>
            Interacting with {agent.name}. Enter your query below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-4 items-center gap-4"
          >
            <Label htmlFor="query" className="text-right">
              Query
            </Label>
            <Input
              id="query"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your question..."
              className="col-span-3"
            />
            <Button type="submit">Ask</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
