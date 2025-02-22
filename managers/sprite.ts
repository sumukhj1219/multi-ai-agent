
interface SpriteProps{
    x: number
    y: number
    image: HTMLElement
    frameX: number
    frameY: number
    frameWidth: number
    frameHeight: number
    ctx: CanvasRenderingContext2D
}

let FRAME_DELAY = 10
let FRAME_SPEED = 1000

export class Sprite{
    x: number
    y: number
    image: HTMLImageElement
    frameX: number
    frameY: number
    frameWidth: number
    frameHeight: number
    constructor(
        x: number,
        y: number,
        image: HTMLImageElement,
        frameWidth: number,
        frameHeight: number){
        this.x = x
        this.y = y
        this.frameX = 0
        this.frameY = 0
        this.image = image
        this.frameHeight = frameHeight
        this.frameWidth = frameWidth
        
    }

    draw(ctx:CanvasRenderingContext2D){
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

    updateFrame(){
        if(FRAME_DELAY % FRAME_SPEED === 0){
            this.frameX = (this.frameX + 1) % 4
        }
        FRAME_DELAY = FRAME_DELAY + 1
    }
}