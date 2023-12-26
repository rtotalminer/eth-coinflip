// src/components/Connect.tsx

import { useEffect, useRef, useState } from "react";
import { UserStore, syncStore } from "../../utils/store";
import { handleConnection } from "../../utils/helpers";
import { disconnect } from "process";

const ConnectButton = () => {

    const userStore = syncStore(UserStore);
    const [ accounts, setAccounts] = useState(userStore?.accounts || []);

    async function connectWallet() {
        localStorage.setItem("isConnected", "true");
        const { provider, signer, accounts } = await handleConnection();
        UserStore.setState({accounts: accounts, signer: signer, provider: provider});
    }

    async function disconnectWallet() {
        localStorage.setItem("isConnected", "false");
        UserStore.setState({accounts: [], signer: {}, provider: {}});
    }

    const connectButton = <>
        <span onClick={() => {connectWallet()}}>
            <b>Connect</b>
        </span> 
    </>

    const showAccount = <>
        <span className='accountInfo' onClick={() => {disconnectWallet()}}>
            {userStore.accounts.toString().substring(0,6)}...
            {userStore.accounts.toString().substring(
                userStore.accounts.toString().length - 4,
                userStore.accounts.toString().length
            )}
        </span>
    </>

    return (
        <>
             { (userStore.accounts.length == 0) ?
                connectButton :
                showAccount
            } 
        </>
    );
};

export default ConnectButton;