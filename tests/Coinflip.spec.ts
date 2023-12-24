import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";
import { assert, expect } from "chai";
import { networkConfigs, developmentChains, BASE_FEE, GAS_PRICE_LINK } from "../config/config";
import { parseEther } from "ethers";

const chainId: number = (hre.network.config.chainId == undefined) ? 0 : hre.network.config.chainId;
const keyHash = networkConfigs[chainId]["keyHash"] ||
  "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
networkConfigs[chainId]["fundAmount"];

async function fixture() {
  const [owner, addr1, addr2] = await hre.ethers.getSigners();

  // if we are on a local network just lazily create the fixture with everything...
  if (developmentChains.includes(hre.network.name)) {

    const VRFCoordinatorV2Mock = await hre.ethers.deployContract("VRFCoordinatorV2Mock", [BASE_FEE, GAS_PRICE_LINK]);
    await VRFCoordinatorV2Mock.waitForDeployment();

    const VRFv2SubscriptionManager = await hre.ethers.deployContract(
      "VRFv2SubscriptionManagerMock",
      [VRFCoordinatorV2Mock.target, keyHash]);
    await VRFv2SubscriptionManager.waitForDeployment();

    const subscriptionId = await VRFv2SubscriptionManager.s_subscriptionId();

    const Coinflip = await hre.ethers.deployContract("Coinflip", [subscriptionId, VRFCoordinatorV2Mock.target, keyHash]);
    await Coinflip.waitForDeployment();

    await VRFv2SubscriptionManager.addConsumer(Coinflip.target);

    return { Coinflip, VRFv2SubscriptionManager, owner, addr1, addr2 }

  }
}

describe('Coinflip', async function () {

  before(async function () {
    Object.assign(this, await fixture());
  });

  
    describe('initialize.', async function () {
        it('should be added as a consumer of the subscription manager.', async function () {
            const consumers = await this.VRFv2SubscriptionManager.getConsumers();
            expect(consumers).to.include(this.Coinflip.target, 'Coinflip should be added');
        });
    });

    describe('flip', async function () {
        it('should allow players to place bets and receive payouts on correct prediction', async function () {
            const playerCoinflip = await hre.ethers.getContractAt("Coinflip", this.Coinflip.target, this.addr1);

            const tx = await playerCoinflip.flip(0, { value: parseEther("1.0") });
            const receipt = await tx.wait();
            
            const requestSentEvent = receipt?.logs?.find((event: any) => event.eventName === "RequestSent");
            expect(requestSentEvent).to.not.be.undefined;

            const requestId = (requestSentEvent?.data) ? parseInt(requestSentEvent?.data, 16) : -1;
            expect(requestId).to.not.equal(-1);
          });
        
        // Will fail if ran w/ debugger as randomness will be fulfilled due to automining
        it('should not allow multiple bets from the same player simultaneously', async function () {
            const playerCoinflip = await hre.ethers.getContractAt("Coinflip", this.Coinflip.target, this.addr1);
            await expect(playerCoinflip.flip(0, { value: parseEther("1.0") })).
                to.be.revertedWith('There is a flip already in progress.');
        });
    });


    describe('withdraw', async function () {
        it('should allow players to withdraw their payouts', async function () {
            const betAmount = 1;
            await this.Coinflip.connect(this.addr1).flip(0, { value: betAmount }); // 0 for HEADS
            const requestId = await this.Coinflip.lastRequestId();
            const randomWords = [0]; // Corresponding to HEADS
        
            await this.Coinflip.connect(this.owner).fulfillRandomWords(requestId, randomWords);
        
            const playerBalanceBefore = await this.owner.getBalance();
            const payoutBefore = await this.Coinflip.debts(this.addr1);
        
            await this.Coinflip.connect(this.addr1).withdraw();
        
            const playerBalanceAfter = await this.owner.getBalance();
            const payoutAfter = await this.Coinflip.debts(this.addr1);
        
            // Player should receive a payout
            expect(playerBalanceAfter).to.be.above(playerBalanceBefore);
            expect(payoutBefore).to.equal(betAmount/2);
            expect(payoutAfter).to.equal(0); // Payout should be withdrawn
        });
    });
});
