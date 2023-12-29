import { useEffect, useState } from "react"
import { SystemStore, UserStore, syncStore } from "../../../shared/store";
import { formatEther, parseEther, parseUnits } from "ethers";
import { BANK_ADDR } from "../../../shared/config";

export default function Vault() {
 
  const userStore = syncStore(UserStore);
  const systemStore = syncStore(SystemStore);

  const [bankBalanace, setBankBalance] = useState('0');

    useEffect(() => {
        if (!userStore.connected)  return;
        const load = async () => {
            console.log(userStore);
            const balance = await userStore.provider.getBalance(BANK_ADDR);            
            let _bankBalance = formatEther(balance.toString()).toString();
            console.log(_bankBalance);
            setBankBalance(_bankBalance);
        } 
        load().then().catch((err) => {console.log(err)});
  }, [systemStore.loading]);

  async function addStake() {

  }
  
  async function withdrawStake() {

  }

  return (<>
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
        <p style={{fontSize: '48px'}}>The bank holds {bankBalanace} ETH</p>
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
      <p style={{fontSize: '32px'}}>Investment Account</p>
      <p>You currently hold {0} ETH in the bank, to find out more abouot </p>
      <input/><button onClick={() => {addStake()}}>Add Stake</button>
      <input/><button onClick={() => {withdrawStake()}}>Withdraw Stake</button>
    </div>
    </>
  )
}