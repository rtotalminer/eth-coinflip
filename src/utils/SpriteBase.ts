
export interface IRect {
    x: number
    y: number
    w: number
    h: number
}

export interface ISpriteConfig {
    filename: string;
    xOffset: number;
    spriteRows: number;
    spriteCols: number;
    spriteWidth: number;
    spriteHeight: number;
    srcX: number;
    srcY: number;
    spritePosX: number;
    spritePosY: number;
}

export class SpriteBase {

    spriteConfig: ISpriteConfig;
    rect: IRect;
    spriteSheet: HTMLImageElement;
  
    constructor(_rect: IRect, _spriteConfig: ISpriteConfig) {

        this.spriteConfig = _spriteConfig;
        this.rect = _rect;

        this.spriteSheet = new Image();
        this.spriteSheet.src = this.spriteConfig.filename; // Move string literals to config
  
        this.spriteConfig.spriteWidth = this.spriteSheet.width 
            / this.spriteConfig.spriteRows;
        this.spriteConfig.spriteHeight = this.spriteSheet.height
            / this.spriteConfig.spriteCols;
  
        this.spriteConfig.srcX = this.spriteConfig.spritePosX * this.spriteConfig.spriteWidth;
        this.spriteConfig.srcY = this.spriteConfig.spritePosY * this.spriteConfig.spriteHeight;
    }
  
    draw(ctx: any): void {
      ctx.drawImage(
        this.spriteSheet,
        this.spriteConfig.srcX,
        this.spriteConfig.srcY,
        this.spriteConfig.spriteWidth,
        this.spriteConfig.spriteHeight,
        this.rect.x,
        this.rect.y,
        this.rect.w,
        this.rect.h
      );
    }
  }
  