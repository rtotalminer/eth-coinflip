
// f(x): get the provider and set it to the store...

import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { IUser, IUserStoreState } from "../shared/store";
import { ALLOWED_NETWORKS } from "../shared/config";

export async function getUserChipsBalance(address: string) : Promise<string> {
    return '0';
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
        user = {address: await signer.getAddress(), chips: await getUserChipsBalance(user.address)};
        return {user: user, connected: true, provider: provider, signer: signer};
    }
    return userStoreState;
}

export async function testyMctest() : Promise<object> {
    return {please: 'work'};
}

export async function handleAccountsChanged(_accounts: string[], ) {
  window.location.reload();
}

export async function handleChainChanged(chainId : number) {
  window.location.reload();
}