
import { Interface } from "ethers";

import { networkConfigs } from "../../config/config";
import _COINFLIP_ABI from '../../artifacts/contracts/Coinflip.sol/Coinflip.json'


export const COINFLIP_ADDR : string = "0xCDfaFeBC280016FBA382630c68A9fEbc7Fce503B";
export const COINFLIP_ABI = new Interface(_COINFLIP_ABI.abi);

export const NETWORK = networkConfigs[0];
export const DEV = true;

export const ASSET_FOLDER = 'src/assets';
export const IMG_FOLDER = `${ASSET_FOLDER}/img`


export const DEV_CONTRACT_KEY = "";
export const DEV_CONTRACT_ADDR = "";



