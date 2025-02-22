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
import { Loader } from "lucide-react"

export function ManagerDialog({ active, onClose, agents }: { active: boolean; onClose: () => void; agents: Agent }) {
    const [query, setQuery] = useState("")
    const [response, setResponse] = useState("")
    const [showResponseDialog, setShowResponseDialog] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        try {
            const agentResponse = await agents.execute(query)
            setResponse(agentResponse)
            setShowResponseDialog(true)
        } catch (error) {
            console.log("Error executing agent:", error)
            setResponse("Error fetching response. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog open={active} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px] bg-yellow-500">
                    <DialogHeader>
                        <DialogTitle>Interact with {agents?.name || "Unknown Agent"}</DialogTitle>
                        <DialogDescription>Interacting with AI Agents</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <form onSubmit={handleSubmit} className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="query" className="text-right">Query</Label>
                            <Input
                                id="query"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type your question..."
                                className="col-span-3 bg-yellow-300"
                            />
                            <Button type="submit" className="w-full p-4" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader className="w-4 h-4 animate-spin" /> Processing...
                                    </span>
                                ) : (
                                    "ASK"
                                )}
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showResponseDialog} onOpenChange={() => setShowResponseDialog(false)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Agent {agents?.name || "Unknown Agent"}</DialogTitle>
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
