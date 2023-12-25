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
                <li className="float-left logo">Lost Vegas</li>
                <li className="float-left link">Games</li>
                <li className="float-left link">Bank</li>
                { (!loading) ? <li className="float-right link"><ConnectButton/></li> : <></> }
            </ul>
        </div>
    );
};

export default Header;