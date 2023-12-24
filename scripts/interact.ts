import { HardhatRuntimeEnvironment } from "hardhat/types";

const { task, types } = require("hardhat/config");

// task("addConsumer", "Add a consumer to a VRFv2SubscriptionManager.")
//   .addParam("addr1", "The VRFv2SubscriptionManager's contract address.")
//   .addParam("addr2", "The Coinflip's contract address.")
//   .addVariadicPositionalParam("constructorArgs", "The contract's constructor arguements.")
//   .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
//     const VRFv2SubscriptionManager = new hre.ethers.Contract.attach(args.addr1);
//     const Coinflip = new hre.ethers.Contract.attach(args.addr2);
//     VRFv2SubscriptionManager.addConsumer(coinflip.target);
//   });

task("sendLink", "Send a given amount of LINK tokens to an address.")
  .addParam("addr1", "The contract address.")
  .addParam("value", "The amount of LINK.")
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
  });

task("topupSubscription", "Top up the funds for a VRFv2SubscriptionManager.")
  .addParam("addr1", "The VRFv2SubscriptionManager's contract address.")
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
  });

task("fulfillRandomWords", "Manually fulfill random words of a request.")
  .addParam("addr1", "The VRF Coordinator address.")
  .addParam("addr2", "The VRF Coonsumer address.")
  .addParam("requestId", "The request ID to fulfill.")
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    let VRFCoordinatorV2Mock = await hre.ethers.getContractAt("VRFCoordinatorV2Mock", args.addr1);
    await VRFCoordinatorV2Mock.fulfillRandomWords(args.requestId, args.addr2);
  });















  
// const { deployContract, verifyContract, sendERC20, getABI } = require("../utils/helpers.js");
// const { SEPOLIA_COORDINATOR, SEPOLIA_LINK_ADDR, SUBSC_MNGR_ADDR } = require("../config/config.js");

// async function deploySubscriptionManager(funding, coordinatorAddr, linkAddr)
// {
//     // Create the Subscription Manager
//     let VRFv2SubscriptionManager = await deployContract("VRFv2SubscriptionManager", [coordinatorAddr]);
//     await VRFv2SubscriptionManager.deploymentTransaction().wait(funding);
//     await verifyContract(VRFv2SubscriptionManager.target, [coordinatorAddr]);

//     // Send LINK to it
//     let linkAbi = await getABI(linkAddr);
//     let paylinkTx = await sendERC20(
//         linkAbi,
//         VRFv2SubscriptionManager.target,
//         `${funding}000000000000000000`
//     );

//     await paylinkTx.wait();
//     console.log("Transaction indexed: ", paylinkTx.hash);    

//     // Top up the Subscription Manager with the new LINK
//     let topupTx = await VRFv2SubscriptionManager.topUpSubscription(hre.ethers.parseEther(`${funding}`));
//     await topupTx.wait();
//     console.log("Transaction indexed: ", topupTx.hash);  

//     return VRFv2SubscriptionManager;
// }

// async function createCoinflip(VRFv2SubscriptionManager, coordinatorAddr)
// {
//     // Deploy and add the contract Coinflip as a consumer of the Subscription Manager.
//     let subscriptionId = await VRFv2SubscriptionManager.s_subscriptionId();
//     let coinflip = await deployContract("Coinflip", [subscriptionId, coordinatorAddr]);
//     await coinflip.deploymentTransaction().wait(5);
//     await verifyContract(coinflip.target, [subscriptionId, coordinatorAddr]);

//     // Add it as a consumer of the Subscription Manager
//     VRFv2SubscriptionManager.addConsumer(coinflip.target);

//     return coinflip;
// }
