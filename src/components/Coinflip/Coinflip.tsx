import { useEffect, useRef, useState } from 'react';
import { Contract, ethers, formatEther, parseEther } from 'ethers';

import { UserStore, syncStore } from '../../utils/store';
import { COINFLIP_ADDR, COINFLIP_ABI, DEV } from '../../utils/config';

import CoinAnimation from './CoinAnimation';
import './coinflip.css';

import _COINFLIP_ABI from '../../../artifacts/contracts/Coinflip.sol/Coinflip.json'
import { NorthWest, SignLanguageRounded } from '@mui/icons-material';


const Coinflip = () => {

    const userStore = syncStore(UserStore);

    enum ResultsMsgEnum {
        NONE,
        RESOLVED,
        AWAITING,
        ERROR
    }

    const [amount, setAmount] = useState<string>('0');  
    const [isAnimating, setIsAnimating] = useState(false);
    const [firedCoinflip, setFiredCoinflip] = useState(false);
    const [requestId, setRequestId ] = useState(-1);
    const [isLoading, setIsLoading ]= useState(true);
    const [resultMsg, setResulsMsg] = useState(ResultsMsgEnum.NONE);
    const [debts, setDebts] = useState("");
    const recentBet = useRef([]);

    async function requestFulfilled(event: any) {
        let coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
        let _recentBet = await coinflipContract.bets(requestId);

        // reset the animation
        setIsAnimating(false);
        setRequestId(0);

        let debts = await coinflipContract.debts(userStore.accounts[0]);
        setDebts(formatEther(debts));

        // display yyay you won (so what if user refreshes have a prev rersults later)
        console.log(_recentBet);

        recentBet.current = _recentBet;

        console.log(recentBet);

        if (_recentBet[3] == _recentBet[4]) {
            console.log('grats u woon');
        }

        setResulsMsg(ResultsMsgEnum.RESOLVED);



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
        const _requestId = await getRequestId();
        return _requestId;
    }

    async function waitFulfillment(_requestId: number) {
        console.log('awaiting fulfillment for ', _requestId);
        let res: object;
        let coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
        let event = await coinflipContract.on("RequestFulfilled", (__requestId, _numWords) => {
            console.log({__requestId, _numWords});
            if (__requestId == _requestId) {
                requestFulfilled(event);
                event.remove();
            }
        });
    }

    function resolveEvent(bet: any) {
        console.log(bet);
        // let msg = ''
        // if (event[3] == event[4]) {
        //     msg = `Congratulations! You've won ${event[5]}`;
        // }
        // else {
        //     msg = `The bank won, ${event[2]}`;
        // }
        // return msg;
    }

    async function getDebts() {
        let coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
        let debts = await coinflipContract.debts(userStore.accounts[0]);
        setDebts(formatEther(debts));
    }

    useEffect(() => {
        const result = async () => {
            let _requestId = await getRequestId();
            setRequestId(_requestId);
            return { _requestId };
        }
        result().then((res) => {
            getDebts();
            setIsLoading(false);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (requestId == -1 )  return;
        if (requestId != 0 )  return;
        
        const result = async () => {
            let _requestId = await fireCoinflip();
            console.log(_requestId);
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
        setResulsMsg(ResultsMsgEnum.AWAITING);

        const result = async () => {  
            await waitFulfillment(requestId);
        }
        result().then((res) => {
            getDebts();
        }).catch(console.error);
    }, [requestId]);

    const errorMsg = <></>;
    const awaitingMsg = <>
        <span>Coin has been flipped, view the transaction <a>here</a></span>
    </>;
    const resolvedMsg = <>
        
    </>;

    

  return (
    <>
        {(!isLoading) ?
        <div className='coinflipContainer'>
            <div className='debts'>
                Winnings: {debts}
            </div>
            <CoinAnimation 
                isAnimating={isAnimating}
                setFiredCoinflip={setFiredCoinflip}
            />
            <div>
                <div className='info-msg'>
                    {(resultMsg == ResultsMsgEnum.NONE) ? <></> : <></> }
                    {(resultMsg == ResultsMsgEnum.AWAITING) ? awaitingMsg : <></> }
                    {
                        (resultMsg == ResultsMsgEnum.RESOLVED) ?
                        <>{
                            (recentBet.current[3] == recentBet.current[4]) ?
                            `Congrats! You have won ${recentBet.current[5]}` : 
                            `LOL! You lost ${formatEther(recentBet.current[2])}`
                        }</> : <></>
                    }
                    {(resultMsg == ResultsMsgEnum.ERROR) ? errorMsg : <></> }
                </div>
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
        </div> :
        <></>}
    </>
    
  );
};

export default Coinflip;
