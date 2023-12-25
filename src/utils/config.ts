
import { Interface } from "ethers";

import { networkConfigs } from "../../utils/config";
import _COINFLIP_ABI from '../../artifacts/contracts/Coinflip.sol/Coinflip.json'


export const COINFLIP_ADDR : string = "0x34fe2471863a64BcfA4677f8e6Cc8BE6B641e1B8";
export const COINFLIP_ABI = new Interface(_COINFLIP_ABI.abi);

export const NETWORK = networkConfigs[0];
export const DEV = true;

export const ASSET_FOLDER = 'src/assets';
export const IMG_FOLDER = `${ASSET_FOLDER}/img`


export const DEV_CONTRACT_KEY = "";
export const DEV_CONTRACT_ADDR = "";


// Contract: VRFCoordinatorV2Mock deployed to 0xB19E610174EF128fCfF93Af3829b11Ed406FDE34
// Contract: VRFv2SubscriptionManagerMock deployed to 0xEdB1D54ceF008D286e928871cEA5dA09979666be
// Contract: Coinflip deployed to 0x34fe2471863a64BcfA4677f8e6Cc8BE6B641e1B8


