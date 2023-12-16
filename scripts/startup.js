// startup.js

const hre = require("hardhat");

const { deployContract, verifyContract, sendERC20, getABI } = require("./helpers.js");
const { SEPOLIA_COORDINATOR, LINK_AMOUNT_TOPUP_INIT, SEPOLIA_LINK_ABI, SEPOLIA_LINK_ADDR } = require("../config/config.js");

async function main()
{
    // let VRFv2SubscriptionManager = await deployContract("VRFv2SubscriptionManager", [SEPOLIA_COORDINATOR]);
    // await VRFv2SubscriptionManager.deploymentTransaction().wait(5);
    // await verifyContract(VRFv2SubscriptionManager.target, [SEPOLIA_COORDINATOR]);

    let linkAbi = await getABI(SEPOLIA_LINK_ADDR);
    let paylinkTx = await sendERC20(linkAbi, "0xf8e1733b7C31313AE5e8d1E5D67f3B2415314DB4", 1);

    // let topupTx = await VRFv2SubscriptionManager.topUpSubscription(LINK_AMOUNT_TOPUP_INIT);
    // console.log(topupTx.hash);

    // let subscriptionId = await VRFv2SubscriptionManager.s_subscriptionId;
    // let coinflip = await deployContract("Coinflip", [subscriptionId, SEPOLIA_COORDINATOR]);
    // await coinflip.deploymentTransaction().wait(5);
    // await verifyContract(coinflip.target, [subscriptionId, SEPOLIA_COORDINATOR]);

    // VRFv2SubscriptionManager.addConsumer(coinflip.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

