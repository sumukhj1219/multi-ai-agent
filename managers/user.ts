export class User {
    x: number;
    y: number;
    step: number; 
    size:number;
    current: any;
    image: HTMLImageElement
  
    constructor() {
      this.x = 100; 
      this.y = 100; 
      this.size = 40;
      this.step = 5; 
      this.image = new Image()
      this.image.src = "./user-pixel.png"
    }
  
    move(direction: string) {
      if (direction === "up" && this.y - this.step - this.size >= 0) {
        this.y -= this.step;
      }
      if (direction === "down" && this.y + this.step + this.size <= 400) {
        this.y += this.step;
      }
      if (direction === "left" && this.x - this.step - this.size >= 0) {
        this.x -= this.step;
      }
      if (direction === "right" && this.x + this.step + this.size <= 800) {
        this.x += this.step;
      }
    }
  }
  