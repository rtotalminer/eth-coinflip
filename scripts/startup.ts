
import hre from "hardhat"
import { BASE_FEE, GAS_PRICE_LINK, developmentChains, networkConfigs } from "../utils/config";
import { Contract } from "ethers";
import { deployContract, getABI, sendERC20 } from "../utils/helpers";

const chainId: number = (hre.network.config.chainId == undefined) ? 0 : hre.network.config.chainId;

// start up all contracts for use with eth-coinflip/src/
export async function startup(chainId: number) : Promise<any> {
    let VRFCoordinator : Contract;
    let VRFv2SubscriptionManager : Contract;
    let Coinflip : Contract;
    let Bank : Contract;

    let keyHash = networkConfigs[chainId]?.keyHash ||
        '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc';
    let fundAmount = networkConfigs[chainId]?.fundAmount ||
        "1000000000000000000";
    let signers = await hre.ethers.getSigners();

    if (developmentChains.includes(hre.network.name)) {
        VRFCoordinator = await deployContract('VRFCoordinatorV2Mock', [BASE_FEE, GAS_PRICE_LINK]);   
        VRFv2SubscriptionManager = await deployContract('VRFv2SubscriptionManagerMock', [ VRFCoordinator.target, keyHash])
    }
    else {
        let vrfCoordinator = networkConfigs[chainId]?.vrfCoordinator || 'UNDEFINED';
        let vrfCoordinatorAbi = await getABI(vrfCoordinator);
        
        let linkToken = networkConfigs[chainId]?.linkToken || 'UNDEFINED';
        let linkTokenAbi = await getABI(linkToken);
        
        VRFCoordinator = await new hre.ethers.Contract(vrfCoordinator, vrfCoordinatorAbi);
        VRFv2SubscriptionManager = await deployContract('VRFv2SubscriptionManager', [ VRFCoordinator.target, keyHash, linkToken]);
        
        await sendERC20(linkToken, linkTokenAbi, VRFv2SubscriptionManager.target.toString(), fundAmount.toString());
    }


    await VRFv2SubscriptionManager.topUpSubscription(fundAmount);
    const subscriptionId = await VRFv2SubscriptionManager.s_subscriptionId();

    Bank = await deployContract('Bank', []);  
    await Bank.waitForDeployment();

    Coinflip = await deployContract("Coinflip", [subscriptionId, VRFCoordinator.target, keyHash, Bank.target]);
    await Coinflip.waitForDeployment();

    await VRFv2SubscriptionManager.addConsumer(Coinflip.target);

    await Bank.addAuthorisedCroupier(Coinflip.target);

    return { Coinflip, VRFv2SubscriptionManager, VRFCoordinator, Bank };
}

startup(chainId).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  

