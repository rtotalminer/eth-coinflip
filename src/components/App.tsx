import { useEffect } from 'react';
import ConnectButton from './ConnectButton';
import { ethers } from 'ethers';
import { UserStore } from '../data/store';

const App = () => {

    useEffect( () => {
        
    }, [])
  
    return (
        <div>
            <ConnectButton/>
        </div>
    );
};

export default App;