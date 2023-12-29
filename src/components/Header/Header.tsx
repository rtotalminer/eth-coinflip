// src/components/Connect.tsx

import { useEffect, useRef, useState } from "react";


import './header.css';
import { Link } from "react-router-dom";
import { SystemStore, UserStore, syncStore } from "../../shared/store";

import { connectWallet, disconnectWallet } from "../../service/user";
import { BANK_ABI, BANK_ADDR, CHIPS_ABI, IMG_FOLDER } from "../../shared/config";
import { ethers, formatEther } from "ethers";

const gameLinks = [
    {title: 'Coinflip (new)', link: '/coinflip'},
    {title: 'Slots - Coming Soon!', link: '/slots'},
    {title: 'Blackjack - Coming Soon!', link: '/blackjack'},
]

const bankLinks = [
    {title: `Cashier's Cage`, link: '/chips'},
    {title: `The Vault`, link: '/vault'}
]

export function DropdownNavButton(props: any) {
    return (
        <div className="dropdown link">
            <div className="dropbtn">{props.title}
                <i className="fa fa-caret-down"></i>
            </div>
            <div className="dropdown-content">
                {props.links.map((link: any, i: any) => (
                    <Link key={i} to={link.link}>{link.title}</Link>
                ))}
            </div>
        </div>  
    )
} 

export function ChipsInfo() {

    const [chipsBalance, setChipsBalane] = useState(0);
    const userStore = syncStore(UserStore);

    return (
        <>
            {(!userStore.connected) ? <></> :
            <>
                <img
                    src={`${IMG_FOLDER}/gold_pile.png`}
                    width={32}
                    height={32}
                />
                <li className="float-right" style={{paddingRight: '2.5em'}}>
                    {formatEther(userStore.user.chips.toString())}
                </li>
            </>
            }
        </>
    )

}

function ConnectButton() {

    const userStore = syncStore(UserStore);

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

    const showAccount = 
        <div className="dropdown link">
            <div className="dropbtn">
                {accountInfo}
                <i className="fa fa-caret-down"></i>
            </div>
            <div className="dropdown-content">
                <Link to="/chips">My Account</Link>
                <a onClick={() => {disconnectWallet()}} href="#">Disconnect</a>
            </div>
        </div> 

    return (
        <>
             { (!userStore.connected) ?
                    connectButton :
                    showAccount 
            } 
        </>
    );
};
  
export default function Header() {

    const systemStore = syncStore(SystemStore);

    return (
        <div id='header' className="container">
            <div id='navbar' className='align-items-center float-left display-flex padding-10px'>
                <Link to='/' className='logo link'>
                    Lost Vegas
                </Link>
                <DropdownNavButton title='Games' links={gameLinks}/>
                <DropdownNavButton title='Bank' links={bankLinks}/>
            </div>
            <div id='info' className='align-items-center float-right display-flex padding-10px'>
                {(!systemStore.loading) ? (
                    <>
                        <ChipsInfo/>
                        <ConnectButton/>
                    </>
                ) : <></>}
            </div>
        </div>
    );
};