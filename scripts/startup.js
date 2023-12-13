// startup.js

const hre = require("hardhat");

const { deployContract, verifyContract } = require("./helpers.js");
const { SEPOLIA_COORDINATOR, LINK_AMOUNT_TOPUP_INIT } = require("../config/config.js");

async function main()
{
    let VRFv2SubscriptionManager = await deployContract("VRFv2SubscriptionManager", [SEPOLIA_COORDINATOR]);
    await VRFv2SubscriptionManager.deploymentTransaction().wait(5);
    await verifyContract(VRFv2SubscriptionManager.target, [SEPOLIA_COORDINATOR]);

    let paylinkTx = await sendLink();

    let topupTx = await VRFv2SubscriptionManager.topUpSubscription(LINK_AMOUNT_TOPUP_INIT);
    console.log(topupTx.hash);

    let subscriptionId = await VRFv2SubscriptionManager.s_subscriptionId;
    let coinflip = await deployContract("Coinflip", [subscriptionId, SEPOLIA_COORDINATOR]);
    await coinflip.deploymentTransaction().wait(5);
    await verifyContract(coinflip.target, [subscriptionId, SEPOLIA_COORDINATOR]);

    VRFv2SubscriptionManager.addConsumer(coinflip.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

