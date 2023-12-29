import { useEffect, useState } from "react"
import { SystemStore, UserStore, syncStore } from "../../../shared/store";
import { BigNumberish, formatEther, parseEther, parseUnits } from "ethers";
import { BANK_ADDR } from "../../../shared/config";
import { Link } from "react-router-dom";
import { formatNaN } from "../../../services/helpers";

export default function Vault() {
 
  const userStore = syncStore(UserStore);
  const systemStore = syncStore(SystemStore);

  const [bankBalanace, setBankBalance] = useState('0');
  const [investorsBalanace, setInvestorsBalanace] = useState('0');
  const [stakeAmount, setStakeAmount] = useState('0');
  const [poolAPY, setPoolAPY] = useState('0');
  const [withdrawBalance, setWithdrawBalance] = useState('0');

    useEffect(() => {
        if (!userStore.connected && !userStore.provider)  return;
        const load = async () => {
          console.log(userStore)
            if (userStore.signer) {
              await getStake();
              await getWithdrawBalance();
            }
            await getBankBalance();
            await getInvestorsBalance();
            await getPoolAPY();
        } 
        const subToData = async () => {
          // TODO: remember to unsubscribe from this event?
          let bankBalanceEvent = await userStore.contracts.Bank.on("BankBalanceUpdated", (bankBalanace: any) => {
            load();
          }); 
        }
        load().then(() => {subToData()}).catch((err) => {console.log(err)});
  }, [userStore.connected]);

  async function addStake() {
    let tx = await userStore.contracts.Bank.addStake({value: parseEther('1.0')});
    await tx.wait();
  }

  async function withdrawStake() {
    if (!userStore.connected)  return;
    let tx = await userStore.contracts.Bank.withdrawAllStake();
    await tx.wait();
  }

  async function getBankBalance() {
    console.log(userStore.provider)
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
    let poolAPYRaw = Number(_poolEarnings)/Number(_totalInvestorStake);
    let poolAPYFormat = 100*formatNaN(poolAPYRaw);
    setPoolAPY(poolAPYFormat.toString());
  }

  async function getWithdrawBalance() {
    if (!userStore.connected)  return;
    let _totalInvestorStake = await userStore.contracts.Bank.totalInvestorStake();
    let _stakeAmount = await userStore.contracts.Bank.investorsStake(userStore.user.address);
    let _poolEarnings = await userStore.contracts.Bank.poolEarnings();
    let poolAPYRaw = Number(_poolEarnings)/Number(_totalInvestorStake);
    let withdrawBalanceRaw = (1 + Number(poolAPYRaw)) * Number(_stakeAmount);
    let withdrawBalanceFormat =  formatEther(formatNaN(withdrawBalanceRaw).toString()).toString();
    let _withdrawBalance = withdrawBalanceFormat.slice(0, 6);
    setWithdrawBalance(_withdrawBalance);
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
  </> : <></>}
  {(!systemStore.loading && userStore.connected) ? <>
      
    <div style={{
        textAlign: 'center',
        outline: 'groove',
        width: '500px',
        margin: 'auto',
        padding: '20px 20px 20px 20px',
        marginTop: '50px',
        border: '4px outset white'
    }}>
      {/* TODO: move user stake to store */}
      <p style={{fontSize: '24px'}}>Investment Account</p>
      <p style={{margin: 'none'}}>Amount Invested: {stakeAmount} ETH</p>
      <p style={{margin: 'none'}}>Earned Amount: {withdrawBalance} ETH</p>
      <p>Read more about investing with Lost Vegas <Link to='/#investing'>here.</Link> </p>
      
      <input style={{ width: '250px', border: '4px inset #ccc', marginBottom: '5px'}}/><button style={{width: '170px', height: '30px', marginLeft: '10px'}} onClick={() => {addStake()}}>Add Stake</button>
      <input style={{width: '250px', border: '4px inset #ccc'}}/><button style={{width: '170px', marginLeft: '10px', height: '30px'}} onClick={() => {withdrawStake()}}>Withdraw Stake</button>
    </div> 
    </> : <></>}
    </>
  )
}