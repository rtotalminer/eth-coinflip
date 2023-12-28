import { JsonRpcApiProviderOptions, JsonRpcSigner, ethers } from "ethers";
import { DEV, NETWORK, allowedNetworks } from "./config";
import { developmentChains, networkConfigs } from "../../utils/config";

export async function handleConnection() {
    let _p = {}; let _a = {}; let _q : any[] = [];
    if (window.ethereum.isMetaMask && !DEV) {
        let signer: JsonRpcSigner | any = {};
        let provider = new ethers.BrowserProvider(window.ethereum);
        let accounts : any[] = await provider.listAccounts();

        let network = await provider.getNetwork();
        let chainId = Number(network.chainId);

        console.log(accounts);

        if (!allowedNetworks.includes(networkConfigs[chainId].name)) {
            return { _p, _a, _q };
        }

        if (accounts.length > 0) {
            signer = await provider.getSigner();
            accounts = [await signer.getAddress()];
        }
        else {
            console.log("Please unlock Metamask");
        }

        return { provider, signer, accounts };
    }
    else if (DEV) {
        const provider = new ethers.JsonRpcProvider(`http://localhost:7545`);
        const signer = await provider.getSigner();
        const accounts = [await signer.getAddress()];
        return { provider, signer, accounts };
   
    }
    return { _p, _a, _q };
}




























// import { ethers } from "ethers";
// import axios from "axios";

// const ETHERSCAN_URL = "https://api-sepolia.etherscan.io";

// // Max rate limit reached, please use API Key for higher rate limit
// export async function getABI(address)
// {
//     let url = `${ETHERSCAN_URL}/api?module=contract&action=getabi&address=` + address + `&format=raw`;
//     let res = await axios.get(url);
//     if (res.data.status == 0) {
//       console.log(res.data.result);
//     }
//     return res.data
// }

// export async function loadABI()
// {
//   //...
// }


// export async function getAccounts()
// {
//   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
//     .catch((err) => {
//       if (err.code === 4001) {
//         console.log('Please connect to MetaMask.');
//       } else {
//         console.error(err);
//       }
//     });
//   return accounts;
// }

// export async function checkConnection()
// {
//   return true;
//   // check window.ethereum

//   // check if correct chain id

//   // check if user accounts 

// }


