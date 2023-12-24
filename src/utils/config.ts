
import { Interface } from "ethers";

import { networkConfigs } from "../../utils/config";
import _COINFLIP_ABI from '../../artifacts/contracts/Coinflip.sol/Coinflip.json'


export const COINFLIP_ADDR : string = "0xEce95D6952A1d2a406c4cAC8F94aC3B27C56E1C1";
export const COINFLIP_ABI = new Interface(_COINFLIP_ABI.abi);

export const NETWORK = networkConfigs[0];
export const DEV = true;

export const ASSET_FOLDER = 'src/assets';
export const IMG_FOLDER = `${ASSET_FOLDER}/img`


export const DEV_CONTRACT_KEY = "";
export const DEV_CONTRACT_ADDR = "";



