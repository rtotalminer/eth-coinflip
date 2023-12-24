import { useEffect, useState } from 'react';
import { Contract, ethers, parseEther } from 'ethers';

import { UserStore, syncStore } from '../../utils/store';
import { COINFLIP_ADDR, COINFLIP_ABI, DEV } from '../../utils/config';

import CoinAnimation from './CoinAnimation';
import './coinflip.css';

import _COINFLIP_ABI from '../../../artifacts/contracts/Coinflip.sol/Coinflip.json'

// cases:

// user has no flip
// he clicks flip

// user has flip
// loads flip

// first get the contract

// on page init check if user has bet
// if he has then await response and animate

// if he hasnt then create  a newe one and await response and nmiate


const Coinflip = () => {

    const userStore = syncStore(UserStore);
    var coinflipContract: Contract;

    const [amount, setAmount] = useState<string>('');  

    // flag to check if there is anmiaton present
    const [isAnimating, setIsAnimating] = useState(false);

    // flag to check if user has pressed coin
    const [firedCoinflip, setFiredCoinflip] = useState(false);

    const [ requestId, setRequestId ] = useState(0);

    async function getRequestId() {
        let _requestId = await coinflipContract.playerIds(userStore.accounts[0]) || 0;
        return _requestId;
    }

    async function fireCoinflip() {
        let tx = await coinflipContract.flip(0, {value: parseEther('0.01')});
        let receipt = await tx.wait();
        

    }

    useEffect(() => {
        coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
        const result = async () => {
            let _requestId = await getRequestId();
            return { _requestId };
        }
        result().then((res) => {
            console.log(res._requestId);
            setRequestId(res._requestId);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        const result = async () => {
            let tx = await fireCoinflip();
        }
        result().then((res) => {

        }).catch(console.error);
    }, [firedCoinflip])

    useEffect(() => {
        (requestId != 0) ? setIsAnimating(true) : setIsAnimating(false);
    }, [requestId])

    // useEffect(() => {
    //     const callFlip = async () => {
    //         let res = false;
    //         if (userStore.accounts[0] != undefined) {
    //             coinflipContract = new ethers.Contract(COINFLIP_ADDR, COINFLIP_ABI, userStore.signer);
    //             const tx = await coinflipContract.flip(
    //                 0, // BET HEADS (OR TAILS DOSENt MATTER)
    //                 { value: parseEther('0.1') }
    //             );
    //             const receipt = await tx.wait();
    //             const requestSentEvent = receipt?.logs?.find(
    //                 (event: any) => event.eventName === "RequestSent"
    //             );

    //             const requestId = receipt?.logs[0].topics[2]

    //             // await for fulfillment
                  
    //               //let coordinatorAddr = coinflipContract.coordinator();
                  
    //             // if (DEV) {
    //             //   // simulate callback from the oracle network
    //             //   let VRFCoordinatorV2Mock: any;
               
    //             //     VRFCoordinatorV2Mock.fulfillRandomWords(requestId, COINFLIP_ADDR)
    //             // }

    //             // await for event with request id

            
    //             if (requestId != undefined)  res = true;  
    //         }
    //         return { res };
    //     }
    //     // new call
    //     if (firedCoinflip && !isAnimating) {
    //       callFlip().then((res) => {
    //             setIsAnimating(res.res);
    //         }).catch(console.error)
        
    //         // already processed call
    //       if(firedCoinflip && isAnimating) {}
    //     };
    // }, [firedCoinflip])

  return (
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
    </div>
  );
};

export default Coinflip;



      {/* <div className="coinflip-container">
        <>
          <div className="coinflip"  onClick={() => fireCoinflip(amount)}>
          <img
            src={Icon}
            height="107"
            width="120" />
          </div>
        </>
        <>
        <input
          type="text"
          className="rounded-input"
          placeholder="Enter something"
          
          onChange={handleInputChange}
        />
      </>
      </div> */}


  // const { dataStore, signer } = props;
  // const coinflipABI = dataStore.coinflipABI;//await getABI(COINFLIP_ADDR);

  // var coinflip = undefined;
  // try {
  //   let _coinflip =  new ethers.Contract(COINFLIP_ADDR, coinflipABI, signer);  
  //   coinflip = _coinflip;
  // }
  // catch (err) {
  //   console.log("error: ", err);
  // } 

  // var [amount, setAmount] = React.useState(0);
  // const [debts, setDebts] = React.useState("0");
  // var [coinIsFlipping, setCoinIsFlipping] = React.useState(false);


  // React.useEffect(() => {
  //   // React advises to declare the async function directly inside useEffect
  //   async function setVars() {
  //     let accounts = await getAccounts();
  //     let _debts = await coinflip.debts(accounts[0]);
  //     let debts_ = ethers.formatEther(_debts.toString());
  //     setDebts(debts_);
      
  //     let coinflipFired = await hasCoinflipFired();
  //     if (coinflipFired === true) {
  //       playAnimation();
  //     }
    
  //   };

  //   if (coinflip) {
  //     setVars();
  //   }


  // }, []);

  // const handleInputChange = (event) => {
  //   // Ensure the input value is a valid number
  //   const newValue = event.target.value;//.replace(/\D/g, '');

  //   // Update the amount state
  //   setAmount(newValue);
  // };

  // import "./Coinflip.css";
// import { attachContract, checkConnection, getABI, getAccounts } from '../../utils/helpers';
// import { COINFLIP_ADDR } from '../../config';

// import Icon from './ethereum-eth-logo.svg';


// async function hasCoinflipFired()
// {
//   let accounts = await getAccounts();
//   let hasPlayerBet = await coinflip.hasPlayerBet(accounts[0]);
//   console.log(accounts, accounts[0], hasPlayerBet);
//   return hasPlayerBet;
// }

// async function getDebts()
// {
//   let accounts = await getAccounts();
//   console.log(accounts[0], signer.target);
//   let debts = await coinflip.debts(accounts[0]);
//   return debts;
// }

// async function fireCoinflip(amount=0.001)
// {
//   console.log(amount)   
//   if (coinflip == undefined) {
//     return;
//   }

//   let hasPlayerBet = await hasCoinflipFired();
//   if (hasPlayerBet === true) {
//     playAnimation();
//     console.log("You have a flip awaiting a decision...");
//     return;
//   } 


      
//   let flipTx = await coinflip.flip(0, {value: ethers.parseEther(amount.toString())});
//   playAnimation();
//   console.log(flipTx);
//   flipTx.wait();

//   console.log("awaiting request sent");
//   coinflip.on("RequestSent", (requestId, numWords, event) => {
//     console.log(`${requestId}, ${numWords}, ${event}`);
//     //event.removeListener();
//   });

//   console.log("awaiting request fulfilled");
//   coinflip.on("RequestFulfilled", (_requestId, _randomWords, event) => {
//     console.log(`${_requestId}, ${_randomWords}, ${event}`);
//     event.removeListener();
//   });

// }




// async function playAnimation()
// {
//   if (coinIsFlipping)  return;
//   var outcome = document.querySelector(".coinflip");
  
//   setCoinIsFlipping(true);
//   outcome.classList.toggle("animation");

  
// }