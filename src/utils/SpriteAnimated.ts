
// import { IRect, SpriteBase, ISpriteConfig } from "./SpriteBase";

import { SpriteBase } from "./SpriteBase";

// export class SpriteAnimated extends SpriteBase {
//   currentFrame
// }

// export class SpriteAnimated extends SpriteBase {
  
//   currentFrame = 0;
//   framesDrawn = 0;
//   moveTo = "IDLE";
//   idle = false;
//   totalFrames: number;
//   spriteDirections: any[];
  
//   constructor(
//     _rect: IRect,
//     _spriteConfig: ISpriteConfig,
//     _spriteRows : number,
//     _spriteDirections: any[]
//   ) {
//     super(_rect, _spriteConfig);

//     this.moveTo = "IDLE";
//     this.idle = false;

//     this.currentFrame = 0;
//     this.framesDrawn = 0;
//     this.totalFrames = _spriteRows;
//     this.spriteDirections = _spriteDirections;
//   }

//   draw() {
//     if (this.moveTo != "IDLE") {
//       if (this.moveTo != "IDLE_N"){
//         this.currentFrame %= this.totalFrames;
//         this.srcX = this.currentFrame * this.spriteWidth;
//       }
//       if (this.moveTo == "E") {
//         this.srcY = this.spriteDirections[1] * this.spriteHeight;
//       }
//       if (this.moveTo == "N") {
//         this.srcY = this.spriteDirections[0] * this.spriteHeight;
//       }
//       if (this.moveTo == "W") {
//         this.srcY = this.spriteDirections[3] * this.spriteHeight;
//       }
//       if (this.moveTo == "S") {
//         this.srcY = this.spriteDirections[2] * this.spriteHeight;
//       }
//     }
//     if (this.moveTo == "STATIC") {
//       this.currentFrame++;
//       this.framesDrawn = 0;
//     }

//     super.draw();
//   }
// }