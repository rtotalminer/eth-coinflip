
import { Interface } from "ethers";

import { networkConfigs } from "../../utils/config";
import _COINFLIP_ABI from '../../artifacts/contracts/Coinflip.sol/Coinflip.json'


export const COINFLIP_ADDR : string = "0xa3e08F85984fDCcB2bb4B3432E23D62b480f2e1E";
export const COINFLIP_ABI = new Interface(_COINFLIP_ABI.abi);

export const NETWORK = networkConfigs[0];
export const DEV = false;

export const ASSET_FOLDER = 'src/assets';
export const IMG_FOLDER = `${ASSET_FOLDER}/img`


export const DEV_CONTRACT_KEY = "";
export const DEV_CONTRACT_ADDR = "";

export const allowedNetworks = ['hardhat', 'ganache']


// Contract: VRFCoordinatorV2Mock deployed to 0xB19E610174EF128fCfF93Af3829b11Ed406FDE34
// Contract: VRFv2SubscriptionManagerMock deployed to 0xEdB1D54ceF008D286e928871cEA5dA09979666be
// Contract: Coinflip deployed to 0x34fe2471863a64BcfA4677f8e6Cc8BE6B641e1B8


