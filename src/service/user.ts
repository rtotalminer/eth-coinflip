
// f(x): get the provider and set it to the store...

import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { IUser, IUserStoreState, UserStore, defaultUserStore } from "../shared/store";
import { ALLOWED_NETWORKS } from "../shared/config";
import { BANK_ABI, BANK_ADDR, CHIPS_ABI } from "../utils/config";
import { ConstructionOutlined } from "@mui/icons-material";

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
    let provider : BrowserProvider;
    let userStoreState : IUserStoreState = { user: user, connected: false, provider: {}, signer: signer};
    
    if (window?.ethereum.isMetaMask || window?.ethereum.isConnected()) {
        if ((await window.ethereum._metamask.isUnlocked()) == false) {
            return userStoreState;
        }
        provider = new ethers.BrowserProvider(window.ethereum);
        let network = await provider.getNetwork();
        if ((!ALLOWED_NETWORKS.includes(network.name))) {
            return userStoreState;
        }
        signer = await provider.getSigner();
        let address = await signer.getAddress()
        let chips = await getUserChipsBalance(address, signer);
        user = {address: address, chips: chips};
        return {user: user, connected: true, provider: provider, signer: signer};
    }
    return userStoreState;
}

export async function connectWallet() {
    const userStoreState = await getUserStoreState();
    UserStore.setState(userStoreState);
    localStorage.setItem("isConnected", userStoreState.connected.toString());
}

export async function disconnectWallet() {
    UserStore.setState(defaultUserStore);
    localStorage.setItem("isConnected", 'false');
}

export async function handleAccountsChanged(_accounts: string[], ) {
  window.location.reload();
}

export async function handleChainChanged(chainId : number) {
  window.location.reload();
}