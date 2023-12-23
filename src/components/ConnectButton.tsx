// src/components/Connect.tsx

import { useContext, useRef, useSyncExternalStore } from "react";
import { Store, UserStore, syncStore } from "../data/store";
import { ethers } from "ethers";

const ConnectButton = () => {

    const userStore = syncStore(UserStore);
    
    async function connectWallet() {
    }

    const connectButton = <>
        <button onClick={() => {connectWallet()}}>
            Connect
        </button> 
    </>

    return (
        <>
            { userStore.accounts.length == 0 ?
                connectButton :
                <></>
            }
        </>
    );
};

export default ConnectButton;