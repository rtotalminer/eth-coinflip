
import { useEffect, useRef } from 'react';
import './coinflip.css';
import { ISpriteConfig, SpriteBase } from '../../utils/SpriteBase';

import "../../assets/img/goldcoin.jpg";
import "../../assets/img/spritesheet.png";

var coin : any;
var canvas : any;
var ctx : any;

function main() {
    coin.draw(ctx)
}

const CoinflipAnime = () => {

    const canvasRef = useRef<any | null>(null);

    useEffect(() => {
        canvas = canvasRef.current;
        ctx = canvas?.getContext("2d");

        const spriteConfig = {
            filename: "src/assets/img/goldcoin.jpg",
            xOffset: 0,
            spriteRows: 1,
            spriteCols: 1,
            spriteWidth: 200,
            spriteHeight: 200,
            srcX: 0,
            srcY: 0,
            spritePosX: 0,
            spritePosY: 0
        };
        
        const rect = {
            x: 0,
            y: 0,
            w: 256,
            h: 256
        }

        coin = new SpriteBase(rect, spriteConfig);

        setInterval(main, 1000 / 50);
    }, [])
    

    return (
        <div className='coinContainer'>
            <canvas ref={canvasRef} width='256px' height={'256px'}></canvas>
        </div>
  );
};

export default CoinflipAnime; 
