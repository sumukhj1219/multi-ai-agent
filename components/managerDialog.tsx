"use client"
import { Button } from "@/components/ui/button"
import { FormEvent, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Agent } from "@/managers/agent"

export function ManagerDialog({ active, onClose, agents }: { active: boolean; onClose: () => void, agents: Agent }) {
    const [query, setQuery] = useState("")
    const [response, setResponse] = useState("")
    const [showResponseDialog, setShowResponseDialog] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        
        const agentResponse = await agents.execute(query) 
        setResponse(agentResponse)
        setShowResponseDialog(true) 
    }

    return (
        <>
            <Dialog  open={active} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px] bg-yellow-500">
                    <DialogHeader>
                        <DialogTitle>Interact with {agents.name}</DialogTitle>
                        <DialogDescription>
                            Interacting with agents
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <form onSubmit={handleSubmit} className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="query" className="text-right">
                                Query
                            </Label>
                            <Input
                                id="query"
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type your question..."
                                className="col-span-3  bg-yellow-300"
                            />
                            <Button type="submit">Ask</Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showResponseDialog} onOpenChange={() => setShowResponseDialog(false)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agent {agents.name}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        {response || "Waiting for response..."}
                    </DialogDescription>
                    <DialogFooter>
                        <Button onClick={() => setShowResponseDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
