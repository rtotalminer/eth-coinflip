import { useEffect, useState } from 'react';
import { Contract, ethers, parseEther } from 'ethers';

import { UserStore, syncStore } from '../../utils/store';
import { COINFLIP_ADDR, COINFLIP_ABI, DEV } from '../../utils/config';

import CoinAnimation from './CoinAnimation';
import './coinflip.css';

import _COINFLIP_ABI from '../../../artifacts/contracts/Coinflip.sol/Coinflip.json'

const Coinflip = () => {

    const userStore = syncStore(UserStore);

    const [amount, setAmount] = useState<string>('');  
    const [isAnimating, setIsAnimating] = useState(false);
    const [firedCoinflip, setFiredCoinflip] = useState(false);
    const [requestId, setRequestId ] = useState(0);
    const [isLoading, setIsLoading ]= useState(true);

    async function getRequestId() {
        let coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
        let _requestId = (await coinflipContract.playerIds(userStore.accounts[0]));
        return _requestId;
    }

    async function fireCoinflip() {
        let coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
        let tx = await coinflipContract.flip(0, {value: parseEther(`${amount}`)});
        let receipt = await tx.wait();
        const requestId = receipt?.logs[0].topics[2];
        return requestId;
    }

    async function waitFulfillment() {
      // LISTEN FOR REQUEST FULFILLED BY CONSUMER W/ REQUEST ID
      // THEN GET THE BEST RESULT ETC.
    }

    useEffect(() => {
        const result = async () => {
            let _requestId = await getRequestId();
            return { _requestId };
        }
        result().then((res) => {
            setRequestId(res._requestId);
            setIsLoading(false);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        const result = async () => {
            if (await getRequestId() != 0)  return (await getRequestId());
            let _requestId = await fireCoinflip();
            return { _requestId }
        }
        result().then((res) => {
          setRequestId(res._requestId);

        }).catch(console.error);
    }, [firedCoinflip])

    useEffect(() => {
      if (requestId == 0 )  return;
      if (requestId == undefined )  return;

      const result = async () => {
        setIsAnimating(true);
        await waitFulfillment();
      }
      result().then((res) => {
      }).catch(console.error);
  }, [requestId])

  return (
    <>
      {(!isLoading) ?
      <div className='coinflipContainer'>
          <CoinAnimation 
            isAnimating={isAnimating}
            setFiredCoinflip={setFiredCoinflip}
          />
      <div>
        {(isAnimating) ? <>Awaiting Decision...</> : 
          <input
            type="text"
            className="roundedInput" // Adjust the width and margin as needed
            placeholder="Enter bet"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        }
      </div>
    </div> : <></>}
    </>
    
  );
};

export default Coinflip;
