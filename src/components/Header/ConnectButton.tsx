// src/components/Connect.tsx

import { useEffect } from "react";
import { UserStore, syncStore } from "../../data/store";
import { handleConnection } from "../../utils/helpers";
import { disconnect } from "process";

const ConnectButton = () => {

    const userStore = syncStore(UserStore);
    
    async function connectWallet() {
        const { provider, signer, accounts } = await handleConnection();
        UserStore.setState({accounts: accounts, signer: signer, provider: provider});
    }

    async function disconnectWallet() {
        UserStore.setState({accounts: [], signer: {}, provider: {}});
    }

    const connectButton = <>
        <button onClick={() => {connectWallet()}}>
            Connect
        </button> 
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

    useEffect(() => {
        
    }, []);

    return (
        <>
            { userStore.accounts[0] == undefined ?
                connectButton :
                showAccount
            }
        </>
    );
};

export default ConnectButton;