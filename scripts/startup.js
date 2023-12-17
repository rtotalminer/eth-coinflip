// startup.js

const hre = require("hardhat");

const { deployContract, verifyContract, sendERC20, getABI } = require("./helpers.js");
const { SEPOLIA_COORDINATOR, SEPOLIA_LINK_ADDR } = require("../config/config.js");

async function main()
{
    // Create the Subscription Manager
    let VRFv2SubscriptionManager = await deployContract("VRFv2SubscriptionManager", [SEPOLIA_COORDINATOR]);
    await VRFv2SubscriptionManager.deploymentTransaction().wait(5);
    //await verifyContract(VRFv2SubscriptionManager.target, [SEPOLIA_COORDINATOR]);

    // Send LINK to it
    let linkAbi = await getABI(SEPOLIA_LINK_ADDR);
    let paylinkTx = await sendERC20(
        linkAbi,
        VRFv2SubscriptionManager.target,
        "1000000000000000000" // 1 link
    );

    await paylinkTx.wait();
    console.log("Transaction verified: ", paylinkTx.hash);    

    // Top up the Subscription Manager with the new LINK
    let topupTx = await VRFv2SubscriptionManager.topUpSubscription(1);
    await topupTx.wait();
    console.log("Transaction verified: ", topupTx.hash);  

    // Deploy and add the contract Coinflip as a consumer of the Subscrioption Manager.
    let subscriptionId = await VRFv2SubscriptionManager.s_subscriptionId();
    console.log(subscriptionId);
    let coinflip = await deployContract("Coinflip", [subscriptionId, SEPOLIA_COORDINATOR]);
    console.log(coinflip);
    await coinflip.deploymentTransaction().wait(5);
    //await verifyContract(coinflip.target, [subscriptionId, SEPOLIA_COORDINATOR]);

    VRFv2SubscriptionManager.addConsumer(coinflip.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

