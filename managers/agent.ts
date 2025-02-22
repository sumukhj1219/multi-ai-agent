

export class Agent {
    x: number
    y: number
    frameX: number
    frameY: number
    frameHeight: number
    frameWidth: number
    image: HTMLImageElement
    constructor(
        x: number,
        y: number,
        frameX: number,
        frameY: number,
        frameHeight: number,
        frameWidth: number,
        image: HTMLImageElement
    ) {
        this.x = x
        this.y = y
        this.frameX = frameX
        this.frameY = frameY
        this.frameWidth = frameWidth
        this.frameHeight = frameHeight
        this.image = image
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
}