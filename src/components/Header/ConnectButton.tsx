// src/components/Connect.tsx

import { useEffect, useRef, useState } from "react";
import { SystemStore, UserStore, defaultUserStore, syncStore } from "../../shared/store";
import { handleConnection } from "../../utils/helpers";
import { disconnect } from "process";

import './header.css'
import { Link } from "react-router-dom";
import { getUserStoreState } from "../../service/user";

const ConnectButton = () => {

    const userStore = syncStore(UserStore);

    async function connectWallet() {
        const userStoreState = await getUserStoreState();
        UserStore.setState(userStoreState);
        localStorage.setItem("isConnected", userStoreState.connected.toString());
    }

    async function disconnectWallet() {
        UserStore.setState(defaultUserStore);
        localStorage.setItem("isConnected", 'false');
    }

    const connectButton = <>
        <span className='float-right link' onClick={() => {connectWallet()}}>
            <b>Connect</b>
        </span> 
    </>

    const accountInfo = <>
        <span className='accountInfo'>
            {userStore.user.address.toString().substring(0,6)}...
            {userStore.user.address.toString().substring(
                userStore.user.address.toString().length - 4,
                userStore.user.address.toString().length
            )}
        </span>
    </>

    const showAccount = <>
        <div className="dropdown float-right link">
            <button className="dropbtn">
                {accountInfo}
                <i className="fa fa-caret-down"></i>
            </button>
            <div className="dropdown-content">
                <Link to="/chips">Chips</Link>
                <Link to="/chips">My Account</Link>
                <a  onClick={() => {disconnectWallet()}} href="#">Disconnect</a>
            </div>
        </div> 
    </>

    return (
        <>
             { (!userStore.connected) ?
                    connectButton :
                    showAccount 
            } 
        </>
    );
};

export default ConnectButton;