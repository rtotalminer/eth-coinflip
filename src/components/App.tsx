import { useEffect, useState } from "react";
import { handleConnection } from "../utils/helpers";
import { UserStore, syncStore } from "../data/store";
import Header from "./Header/Header";
import Coinflip from "./Coinflip/Coinflip";


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
          {!loading && (
            <>
              <Header />
              <Coinflip />
              {/* Add other components as needed */}
            </>
          )}
        </div>
    );
};

export default App;