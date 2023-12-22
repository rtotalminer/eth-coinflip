import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";

import { assert, expect } from "chai";

import { networkConfigs, developmentChains, BASE_FEE, GAS_PRICE_LINK } from "../config/config";

const chainId : number = (hre.network.config.chainId == undefined) ? 0 : hre.network.config.chainId;

async function fixture() {
    const keyHash =
        networkConfigs[chainId]["keyHash"] ||
        "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc";
    const fundAmount = (networkConfigs[chainId]["fundAmount"] == undefined) ?
        "1000000000000000000" : 
        networkConfigs[chainId]["fundAmount"];
    const [ owner, addr1, addr2 ] = await hre.ethers.getSigners();

    if (developmentChains.includes(hre.network.name)) {
        const VRFCoordinatorV2Mock = await hre.ethers.deployContract("VRFCoordinatorV2Mock", [BASE_FEE, GAS_PRICE_LINK]);
        await VRFCoordinatorV2Mock.waitForDeployment();

        const VRFv2SubscriptionManager = await hre.ethers.deployContract(
            "VRFv2SubscriptionManagerMock",
            [VRFCoordinatorV2Mock.target, keyHash]);
        await VRFv2SubscriptionManager.waitForDeployment();

        const subscriptionId = await VRFv2SubscriptionManager.s_subscriptionId();

        return { VRFv2SubscriptionManager, owner, addr1, addr2, fundAmount};
    }

}

describe('VRFv2SubscriptionManager', async function () {
    
    before(async function () {
        Object.assign(this, await loadFixture(fixture));
    });
    
    it('should initialize with a non-zero subscription ID and the correct owner', async function () {
        const ownerAddress = await this.VRFv2SubscriptionManager.owner();
        const subscriptionId = await this.VRFv2SubscriptionManager.s_subscriptionId();
    
        expect(subscriptionId, 'Subscription ID should be non-zero').to.not.equal(0);
        expect(ownerAddress, 'Owner should be set correctly').to.equal(await this.owner.getAddress());
    });

    it('should only allow the owner to top up the subscription', async function () {
        await expect (
            this.VRFv2SubscriptionManager.connect(this.addr1).topUpSubscription(this.fundAmount)
        ).to.be.revertedWithCustomError(
            this.VRFv2SubscriptionManager,
            "OwnableUnauthorizedAccount"
        );
    });

    it('should top up the subscription balance', async function () {
        const initialBalance = await this.VRFv2SubscriptionManager.getBalance();

        const transaction = await this.VRFv2SubscriptionManager.topUpSubscription(this.fundAmount);
        await transaction.wait();
    
        const finalBalance = await this.VRFv2SubscriptionManager.getBalance();
    
        expect((finalBalance - initialBalance), 'Subscription balance should be increased').to.equal(this.fundAmount);
    });

    it('should revert if non-owner tries to add a consumer', async function () { 
        await expect(
            this.VRFv2SubscriptionManager.connect(this.addr1).addConsumer(await this.addr2.getAddress())
        ).to.be.revertedWithCustomError(
            this.VRFv2SubscriptionManager,
            "OwnableUnauthorizedAccount"
        );
        await expect(
            this.VRFv2SubscriptionManager.addConsumer(this.addr1)
        );
    });  

    it('should revert if non-owner tries remove a consumer', async function () {
        await expect(
            this.VRFv2SubscriptionManager.connect(this.addr2).removeConsumer(await this.addr1.getAddress())
        ).to.be.revertedWithCustomError(
            this.VRFv2SubscriptionManager,
            "OwnableUnauthorizedAccount"
        );
        await expect(
            this.VRFv2SubscriptionManager.removeConsumer(this.addr1)
        );
    });
   
    it('should add and remove consumers from the subscription', async function () {
        // Add consumers
        const addr1 = await this.addr1.getAddress();
        const addr2 = await this.addr2.getAddress();

        await this.VRFv2SubscriptionManager.addConsumer(addr1);
        await this.VRFv2SubscriptionManager.addConsumer(addr2);

        // Check if consumers were added
        const consumers = await this.VRFv2SubscriptionManager.getConsumers();
        expect(consumers).to.include(addr1, 'Consumer 1 should be added');
        expect(consumers).to.include(addr2, 'Consumer 2 should be added');
    
        // Remove consumer 1
        await this.VRFv2SubscriptionManager.removeConsumer(addr1);
    
        // Check if consumer 1 was removed
        const consumersAfterRemove = await this.VRFv2SubscriptionManager.getConsumers();
        expect(consumersAfterRemove).to.not.include(addr1, 'Consumer 1 should be removed');
        expect(consumersAfterRemove).to.include(addr2, 'Consumer 2 should still be present');
    });
   
    it('should withdraw from the contract', async function () {
        const _balance = await this.VRFv2SubscriptionManager.getBalance();
        await this.VRFv2SubscriptionManager.withdraw(this.owner, _balance);
    });

    it('should not allow a withdraw from the a non-owner', async function () {
        const _balance = await this.VRFv2SubscriptionManager.getBalance();
        await this.VRFv2SubscriptionManager.withdraw(this.owner, );
    });
    

    it('should not allow topping up the subscription below the minimum amount', async function () {
        await expect(
            this.VRFv2SubscriptionManager.topUpSubscription(0)
        ).to.be.revertedWith('amount must be greater than or equal to the minimum amount');
        await expect(
            this.VRFv2SubscriptionManager.topUpSubscription(1000)
        ).to.be.revertedWith('amount must be greater than or equal to the minimum amount');
    });
    
    it('should only allow the owner to cancel the subscription and transfer remaining LINK to an address', async function () {
        await expect(
            this.VRFv2SubscriptionManager.connect(this.addr1).cancelSubscription(this.addr1)
        ).to.be.revertedWithCustomError(
            this.VRFv2SubscriptionManager,
            "OwnableUnauthorizedAccount"
        );
        await this.VRFv2SubscriptionManager.cancelSubscription(this.owner)
        await expect(
            await this.VRFv2SubscriptionManager.s_subscriptionId()
        ).to.equal(0);
    });
});
