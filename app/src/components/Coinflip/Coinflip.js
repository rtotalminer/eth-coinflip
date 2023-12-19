import { ethers } from "ethers";
import React from 'react';
import "./Coinflip.css";
import { attachContract, checkConnection, getABI, getAccounts } from '../../helpers';
import { COINFLIP_ADDR } from '../../config';



const Coinflip = (props) => {

  const { dataStore, signer } = props;
  const coinflipABI = dataStore.coinflipABI;//await getABI(COINFLIP_ADDR);

  var coinflip = undefined;
  try {
    let _coinflip =  new ethers.Contract(COINFLIP_ADDR, coinflipABI, signer);  
    coinflip = _coinflip;
  }
  catch (err) {
    console.log("error: ", err);
  } 

  var [amount, setAmount] = React.useState(0);
  const [debts, setDebts] = React.useState("0");

  async function hasCoinflipFired()
  {
    let accounts = await getAccounts();
    let hasPlayerBet = await coinflip.hasPlayerBet(accounts[0]);
    console.log(accounts, accounts[0], hasPlayerBet);
    return hasPlayerBet;
  }

  async function getDebts()
  {
    let accounts = await getAccounts();
    console.log(accounts[0], signer.target);
    let debts = await coinflip.debts(accounts[0]);
    return debts;
  }

  async function fireCoinflip(amount)
  {
    if (coinflip == undefined) {
      return;
    }
    let hasPlayerBet = await hasCoinflipFired();
    if (hasPlayerBet === true) {
      console.log("You have a flip awaiting a decision...");
      return;
    } 
    
    let flipTx = await coinflip.flip(0, {value: ethers.parseEther(amount.toString())});
    console.log(flipTx);
    flipTx.wait();

    coinflip.on("RequestSent", (requestId, numWords, event) => {
      console.log(`${requestId}, ${numWords}, ${event}`);
      event.removeListener();
    });

    coinflip.on("RequestFulfilled", (_requestId, _randomWords, event) => {
      console.log(`${_requestId}, ${_randomWords}, ${event}`);
      event.removeListener();
    });

  }

  React.useEffect(() => {
    // React advises to declare the async function directly inside useEffect
    async function setVars() {
      let accounts = await getAccounts();
      let _debts = await coinflip.debts(accounts[0]);
      let debts_ = ethers.formatEther(_debts.toString());
      setDebts(debts_);
    };

    if (coinflip) {
      setVars();
    }
  }, []);

  return (
    <div id="coinflip">
      <div id="coin" onClick={() => fireCoinflip(amount)}>
        <div className="side-a"></div>
        <div className="side-b"></div>
      </div>

      <div>
        Bet:
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <h1>Click on coin to flip</h1>
      </div>

      <div>
        <span>debts: {debts}</span>
        <button>withdraw</button>
      </div>

    </div>
  );
};

export default Coinflip;