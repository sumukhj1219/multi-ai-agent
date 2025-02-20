import { User } from "./user"

export class Agent{
    x:number
    y:number
    size:number
    current: any
    image: HTMLImageElement

    constructor(x: number, y:number, imageSrc : string){
        this.x = x
        this.y = y
        this.size = 50
        this.image = new Image()
        this.image.src = imageSrc
    }

    interact(user:User){
        const distance = Math.sqrt(
            Math.pow(this.x - user.x, 2) + Math.pow(this.y - user.y, 2)
        )

        if (distance < (this.size)*0.8){
            alert("Interacted with agent!")
        }
    }
}