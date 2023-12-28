// src/components/Connect.tsx

import { useEffect, useRef, useState } from "react";


import './header.css';
import { Link } from "react-router-dom";
import { SystemStore, syncStore } from "../../shared/store";

import { ChipsInfo } from "./ChipsInfo";
import ConnectButton from "./ConnectButton";

  
const Header = () => {

    const systemStore = syncStore(SystemStore);

    const loadedElement =  <>
        <ConnectButton/>
        <ChipsInfo/>
    </>
    
    return (
        <div>
            <ul className='container'>
                <li className="float-left logo"><Link to='/'>!-- DeVeGas --!</Link></li>
                <div className="dropdown float-left link">
                    <button className="dropbtn">Games 
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <a href="#">Slots</a>
                        <Link to="/coinflip">Coinflip</Link>
                    </div>
                </div>
                <div className="dropdown float-left link">
                    <button className="dropbtn">Bank 
                        <i className="fa fa-caret-down"></i>
                    </button>
                    <div className="dropdown-content">
                        <Link to="/chips">Chips</Link>
                        <a href="#">Vault</a>
                    </div>
                </div>
                {(systemStore.loading) ? <></> : (loadedElement)}
            </ul>
        </div>
    );
};

export default Header;