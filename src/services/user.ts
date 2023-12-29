
// f(x): get the provider and set it to the store...

import { BrowserProvider, Contract, JsonRpcProvider, JsonRpcSigner, ethers } from "ethers";

import { IContracts, IUser, IUserStoreState, UserStore, defaultUserStore } from "../shared/store";

import { ALLOWED_NETWORKS, COINFLIP_ADDR, DEV, GANACHE_URL } from "../shared/config";
import { BANK_ABI, BANK_ADDR, CHIPS_ABI, COINFLIP_ABI } from "../shared/config";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";


export async function getUserChipsBalance(of: string, signer: any) : Promise<string> {
    let bankContract = new ethers.Contract(BANK_ADDR, BANK_ABI, signer);
    let chipsTokenAddr = await bankContract.CHIPS_TOKEN();
    let chipsToken = new ethers.Contract(chipsTokenAddr, CHIPS_ABI, signer);
    let bal = await chipsToken.balanceOf(of);
    console.log(bal);
    return bal;
}

// Tries to connect to a user and return a store.
export async function getUserStoreState() : Promise<IUserStoreState> { // TODO: Return an IError
    let user : IUser = { address: '', chips: '' }
    let signer: JsonRpcSigner | any = {};
    let provider : BrowserProvider | JsonRpcProvider;
    let contracts : IContracts = {};
    
    if (window?.ethereum?.isMetaMask || window?.ethereum?.isConnected()) {
        if ((await window.ethereum._metamask.isUnlocked()) == false) {
            return defaultUserStore;
        }
        provider = new ethers.BrowserProvider(window.ethereum);
        let network = await provider.getNetwork();
        if ((!ALLOWED_NETWORKS.includes(network.name))) {
            return defaultUserStore;
        }
    }

    else if ( (!window?.ethereum || window?.ethereum == undefined) && DEV) {
        provider = new JsonRpcProvider(GANACHE_URL);
    }

    else {
        return defaultUserStore;
    }

    signer = await provider.getSigner();
    let address = await signer.getAddress();

    contracts.Coinflip = new Contract(COINFLIP_ADDR, COINFLIP_ABI, signer);
    contracts.Bank = new Contract(BANK_ADDR, BANK_ABI, signer);
    contracts.Chips = new Contract(await contracts.Bank.CHIPS_TOKEN(), CHIPS_ABI, signer);

    let chips = await contracts.Chips.balanceOf(address).catch((err) => console.error);
    user = {address: address, chips: chips};

    return {user: user, connected: true, provider: provider, signer: signer, contracts: contracts};
}

export function getUserStateReadOnly() {
    ;
}

export async function connectWallet() {
    console.log('connecting wallet');
    const userStoreState = await getUserStoreState();
    console.log(userStoreState);
    UserStore.setState(userStoreState);
    localStorage.setItem("isConnected", userStoreState.connected.toString());
}

export async function disconnectWallet() {
    UserStore.setState(defaultUserStore);
    localStorage.setItem("isConnected", 'false');
    handleAccountsChanged([]);
}

export async function handleAccountsChanged(_accounts: string[], ) {
  window.location.reload();
}

export async function handleChainChanged(chainId : number) {
  window.location.reload();
}