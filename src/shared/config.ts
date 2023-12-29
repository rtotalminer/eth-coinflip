
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

export const COINFLIP_ADDR : string = "0x8962487e0bBbAEc3762FCaDF4C93356C8B798C5E";
export const COINFLIP_ABI = new Interface(_COINFLIP_ABI.abi);

export const BANK_ADDR : string = "0xdFB1f8A4F8c1B8bABcF077DCe5f81C1347D9fcBE";
export const BANK_ABI = new Interface(_BANK_ABI.abi);

export const CHIPS_ABI = new Interface(_CHIPS_ABI.abi);

export const NETWORK = networkConfigs[0];
export const DEV = false;

export const ASSET_FOLDER = 'src/assets';
export const IMG_FOLDER = `${ASSET_FOLDER}/img`


export const DEV_CONTRACT_KEY = "";
export const DEV_CONTRACT_ADDR = "";

export const allowedNetworks = ['hardhat', 'ganache'];

export const VERSION = {
  name: 'genesis',
  id: '0.1'
}


// Contract: VRFCoordinatorV2Mock deployed to 0xB19E610174EF128fCfF93Af3829b11Ed406FDE34
// Contract: VRFv2SubscriptionManagerMock deployed to 0xEdB1D54ceF008D286e928871cEA5dA09979666be
// Contract: Coinflip deployed to 0x34fe2471863a64BcfA4677f8e6Cc8BE6B641e1B8


