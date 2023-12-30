import React, { useEffect, useState } from "react";
import './chips.css';
import {
    BANK_ABI,
    BANK_ADDR,
    CHIPS_ABI,
    IMG_FOLDER
} from "../../../shared/config";
import {
    Contract,
    ethers,
    formatEther,
    parseEther,
    parseUnits
} from "ethers";
import {
    UserStore,
    syncStore
} from "../../../shared/store";
import { Link } from "react-router-dom";
import { formatNaN } from "../../../services/helpers";

export function ExchangeForm(props: any) {
    const [asset2Value, setAsset2Value] = useState('1000000');
    const [exchangeRate, setExchangeRate] = useState(1_000_000);
    
    const [assetFrom, setAssetFrom] = useState('ether');

    const handleAsset1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = (formatNaN(event.target.value) == 0) ? '' : event.target.value;
        props.setAsset1Value(value);
        setAsset2Value((Number(value) * exchangeRate).toString());
    };

    const handleAsset2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = (formatNaN(event.target.value) == 0) ? '' : event.target.value;
        setAsset2Value(value);
        props.setAsset1Value(Number(value) / exchangeRate);
    };

    const handleSwapAssets = () => {
        const tempValue = props.asset1Value;
        props.setAsset1Value(asset2Value);
        setAsset2Value(tempValue);

        const tempAsset = props.assetTo;
        props.setAssetTo(assetFrom);
        setAssetFrom(tempAsset);

        setExchangeRate(1/exchangeRate);
    };

    return (
        <div style={{ paddingTop: '15px' }}>
            <input
                style={{ width: '350px', height: '50px', border: '4px inset #ccc' }}
                type="number"
                value={props.asset1Value}
                onChange={handleAsset1Change}
            />
            <div>
                <i
                    style={{ cursor: 'pointer', fontSize: '28px' }}
                    className="fa fa-exchange"
                    aria-hidden="true"
                    onClick={() => { handleSwapAssets() }}
                ></i>
            </div>
            <input
                style={{ width: '350px', height: '50px', border: '4px inset #ccc' }}
                type="number"
                value={asset2Value}
                onChange={handleAsset2Change}
            />
        </div>
    );
}

export default function Chips() {
    enum ResponseMessage {
        INFO,
        ERROR,
        SUCCESS,
        WAITING
    }

    let userStore = syncStore(UserStore);
    const [responseMsg, setResponseMsg] = useState(ResponseMessage.INFO);

    const [assetTo, setAssetTo] = useState('chips');
    const [asset1Value, setAsset1Value] = useState(1);

    const handleExchange = async () => {
        if (!userStore.connected)  return;
        if (!(asset1Value > 0)) {
            setResponseMsg(ResponseMessage.ERROR);
            return;
        }
        console.log(assetTo);
        if (assetTo == 'ether') {
            console.log(userStore)
            let tx = await userStore.contracts.Bank.redeemChips(parseUnits(asset1Value.toString()))
                .then(() => {
                    setResponseMsg(ResponseMessage.WAITING);
                    // wait forr burn function of erc-20
                    
                })
                .catch((err: any) => {
                    setResponseMsg(ResponseMessage.ERROR);
                    return;
                });
        }
        if (assetTo == 'chips') {
            let tx = await userStore.contracts.Bank.mintChips({ value: parseEther((asset1Value).toString()) })
                .then(() => {
                    setResponseMsg(ResponseMessage.WAITING);
                    let event = userStore.contracts.Chips.on("Transfer", (from: any, to: any, amount: any) => {
                        console.log({from, to, amount});
                        if (to == userStore.user.address) {
                            setResponseMsg(ResponseMessage.SUCCESS);
                            event.remove();
                        }
                    });
                })
                .catch(() => {
                    setResponseMsg(ResponseMessage.ERROR);
                    return;
                });
        }
        return;
    };

    return (
        <>
            <div style={{
                textAlign: 'center',
                outline: 'groove',
                width: '500px',
                margin: 'auto',
                padding: '20px 20px 20px 20px',
                marginTop: '50px',
                border: '4px outset white'
            }}>
                <div className=''>
                    <div style={{ fontSize: '36px' }}>Cashier's Cage</div>
                    <div className='padding-top-s'>Exchange Lost Vegas Chips or Ethereum with the bank.</div>
                    <p style={{marginTop: '10px'}}>1 CHIP = 0.01 ETH</p>
                </div>
                <div>
                    <ExchangeForm assetTo={assetTo} setAssetTo={setAssetTo}
                        asset1Value={asset1Value} setAsset1Value={setAsset1Value} />
                    <div style={{ paddingTop: '10px' }}>
                        {(responseMsg === ResponseMessage.ERROR) ? <div>
                            <span>An error has occurred.</span>
                        </div> : <></>}
                        {(responseMsg === ResponseMessage.INFO) ? <div>
                            <p>For every exchange there is a 10% tax, read more <Link to='/#tax'>here.</Link></p>
                        </div> : <></>}
                        {(responseMsg === ResponseMessage.SUCCESS) ? <>
                            <p>The transaction is succesful, view it <a href='#'>here.</a></p>
                        </> : <></>}
                        {(responseMsg === ResponseMessage.WAITING) ? <div>
                            The bank has began minting, awaiting tokens now...
                        </div> : <></>}

                        <button style={{ fontSize: '18px', marginTop: '15px' }} onClick={handleExchange}>Exchange</button>
                    </div>

                </div>
            </div>
        </>
    );
}
