// CoinAnimation.jsx

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IMG_FOLDER } from '../../utils/config';

import './coinflip.css';

interface CoinflipProps {
  isAnimating: boolean;
  setFiredCoinflip: Dispatch<SetStateAction<boolean>>;
}

const CoinAnimation: React.FunctionComponent<CoinflipProps> = ({
  isAnimating, setFiredCoinflip
}: CoinflipProps) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval: any;

    if (isAnimating) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % coinImages.length);
      }, 1000 / 5);
    }

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [isAnimating, currentIndex]);


  const coinImages = [
    'goldcoinv2_0', 'goldcoinv2_1', 'goldcoinv2_2' /* Add images up to coin_12 */
  ];

  return (
    <div
      className={(!isAnimating) ? 'cursor-pointer' : ''}
      onClick={() => { (!isAnimating) ? setFiredCoinflip(true) : {}}}>
        {(!isAnimating) ? 
          <img
          src={`${IMG_FOLDER}/${coinImages[0]}.png`}
          width={256}
          height={256}
        />:
        
      <img
        src={`${IMG_FOLDER}/${coinImages[currentIndex]}.png`}
        width={256}
        height={256}
      />}
    </div>
  );
};

export default CoinAnimation;
