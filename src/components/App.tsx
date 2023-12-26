import { useEffect, useState } from "react";
import { handleConnection } from "../utils/helpers";
import { UserStore, syncStore } from "../utils/store";
import Header from "./Header/Header";
import Coinflip from "./Coinflip/Coinflip";

import "../assets/img/goldcoin.png";
import "../assets/img/spritesheet.png";

import "../assets/img/goldcoinv2_0.png";
import "../assets/img/goldcoinv2_1.png";
import "../assets/img/goldcoinv2_2.png";

import "../assets/img/spinning-coin.png";
import "../assets/img/spinning-coin2.png";
import "../assets/img/spinning-coin3.png";
import "../assets/img/spinning-coin4.png";

import "../assets/img/error.gif"

import './App.css';
import { IMG_FOLDER } from "../utils/config";

const App = () => {

    if (window.ethereum != undefined) {
        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    async function handleAccountsChanged(_accounts: string[]) {
        const { provider, signer, accounts } = await handleConnection();
        UserStore.setState({accounts: accounts, signer: signer, provider: provider});
        
        window.location.reload();
    }

    function handleChainChanged(chainId : number) {
        window.location.reload();
    }

    const userStore = syncStore(UserStore);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        // declare the data fetching function
        const init = async () => {
            //console.log(userStore)
            if (localStorage.getItem("isConnected") == 'true') {
                const { provider, signer, accounts } = await handleConnection();
                UserStore.setState({accounts: accounts, provider: provider, signer: signer});
                console.log(provider);
            }
        }
      
        init()
            .then(() => {
                setLoading(false);
            })
            .catch(console.error);
      }, []);


  
    return (
        <div>
            <Header loading={loading} />
            {
                (!loading) ?
                    ((userStore.accounts != undefined) ? userStore.accounts.length > 0 : false) ?
                        <Coinflip /> :
                        <div className="centre">
                            <span className="centre color-red">Please connect using metamask.</span>
                        </div>
                : <></>
            }
        </div>
    );
};

export default App;