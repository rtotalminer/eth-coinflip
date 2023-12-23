import { useState } from 'react';
import CoinflipAnime from './CoinflipAnime'
import './coinflip.css';

//import goldcoinImg from '../assets/img/goldcoin.jpg';

const Coinflip = () => {
  var [amount, setAmount] = useState<string>('');

  async function fireCoinflip(amount: string) {
    // Your coinflip logic here
    console.log(`Flipping coin with amount: ${amount}`);
    // Add your logic for flipping the coin or any other actions
  }

  return (
    <div className='coinflipContainer'>
      <CoinflipAnime/>

      <div>
        <input
          type="text"
          className="roundedInput" // Adjust the width and margin as needed
          placeholder="Enter something"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <button onClick={() => fireCoinflip(amount)}>Flip Coin</button>
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