
import { useEffect, useState } from "react";

import './chips.css';
import { BANK_ABI, BANK_ADDR, CHIPS_ABI } from "../../utils/config";
import { ethers, formatEther, parseEther } from "ethers";
import { UserStore, syncStore } from "../../shared/store";
import { ContentPasteOffSharp } from "@mui/icons-material";

  
const Chips = () => {

    let userStore = syncStore(UserStore);
    const [asset1Value, setAsset1Value] = useState(0);
    const [asset2Value, setAsset2Value] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(1_000_000);
    const [chips, setChips] = useState('');

    let loading = false;

    const [chipsTokenAddress, setChipsTokenAddress] = useState('');

    useEffect(() => {
        if (loading)  return;
        const load = async () => {
            await getChipsBalance();
        }
        load().then(() => {
        }).catch(() => {});
    }, [loading]);

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
            <div className='centre text-align-centre padding-top-s'>
                <div className=''>
                    <div className='font-large'>Chips</div>
                    <div>{chipsTokenAddress}</div>
                    <div className='padding-top-s'>Exchange chips with the bank.</div>
                </div>
                {chips}
                <div>
                    <div>
                        <label>{assetFrom}</label>
                        <input type="number" value={asset1Value} onChange={handleAsset1Change} />
                    </div>
                    <div>
                        <label>{assetTo}</label>
                        <input type="number" value={asset2Value} onChange={handleAsset2Change} />
                    </div>
                    <div>
                        <button onClick={handleSwapAssets}>S</button>
                        <button onClick={handleExchange}>Exchange</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chips;