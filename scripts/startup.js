// startup.js

const hre = require("hardhat");

const { deployContract, verifyContract, sendERC20, getABI } = require("./helpers.js");
const { SEPOLIA_COORDINATOR, SEPOLIA_LINK_ADDR } = require("../config/config.js");

async function createSubscriptionManager(funding)
{
    // Create the Subscription Manager
    let VRFv2SubscriptionManager = await deployContract("VRFv2SubscriptionManager", [SEPOLIA_COORDINATOR]);
    await VRFv2SubscriptionManager.deploymentTransaction().wait(funding);
    await verifyContract(VRFv2SubscriptionManager.target, [SEPOLIA_COORDINATOR]);

    // Send LINK to it
    let linkAbi = await getABI(SEPOLIA_LINK_ADDR);
    let paylinkTx = await sendERC20(
        linkAbi,
        VRFv2SubscriptionManager.target,
        `${funding}000000000000000000`
    );

    await paylinkTx.wait();
    console.log("Transaction indexed: ", paylinkTx.hash);    

    // Top up the Subscription Manager with the new LINK
    let topupTx = await VRFv2SubscriptionManager.topUpSubscription(hre.ethers.parseEther(`${funding}`));
    await topupTx.wait();
    console.log("Transaction indexed: ", topupTx.hash);  

    return VRFv2SubscriptionManager;
}

async function createCoinflip(VRFv2SubscriptionManager)
{
    // Deploy and add the contract Coinflip as a consumer of the Subscription Manager.
    let subscriptionId = await VRFv2SubscriptionManager.s_subscriptionId();
    let coinflip = await deployContract("Coinflip", [subscriptionId, SEPOLIA_COORDINATOR]);
    await coinflip.deploymentTransaction().wait(5);
    await verifyContract(coinflip.target, [subscriptionId, SEPOLIA_COORDINATOR]);

    // Add it as a consumer of the Subscription Manager
    VRFv2SubscriptionManager.addConsumer(coinflip.target);

    return coinflip;
}


async function main()
{
    let VRFv2SubscriptionManager = await hre.ethers.getContractAt("VRFv2SubscriptionManager", "0x2505c4e6a410f25f0ff153f40a9219bba3fdc21b");
    let coinflip = await createCoinflip(VRFv2SubscriptionManager);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

