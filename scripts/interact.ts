import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { BigNumberish, Contract } from "ethers";
import { developmentChains } from "../utils/config";

task("fulfillRandomWords", "Manually fulfill random words of a request.")
  .addParam("addr1", "The VRF Coordinator address.")
  .addParam("addr2", "The VRF Consumer address.")
  .addParam("requestId", "The request ID to fulfill.")
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    let VRFCoordinatorV2Mock = await hre.ethers.getContractAt("VRFCoordinatorV2Mock", args.addr1);
    console.log(BigInt(args.requestId));
    await VRFCoordinatorV2Mock.fulfillRandomWords(BigInt(args.requestId), args.addr2);
  });

task("topUpSubMang", "Manually fulfill top up a VRFv2Subscription Manager.")
  .addParam("addr1", "The VRFv2SubscriptionManager address.")
  .addParam("amount", "The amount too top up.")
  .setAction(async (args: any, hre: HardhatRuntimeEnvironment) => {
    let name = 'VRFv2SubscriptionManager';
    if (developmentChains.includes(hre.network.name)) {
      name = 'VRFv2SubscriptionManagerMock';
    } 
    let VRFv2SubscriptionManager = await hre.ethers.getContractAt(name, args.addr1);
    await VRFv2SubscriptionManager.topUpSubscription(BigInt(args.amount));
  });

// Contract: VRFCoordinatorV2Mock deployed to 0xEd005696F6329F31D1e4E3a4315091e11dfaB83D
// Contract: VRFv2SubscriptionManagerMock deployed to 0x52d3085C04A116c3259F439c4942FA7aF16f946c
// Contract: Coinflip deployed to 0x8Fc4cDB1609861efC9DC36A0515e036E90963E65