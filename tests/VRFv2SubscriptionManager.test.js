const { expect } = require("chai");
const hre = require("hardhat");

const { deployContract } = require("../scripts/helpers");
const { LINK_AMOUNT_TOPUP_INIT, SEPOLIA_COORDINATOR } = require("../config/config");

describe("VRFv2SubscriptionManager", async function () {

    var VRFv2SubscriptionManager = {};

    it("Should deploy.", async function() {
        VRFv2SubscriptionManager = await deployContract("VRFv2SubscriptionManager", [SEPOLIA_COORDINATOR]);
        expect(VRFv2SubscriptionManager).to.not.equal(false);
    });

    it("Should top up the subscription manager.", async function() {
        let tx = await VRFv2SubscriptionManager.topUpSubscription(LINK_AMOUNT_TOPUP_INIT);
        // check balance now equals linktopu..
    });

});
