import { useEffect, useState } from 'react';
import { Contract, ethers, parseEther } from 'ethers';

import { UserStore, syncStore } from '../../utils/store';
import { COINFLIP_ADDR, COINFLIP_ABI, DEV } from '../../utils/config';

import CoinAnimation from './CoinAnimation';
import './coinflip.css';

import _COINFLIP_ABI from '../../../artifacts/contracts/Coinflip.sol/Coinflip.json'
import { NorthWest } from '@mui/icons-material';

const Coinflip = () => {

    const userStore = syncStore(UserStore);

    const [amount, setAmount] = useState<string>('0');  
    const [isAnimating, setIsAnimating] = useState(false);
    const [firedCoinflip, setFiredCoinflip] = useState(false);
    const [requestId, setRequestId ] = useState(-1);
    const [isLoading, setIsLoading ]= useState(true);
    const [resultMsg, setResulsMsg] = useState('');

    function requestFulfilled() {

        // reset the animation
        setIsAnimating(false);
        setRequestId(0);


        // display yyay you won (so what if user refreshes have a prev rersults later)
        setResulsMsg("FLip has been rresolved you : ");

    }

    async function getRequestId() {
        let coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
        let _requestId = (await coinflipContract.playerIds(userStore.accounts[0]));
        return _requestId;
    }

    async function fireCoinflip() {
        let coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
        let tx = await coinflipContract.flip(0, {value: parseEther(amount)});
        let receipt = await tx.wait();
        const requestId = receipt?.logs[0].topics[2];
        return requestId;
    }

    async function waitFulfillment() {
        console.log('awaiting fulfillment for ', requestId);
        let res: object;
        let coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
        let event = await coinflipContract.on("RequestFulfilled", (__requestId, _numWords) => {
            console.log({__requestId, _numWords});
            if (__requestId == __requestId) {
                requestFulfilled();
                event.remove();
            }
        });
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
        console.log(requestId);
        if (requestId == -1 )  return;
        if (requestId != 0 )  return;

        console.log('fireing coin fliip');
        
        const result = async () => {
            let _requestId = await fireCoinflip();
            setFiredCoinflip(false);
            return { _requestId }
        }
        result().then((res) => {
          setRequestId(res._requestId);
        }).catch(console.error);
    }, [firedCoinflip]);

    useEffect(() => {
        if (requestId == 0 )  return;
        if (requestId == -1 )  return;

        setIsAnimating(true);
        setResulsMsg('Awaiting Decision...');

        const result = async () => {  
            await waitFulfillment();
        }
        result().then((res) => {
        }).catch(console.error);
    }, [requestId]);

  return (
    <>
    <button onClick={ () => {console.log(requestId, firedCoinflip)}}>dev</button>
        {(!isLoading) ?
        <div className='coinflipContainer'>
            <CoinAnimation 
            isAnimating={isAnimating}
            setFiredCoinflip={setFiredCoinflip}
        />
        <div>
            <div>{resultMsg}</div>
            {(isAnimating) ? <></> : 
                <input
                    type="text"
                    className="roundedInput" // Adjust the width and margin as needed
                    placeholder="Enter bet"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                />
            }
        </div>
    </div> :<></>}
    </>
    
  );
};

export default Coinflip;
