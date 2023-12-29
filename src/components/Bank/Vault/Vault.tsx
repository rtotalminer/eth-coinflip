import { useEffect, useState } from "react"
import { SystemStore, UserStore, syncStore } from "../../../shared/store";
import { formatEther, parseEther, parseUnits } from "ethers";
import { BANK_ADDR } from "../../../shared/config";
import { parse } from "path";

export default function Vault() {
 
  const userStore = syncStore(UserStore);
  const systemStore = syncStore(SystemStore);

  const [bankBalanace, setBankBalance] = useState('0');
  const [investorsBalanace, setInvestorsBalanace] = useState('0');
  const [stakeAmount, setStakeAmount] = useState('0');
  const [poolAPY, setPoolAPY] = useState('0');
  const [withdrawBalance, setWithdrawBalance] = useState('0');

    useEffect(() => {
        if (!userStore.connected)  return;
        const load = async () => {
            getBankBalance();
            getStake();
            getInvestorsBalance();
            getPoolAPY();
            getWithdrawBalance();
        } 
        load().then().catch((err) => {console.log(err)});
  }, [userStore.connected]);

  async function addStake() {
    let tx = await userStore.contracts.Bank.addStake({value: parseEther('1.0')});
    await tx.wait();
  }
  
  // move all provider read calls to an exterenal proovider i. infura,
  // so user can view withotut beinig connected to web3

  async function withdrawStake() {
    if (!userStore.connected)  return;
    let tx = await userStore.contracts.Bank.withdrawAllStake();
    await tx.wait();
  }

  async function getBankBalance() {
    const _bankBalance = await userStore.provider.getBalance(BANK_ADDR);            
    setBankBalance(formatEther(_bankBalance.toString()).toString());
  }

  async function getStake() {
    if (!userStore.connected)  return;
    let _stakeAmount = await userStore.contracts.Bank.investorsStake(userStore.user.address);
    setStakeAmount(formatEther(_stakeAmount.toString()));
  }

  async function getInvestorsBalance() {
    let _investorsBalance = await userStore.contracts.Bank.totalInvestorStake();
    setInvestorsBalanace(formatEther(_investorsBalance.toString()));
  }

  async function getPoolAPY() {
    let _totalInvestorStake = await userStore.contracts.Bank.totalInvestorStake();
    let _poolEarnings = await userStore.contracts.Bank.poolEarnings();
    let _poolAPY = Number(_poolEarnings)/Number(_totalInvestorStake);
    setPoolAPY((100*Number(_poolAPY)).toString());
  }

  async function getWithdrawBalance() {
    let _totalInvestorStake = await userStore.contracts.Bank.totalInvestorStake();
    let _stakeAmount = await userStore.contracts.Bank.investorsStake(userStore.user.address);
    let _poolEarnings = await userStore.contracts.Bank.poolEarnings();
    let _poolAPY = Number(_poolEarnings)/Number(_totalInvestorStake);
    let _withdrawBalance = (1 + Number(_poolAPY)) * Number(_stakeAmount);
    let withdrawBalance__ = formatEther(_withdrawBalance.toString()).toString()
    let withdrawBalance_ = withdrawBalance__.slice(0, 6);
    setWithdrawBalance(withdrawBalance_);
  }
  
  return (<>
  {(!systemStore.loading) ? <> 
    <div style={{
      textAlign: 'center',
      outline: 'groove',
      width: '500px',
      margin: 'auto',
      padding: '20px 20px 20px 20px',
      marginTop: '50px',
      border: '4px outset white'
    }}>
    <div>
        <p style={{fontSize: '32px'}}>The bank holds {bankBalanace} ETH</p>
        <p style={{fontSize: '24px'}}>With investors contributing <br></br>{investorsBalanace} ETH, earning {poolAPY}% APY.</p>
    </div>
        
  </div>
  
    <div style={{
        textAlign: 'center',
        outline: 'groove',
        width: '500px',
        margin: 'auto',
        padding: '20px 20px 20px 20px',
        marginTop: '50px',
        border: '4px outset white'
    }}>
      {/* move user stake to store */}
      <p style={{fontSize: '24px'}}>Investment Account</p>
      <p style={{margin: 'none'}}>Amount Invested: {stakeAmount} ETH</p>
      <p style={{margin: 'none'}}>Earned Amount: {withdrawBalance} ETH</p>
      <p>Read more about investing with Lost Vegas <a>here.</a> </p>
      <input style={{width: '250px'}}/><button style={{width: '150px', marginLeft: '10px'}} onClick={() => {addStake()}}>Add Stake</button>
      <input style={{width: '250px'}}/><button style={{width: '150px', marginLeft: '10px'}} onClick={() => {withdrawStake()}}>Withdraw Stake</button>
    </div> </>: <></>}
    </>
  )
}