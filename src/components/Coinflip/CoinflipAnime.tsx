
import { useEffect, useRef } from 'react';
import './coinflip.css';
import {SpriteBase } from '../../utils/SpriteBase';
import CoinAnimation from './CoinAnimation';

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

        // const spriteConfig = {
        //     filename: "src/assets/img/spritesheet.png",
        //     xOffset: 0,
        //     spriteRows: 4, // backwards lol
        //     spriteCols: 1,
        //     spriteWidth: 0, // these get determined...
        //     spriteHeight: 0,
        //     srcX: 0,
        //     srcY: 0,
        //     spritePosX: 0,
        //     spritePosY: 0
        // };
        
        // const rect = {
        //     x: 0,
        //     y: 0,
        //     w: 256,
        //     h: 256
        // }

        // coin = new SpriteBase(rect, spriteConfig);

        coin = new SpriteBase(
            0,
            0,
            256,
            256,
            'goldcoinv2_0.png'
        ); 

        setInterval(main, 1000 / 50);
    }, [])
    

    return (
        <div onClick={() => {console.log("hello World!")}} className='coinContainer'>
            <canvas className='canvas' ref={canvasRef} width='256px' height={'256px'}></canvas>

            {/* <CoinAnimation/> */}
        </div>
  );
};

export default CoinflipAnime; 
