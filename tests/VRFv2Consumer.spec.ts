// VRFv2Consumer.spec.ts

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";

import { assert, expect } from "chai";

import { networkConfigs, developmentChains, BASE_FEE, GAS_PRICE_LINK } from "../config/config";

const chainId : number = (hre.network.config.chainId == undefined) ? 0 : hre.network.config.chainId;
const networkName : string = hre.network.name;

async function VRFCoordinatorV2MockFixture() {
    const VRFCoordinatorV2Mock = await hre.ethers.deployContract("VRFCoordinatorV2Mock", [BASE_FEE, GAS_PRICE_LINK]);
    await VRFCoordinatorV2Mock.waitForDeployment();

    const fundAmount = (networkConfigs[chainId]["fundAmount"] == undefined) ?
        "1000000000000000000" : 
        networkConfigs[chainId]["fundAmount"];
    const transaction = await VRFCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transaction.wait(1);    

    const subscriptionId = (transactionReceipt?.logs[0].topics[1] == null) ? 0 : transactionReceipt.logs[0].topics[1]; //hre.ethers.BigNumber(transactionReceipt.logs[0].topics[1]);
    await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, fundAmount);

    const vrfCoordinatorAddress = VRFCoordinatorV2Mock.target;
    const keyHash =
        networkConfigs[chainId]["keyHash"] ||
        "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
    const [owner] = await hre.ethers.getSigners();

    const VRFv2Consumer = await hre.ethers.deployContract("VRFv2Consumer", [subscriptionId, vrfCoordinatorAddress, keyHash, owner.address]);
    await VRFv2Consumer.waitForDeployment();

    await VRFCoordinatorV2Mock.addConsumer(subscriptionId, VRFv2Consumer.target);

    return { VRFv2Consumer, VRFCoordinatorV2Mock };
}

async function VRFCoordinatorV2Fixture()
{
    var VRFv2Consumer;
    var VRFCoordinatorV2;

    // if (developmentChains.includes(networkName))

    // else

    return { VRFv2Consumer, VRFCoordinatorV2}
}

async function VRFv2SubscriptionManagerMockFixture() {
    const keyHash =
        networkConfigs[chainId]["keyHash"] ||
        "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
    const VRFCoordinatorV2Mock = await hre.ethers.deployContract("VRFCoordinatorV2Mock", [BASE_FEE, GAS_PRICE_LINK]);
    await VRFCoordinatorV2Mock.waitForDeployment();

    const VRFv2SubscriptionManager = await hre.ethers.deployContract("VRFv2SubscriptionManagerMock", [VRFCoordinatorV2Mock.target, keyHash]);
    await VRFv2SubscriptionManager.waitForDeployment();

    const fundAmount = "1000000000000000000"; 
    await VRFv2SubscriptionManager.topUpSubscription(fundAmount);

    const vrfCoordinatorAddress = VRFCoordinatorV2Mock.target;
    const subscriptionId = await VRFv2SubscriptionManager.s_subscriptionId();
    const [owner] = await hre.ethers.getSigners();

    const VRFv2Consumer = await hre.ethers.deployContract("VRFv2Consumer", [subscriptionId, vrfCoordinatorAddress, keyHash, owner.address]);
    await VRFv2Consumer.waitForDeployment();

    await VRFv2SubscriptionManager.addConsumer(VRFv2Consumer.target);

    return { VRFv2Consumer, VRFv2SubscriptionManager };
}
  

describe("VRFv2Consumer w/VRFCoordinatorV2.", async function () {
    
    beforeEach(async function () {
        Object.assign(this, await loadFixture(VRFCoordinatorV2Fixture));
    });
    
    // use these tests for mainet/testnet -- how to do this with fixture?
    describe("#requestRandomWords", async function () {
        describe("success", async function () {
            it("Should successfully request a random number", async function () {
                await expect(this.VRFv2Consumer.requestRandomWords()).to.emit(
                    this.VRFCoordinatorV2Mock,
                    "RandomWordsRequested"
                )
            });

            it("Should successfully request a random number and get a result", async function () {                
                const transaction = await this.VRFv2Consumer.requestRandomWords();
                const transactionReceipt = await transaction.wait(1);

                const requestId = transactionReceipt.logs[0].topics[2];

                // simulate callback from the oracle network
                await expect(
                    this.VRFCoordinatorV2Mock.fulfillRandomWords(
                        requestId,
                        this.VRFv2Consumer.target
                    )
                ).to.emit(this.VRFv2Consumer, "RequestFulfilled")

                const randomWords = (await this.VRFv2Consumer.getRequestStatus(requestId))[1];

                assert(
                    randomWords[0] > 0,
                    "First random number is greater than zero"
                )

                assert(
                    randomWords[1] > 0,
                    "Second random number is greater than zero"
                );
            });
        });
    });
});

(developmentChains.includes(networkName)) ?
describe("VRFv2Consumer w/VRFv2SubscriptionManagerMock.", async function () {

    beforeEach(async function () {
        Object.assign(this, await loadFixture(VRFv2SubscriptionManagerMockFixture));
    });
    
    // use these tests for mainet/testnet -- how to do this with fixture?
    describe("#requestRandomWords", async function () {
        describe("success", async function () {
            it("Should successfully request a random number", async function () {
            })

            it("Should successfully request a random number and get a result", async function () {                
            })
        })
    })
}) :
describe("VRFv2Consumer w/VRFv2SubscriptionManager.", async function () { } )