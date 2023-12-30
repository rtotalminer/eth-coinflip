// src/components/Connect.tsx

import { useEffect, useRef, useState } from "react";


import './header.css';
import { Link } from "react-router-dom";
import { SystemStore, UserStore, syncStore } from "../../../shared/store";

import { connectWallet, disconnectWallet } from "../../../services/user";
import { BANK_ABI, BANK_ADDR, BASE_URL, CHIPS_ABI, IMG_FOLDER } from "../../../shared/config";
import { ethers, formatEther } from "ethers";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

const gameLinks = [
    {title: 'Coinflip (new) 🟡', link: '/coinflip'},
    {title: 'Slots - Coming Soon!', link: '/slots'},
    {title: 'Blackjack - Coming Soon!', link: '/blackjack'},
]

const bankLinks = [
    {title: `Cashier's Cage 💰`, link: '/chips'},
    {title: `The Vault 🏦`, link: '/vault'}
]

const shopLinks = [
    {title: `Drops`, link: '/drops'},
    {title: `Merchandise`, link: '/merchandise'}
]


export function DropdownNavButton(props: any) {
    return (
        <div className="dropdown link">
            <div className="dropbtn" style={{fontSize: '18px'}}>{props.title}
                <i style={{paddingLeft: '10px'}} className="fa fa-caret-down"></i>
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

    const userStore = syncStore(UserStore);

    useEffect(() => {
        if (!userStore.connected)  return;
        const load = async () => {
            let chips = await userStore.contracts.Chips.balanceOf(userStore.user.address);
            userStore.user.chips = chips;
            UserStore.setState(userStore);
        } 
        const sub = async () => {
          // TODO: remember to unsubscribe from this event?
          let event = await userStore.contracts.Chips.on("Transfer", (from: any, to: any, value: any) => {
            if (from || to == userStore.user.address)
                console.log('updatinig coins bal')
                load();
          }); 
        }
        load().then(() => {sub()}).catch((err) => {console.log(err)});
  }, [userStore.connected]);

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
        <div className='float-right' onClick={() => {connectWallet().catch((err) => console.error(err))}}>
            <span className='llink link' style={{fontSize: '18px'}}>Connect</span>
        </div> 
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
            <div className="dropbtn" style={{fontSize: '18px'}}>
                {accountInfo}
                <i className="fa fa-caret-down"></i>
            </div>
            <div className="dropdown-content">
                <Link to={`${BASE_URL}/chips`}>My Account</Link>
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
                <Link to='/' className='logo link' style={{paddingRight: '30px'}}>
                    Lost Vegas
                </Link>
                <DropdownNavButton title='Games' links={gameLinks}/>
                <DropdownNavButton title='Bank' links={bankLinks}/>
                <DropdownNavButton title='Shop' links={shopLinks}/>

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