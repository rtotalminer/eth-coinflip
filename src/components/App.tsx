import { ethers } from 'ethers';
import { useEffect, createContext, useState, useSyncExternalStore, useCallback } from 'react';

import { developmentChains } from '../../config/config';
import { NETWORK } from '../config';
import Connect from './Connect';

import { Store, UserStore } from '../data/store';


const App = () => {
          
    const userStore = useSyncExternalStore(
        UserStore.subscribe,
        UserStore.getSnapshot,
        UserStore.getServerSnapshot
    )

    useEffect(() => {
        UserStore.setState({
            accounts: ["0x000"],
        });
    }, []);
  
    return (
      <div>
        <Connect/>
          {userStore.accounts}
          <button onClick={() => {
                UserStore.setState({
                    accounts: ["0x000"],
                });
            }}>App Component</button> 
      </div>
    );
};

export default App;