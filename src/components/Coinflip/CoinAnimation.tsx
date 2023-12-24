// CoinAnimation.jsx

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IMG_FOLDER } from '../../config';

import './coinflip.css';

interface CoinflipProps {
  isCoinAnime: boolean;
  setIsCoinAnime: Dispatch<SetStateAction<boolean>>;
}

const CoinAnimation: React.FunctionComponent<CoinflipProps> = ({isCoinAnime, setIsCoinAnime }: CoinflipProps) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  useEffect(() => {
    let interval: any;

    if (isAnimating && isCoinAnime) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % coinImages.length);
      }, 1000 / 5);
    }

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [isAnimating, currentIndex, isCoinAnime]);

  const coinImages = [
    'goldcoinv2_0', 'goldcoinv2_1', 'goldcoinv2_2' /* Add images up to coin_12 */
  ];

  return (
    <div className="coin-animation" onClick={toggleAnimation}>
      <img
        src={`${IMG_FOLDER}/${coinImages[currentIndex]}.png`}
        alt="coin"
        width={256}
        height={256}
      />
    </div>
  );
};

export default CoinAnimation;
