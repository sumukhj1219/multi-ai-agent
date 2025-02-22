import axios from "axios"

export class Agent {
    x: number
    y: number
    frameX: number
    frameY: number
    frameHeight: number
    frameWidth: number
    image: HTMLImageElement
    response: any
    name:string
    constructor(
        x: number,
        y: number,
        frameX: number,
        frameY: number,
        frameHeight: number,
        frameWidth: number,
        image: HTMLImageElement,
        name:string
    ) {
        this.x = x
        this.y = y
        this.frameX = frameX
        this.frameY = frameY
        this.frameWidth = frameWidth
        this.frameHeight = frameHeight
        this.image = image
        this.name = name
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(
            this.image, 
            this.frameX * this.frameWidth,
            this.frameY * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            this.x,
            this.y,
            this.frameWidth, 
            this.frameHeight
        )
    }

    interact(){
        alert("Interaction")
    }

    async execute(prompt: string) {
        try {
            const response = await axios.post("/api/manager", { prompt });
    
            if (response.status === 200 && response.data) {
                this.response = response.data.response; 
                console.log("Gemini Response:", this.response);
                return this.response
            } else {
                console.error("Unexpected response from server:", response);
            }
        } catch (error) {
            console.error("Error executing prompt:", error);
        }
    }
    

}