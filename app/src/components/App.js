import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ethers } from "ethers"
import Coinflip from './Coinflip/Coinflip';
import { getABI } from '../helpers';
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import { COINFLIP_ADDR } from "../config";

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

class DataStore {
  coinflipABI = {};

  constructor() {
      makeAutoObservable(this)
  }

  async setCoinflipABI() {
      this.coinflipABI = await getABI(COINFLIP_ADDR);
  }
}

const dataStore = new DataStore()
await dataStore.setCoinflipABI();

const App = () => {

  return (
    <>
      <Coinflip dataStore={dataStore} signer={signer}/>
    </>
  );
};

export default App;