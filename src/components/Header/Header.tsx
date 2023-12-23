// src/components/Connect.tsx

import { useEffect } from "react";

import ConnectButton from "./ConnectButton";

import './header.css';

const Header = () => {

    useEffect(() => {
        
    }, []);

    return (
        <div className="header">
            <ul className='container'>
                <li className="float-left link">Lost Vegas</li>
                <li className="float-left link">Gaming</li>
                <li className="float-left link">Governance</li>
                <li className="float-left link">About</li>
                <li className="float-right link"><ConnectButton/></li>
            </ul>
        </div>
    );
};

export default Header;