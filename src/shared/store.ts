import { Contract } from "ethers";
import { connect } from "http2";
import { useSyncExternalStore } from "react";


// base store
export const Store = <Type>(initialState: Type) => {
    let state = initialState;
    const listeners = new Set<() => void>();
  
    function setState(newState: object) {
      state = {
        ...state,
        ...newState,
      };
      listeners.forEach(listener => listener());
    }
  
    function getSnapshot() {
      return state;
    }
  
    function subscribe(listener: () => void) {
      listeners.add(listener);
  
      return () => {
        listeners.delete(listener);
      };
    }
  
    // returns the snapshot used during server rendering
    function getServerSnapshot() {
      return state;
    }
 
    return {
      setState,
      getSnapshot,
      subscribe,
      getServerSnapshot,
    };
};

interface IStore {
    subscribe(listener: () => void) : any;
    getSnapshot() : any;
    getServerSnapshot() : any;
}

export function syncStore(_store: IStore) {
    return useSyncExternalStore(
        _store.subscribe,
        _store.getSnapshot,
        _store.getServerSnapshot
    );  
}


//  user store
export interface IUser {
    address : string;
    chips : string;
}

export interface IContracts {
  Coinflip?: Contract,
  Bank?: Contract,
  Chips?: Contract
}

export interface IUserStoreState {
  user: IUser;
  connected: boolean;
  provider: object;
  signer: object;
  contracts: IContracts;
}

export const defaultContracts : IContracts = {}
export const defaultUser : IUser = {address: '', chips: ''}
export const defaultUserStore : IUserStoreState = {
  user: defaultUser,
  connected: false,
  provider: {},
  signer: {},
  contracts: defaultContracts
}
export const UserStore = Store(defaultUserStore);


// system store
export interface ISystemStoreState {
    loading: boolean;
    darkMode: boolean;
}

export const defaultSystemStore : ISystemStoreState = {
    loading: true,
    darkMode: false,
}

export const SystemStore = Store(defaultSystemStore);
