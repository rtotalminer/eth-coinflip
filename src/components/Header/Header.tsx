// src/components/Connect.tsx

import { useEffect } from "react";

import ConnectButton from "./ConnectButton";

import './header.css';

interface HeaderProps {
    loading: boolean;
  }
  
const Header: React.FunctionComponent<HeaderProps> = ({loading}: HeaderProps) => {

    useEffect(() => {
        
    }, []);

    return (
        <div className="header">
            <ul className='container'>
                <li className="float-left link">Lost Vegas</li>
                <li className="float-left link">Gaming</li>
                <li className="float-left link">Governance</li>
                <li className="float-left link">Bank</li>
                <li className="float-left link">About</li>
                { (!loading) ? <li className="float-right link"><ConnectButton/></li> : <></> }
            </ul>
        </div>
    );
};

export default Header;