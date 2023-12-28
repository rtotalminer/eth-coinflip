
import { useEffect, useState } from "react";

import './chips.css';
import { BANK_ABI, BANK_ADDR, CHIPS_ABI, IMG_FOLDER } from "../../utils/config";
import { ethers, formatEther, parseEther } from "ethers";
import { UserStore, syncStore } from "../../shared/store";
import { ContentPasteOffSharp } from "@mui/icons-material";

function ExchangeForm() {
    return (
        <></>
    )
}

  
const Chips = () => {

    let userStore = syncStore(UserStore);
    const [asset1Value, setAsset1Value] = useState(0);
    const [asset2Value, setAsset2Value] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(1_000_000);
    const [chips, setChips] = useState('');

    let loading = false;

    const [chipsTokenAddress, setChipsTokenAddress] = useState('');

    useEffect(() => {
        const load = async () => {
            let bankContract = new ethers.Contract(BANK_ADDR, BANK_ABI, userStore.signer);
            let chipsTokenAddr = await bankContract.CHIPS_TOKEN();
            setChipsTokenAddress(chipsTokenAddr);
        }
        load().then(() => {
        }).catch(() => {});
    }, []);

    const [assetFrom, SetAssetFrom] = useState('ether');
    const [assetTo, setAssetTo] = useState('chips');
  
    const handleAsset1Change = (event: any) => {
      const value = parseFloat(event.target.value);
      setAsset1Value(value);
      setAsset2Value(value * exchangeRate);
    };
  
    const handleAsset2Change = (event: any) => {
      const value = parseFloat(event.target.value);
      setAsset2Value(value);
      setAsset1Value(value / exchangeRate);
    };
  
    const handleExchangeRateChange = (event: any) => {
      const value = parseFloat(event.target.value);
      setExchangeRate(value);
      setAsset2Value(asset1Value * value);
    };

    async function getChipsBalance() {
        let bankContract = new ethers.Contract(BANK_ADDR, BANK_ABI, userStore.signer);
        let chipsTokenAddr = await bankContract.CHIPS_TOKEN();
        setChipsTokenAddress(chipsTokenAddr);
        let chipsToken = new ethers.Contract(chipsTokenAddr, CHIPS_ABI, userStore.signer);
        let bal = await chipsToken.balanceOf(userStore.accounts[0]);
        console.log(`Balance of ${userStore.accounts[0]} is ${formatEther(bal.toString())}`)
        setChips(formatEther(bal.toString()));
    }
  
    const handleSwapAssets = () => {
        // Swap the values of Asset 1 and Asset 2
        const tempValue = asset1Value;
        setAsset1Value(asset2Value);
        setAsset2Value(tempValue);

        const tempVal = assetTo;
        setAssetTo(assetFrom);
        SetAssetFrom(assetTo);

        setExchangeRate(1/1_000_000);
  
    };

    const handleExchange = async () => {
        if (assetTo == 'ether') {
            let bankContract = new ethers.Contract(BANK_ADDR, BANK_ABI, userStore.signer);
            await bankContract.redeemChips(parseEther(asset1Value.toString()));
        }
        if (assetTo == 'chips') {
            await getChipsAddress();
            console.log(chipsTokenAddress);
            let bankContract = new ethers.Contract(BANK_ADDR, BANK_ABI, userStore.signer);
            await bankContract.mintChips({value: parseEther(asset1Value.toString())});
        }
        return;
    }

    async function getChipsAddress() {
        let bankContract = new ethers.Contract(BANK_ADDR, BANK_ABI, userStore.signer);
        let addr = await bankContract.getBalance()//await bankContract.CHIPS_TOKEN();
        setChipsTokenAddress(addr.toString());
    }

    async function redeemChips() {
        let bankContract = new ethers.Contract(BANK_ADDR, BANK_ABI, userStore.signer);
        let txMint = await bankContract.redeemChips(10000);
        await txMint.wait();
    }

    return (
        <>
            <div style={{
                    textAlign: 'center',
                    outline: 'groove',
                    width: '400px',
                    margin: 'auto',
                    padding: '20px'
                }}>
                <div className=''>
                    <div style={{fontSize: '36px'}}>DeVegas Chips</div>
                    <div className='padding-top-s'>Exchange DeVegas Chips or Ethereum with the bank.</div>
                </div>
                {chips}
                <div>
                    <div style={{paddingTop: '10px'}}>
                        <input
                            style={{width: '350px', height: '50px'}}
                            type="number"
                            value={asset1Value}
                            onChange={handleAsset1Change}
                        />
                    </div>
                    <div>
                        <i onClick={handleSwapAssets} style={{cursor: 'pointer', fontSize: '28px'}} className="fa fa-exchange" aria-hidden="true"></i>
                    </div>
                    <div>
                        <input
                            style={{width: '350px', height: '50px'}}
                            type="number"
                            value={asset2Value}
                            onChange={handleAsset2Change}
                        />
                    </div>
                    <div style={{paddingTop: '10px'}}>
                        <p>There is a 10% tax on all exchange transactions. To find out more please follow this <a>link.</a></p>
                        <p>1 CHIP = 0.01 ETH</p>
                        <button onClick={handleExchange}>Exchange/Mint</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chips;