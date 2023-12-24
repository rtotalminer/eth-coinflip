import { useEffect, useState } from "react";
import { handleConnection } from "../utils/helpers";
import { UserStore, syncStore } from "../data/store";
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

const App = () => {

    const userStore = syncStore(UserStore);

    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    async function handleAccountsChanged(_accounts: string[]) {
        const { provider, signer, accounts } = await handleConnection();
        UserStore.setState({accounts: accounts, signer: signer, provider: provider});
        window.location.reload();
    }

    function handleChainChanged(chainId : number) {
        window.location.reload();
    }


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // declare the data fetching function
        const init = async () => {
            const { provider, signer, accounts } = await handleConnection();
            UserStore.setState({accounts: accounts, signer: signer, provider: provider});
        }
      
        init()
          .catch(console.error);

        setLoading(false);
      }, [])
  
    return (
        <div>
            <>
              <Header />
              <Coinflip />
              {/* Add other components as needed */}
            </>
        </div>
    );
};

export default App;