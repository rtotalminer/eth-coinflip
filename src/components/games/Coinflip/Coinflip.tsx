import { useEffect, useRef, useState } from 'react';
import { Contract, ethers, formatEther, parseEther } from 'ethers';

import { SystemStore, UserStore, syncStore } from '../../../shared/store';
import { COINFLIP_ADDR, COINFLIP_ABI, DEV } from '../../../shared/config';

import CoinAnimation from './CoinAnimation';
import './coinflip.css';

import _COINFLIP_ABI from '../../../../artifacts/contracts/Coinflip.sol/Coinflip.json'

const Coinflip = () => {

    const userStore = syncStore(UserStore);
    const systemStore = syncStore(SystemStore);

    enum ResultsMsgEnum {
        NONE,
        RESOLVED,
        AWAITING,
        ERROR
    }

    const loading = false;

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

        // display yyay you won (so what if user refreshes have a prev rersults later)

        recentBet.current = _recentBet;

        console.log(recentBet);

        if (_recentBet[3] == _recentBet[4]) {
        }

        setResulsMsg(ResultsMsgEnum.RESOLVED);



    }

    async function getRequestId() {
        let playerId = await userStore.contracts.Coinflip.playerIds(userStore.user.address);
        return playerId;
    }

    async function fireCoinflip() {
        try {
            let tx = await userStore.contracts.Coinflip.flip(0, parseEther(amount));
            let receipt = await tx.wait();
            return (await getRequestId());
        }
        catch (err) {
            console.log(err);
            return 0;
        }
       
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

    useEffect(() => {
        if (!userStore.connected)  return;
        const result = async () => {
            let _requestId = await getRequestId();
            setRequestId(_requestId);
            return { _requestId };
        }
        result().then((res) => {
            setIsLoading(false);
        }).catch(console.error);
    }, [systemStore.loading]);

    useEffect(() => {
        if (requestId == -1 )  return;
        if (requestId != 0 )  return;
        
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
        console.log(requestId);
        if (requestId == 0 )  return;
        if (requestId == -1 ) {
            setRequestId(0);
            return;
        }

        setIsAnimating(true);
        setResulsMsg(ResultsMsgEnum.AWAITING);

        const result = async () => {  
            await waitFulfillment(requestId);
        }
        result().then((res) => {

        }).catch((err) => {
            console.log(err);
            setResulsMsg(ResultsMsgEnum.ERROR);
        });
    }, [requestId]);

    const errorMsg = <>An error has occured.</>;
    const awaitingMsg = <>
        <span>Coin has been flipped, view the transaction <a>here</a></span>
    </>;
    const resolvedMsg = <>
        
    </>;

  return (
    <>
        {(!loading) ?
        <div className='centre text-align-centre padding-top-s' style={{marginTop: '50px'}}>
            <div className=''>
                <div style={{fontSize: '36px', textAlign: 'center'}}>
                    Coinflip
                </div>
                <div  style={{padding: '10px 0px 10px 0px'}}>
                    Heads is on the house, place your bet and click the coin to play.
                </div>
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
