
// LOCAL STORAGE
export const LOCAL_STORAGE = {
  CONNECTION: 'isConnected',
  DARK_MODE: 'darkMode'
}

// MISC. CONSTANTS

// WEB3 CONFIG
export const ALLOWED_NETWORKS =  ['unknown', 'sepolia']


import { Interface } from "ethers";

import { networkConfigs } from "../../utils/config";

import _COINFLIP_ABI from '../../artifacts/contracts/Coinflip.sol/Coinflip.json'
import _BANK_ABI from '../../artifacts/contracts/DeVegasChips.sol/Bank.json'

import _CHIPS_ABI from '../../artifacts/contracts/DeVegasChips.sol/DeVegasChips.json'

export const COINFLIP_ADDR : string = "0xaBcfB06099b3F018e9942eC539126634b4080940";
export const COINFLIP_ABI = new Interface(_COINFLIP_ABI.abi);

export const BANK_ADDR : string = "0x36d1D0e9c3019dA4566770B891dC7c2De3F5c801";
export const BANK_ABI = new Interface(_BANK_ABI.abi);

export const CHIPS_ABI = new Interface(_CHIPS_ABI.abi);

export const NETWORK = networkConfigs[0];
export const DEV = true;

export const ASSET_FOLDER = 'src/assets';
export const IMG_FOLDER = `${ASSET_FOLDER}/img`

export const GANACHE_URL = 'http://127.0.0.1:7545';

export const DEV_CONTRACT_KEY = "";
export const DEV_CONTRACT_ADDR = "";

export const allowedNetworks = ['hardhat', 'ganache'];

export const VERSION = {
  name: 'genesis',
  id: '0.1'
}

const GHPAGES_URL = '/eth-coinflip';
const BASIC_URL = '';
export const BASE_URL = BASIC_URL;



