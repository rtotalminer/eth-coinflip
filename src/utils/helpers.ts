import { ethers } from "ethers";

export async function handleConnection() {
    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
        console.log(signer);
        const accounts = await 1;
    }
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


