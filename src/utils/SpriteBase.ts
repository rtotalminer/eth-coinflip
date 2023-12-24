import { IMG_FOLDER } from "../config";

export class SpriteBase {
    x: number;
    y: number;
    w: number;
    h: number;
    filename: string;
    spriteSheet: HTMLImageElement;
    spriteRows: number;
    spriteCols: number;
    spriteWidth: number;
    spriteHeight: number;
    srcX: number;
    srcY: number;
    enableHitbox: boolean;
  
    constructor(x: number, y: number, w: number, h: number, filename: string, spriteRows = 1, spriteCols = 1, spritePosX = 0, spritePosY = 0) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.filename = filename;
  
      this.spriteSheet = new Image();
      this.spriteSheet.src = `${IMG_FOLDER}/${this.filename}`;
  
      this.spriteRows = spriteRows;
      this.spriteCols = spriteCols;
  
      this.spriteWidth = this.spriteSheet.width / spriteRows;
      this.spriteHeight = this.spriteSheet.height / spriteCols;
  
      this.srcX = spritePosX * this.spriteWidth;
      this.srcY = spritePosY * this.spriteHeight;
  
      this.enableHitbox = false;
    }
  
    draw(ctx: any) {
       ctx.drawImage(
        this.spriteSheet,
        this.srcX,
        this.srcY,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }  
  
    getCentre() {
      return [this.x + this.w / 2, this.y + this.h / 2];
    }
  }
  