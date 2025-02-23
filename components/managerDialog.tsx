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
    const [originalResponse, setOriginalResponse] = useState("")
    const [showResponseDialog, setShowResponseDialog] = useState(false)
    const [model, setModel] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        try {
            const agentResponse = await agents.execute(query)

            if (!agentResponse) {
                throw new Error("No response from AI")
            }
            setModel(agentResponse.model)
            setOriginalResponse(agentResponse.originalResponse)
            setShowResponseDialog(true)
        } catch (error) {
            console.log("Error executing agent:", error)
            setOriginalResponse("Error fetching response. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Query Input Dialog */}
            <Dialog open={active} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[450px] bg-white shadow-lg rounded-lg p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                            Interact with {agents?.name || "Unknown Agent"}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-600">
                            Ask questions and get AI-powered responses.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <form onSubmit={handleSubmit} className="grid gap-3">
                            <Label htmlFor="query" className="text-sm font-medium text-gray-700">
                                Your Query
                            </Label>
                            <Input
                                id="query"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Type your question..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                className="w-full py-2 text-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition duration-200"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader className="w-5 h-5 animate-spin" /> Processing...
                                    </span>
                                ) : (
                                    "ASK"
                                )}
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Scrollable Response Dialog */}
            <Dialog open={showResponseDialog} onOpenChange={() => setShowResponseDialog(false)}>
                <DialogContent className="max-w-xl bg-white shadow-lg rounded-lg p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            Response from {model || "AI Agent"}
                        </DialogTitle>
                    </DialogHeader>
                    
                    {/* Original Response Box */}
                    <div className="mb-4">
                        <h3 className="text-md font-semibold text-gray-800">Original Response</h3>
                        <div className="max-h-[250px] overflow-y-auto border border-gray-300 p-4 rounded-md bg-gray-100 text-sm text-gray-900 whitespace-pre-line leading-relaxed">
                            {originalResponse || "Waiting for response..."}
                        </div>
                    </div>

                    

                    <DialogFooter>
                        <Button onClick={() => setShowResponseDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
