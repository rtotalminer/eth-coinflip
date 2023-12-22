// VRFv2Consumer.spec.ts

import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";

import { assert, expect } from "chai";

import { networkConfigs, developmentChains, BASE_FEE, GAS_PRICE_LINK } from "../config/config";

const chainId : number = (hre.network.config.chainId == undefined) ? 0 : hre.network.config.chainId;
const networkName : string = hre.network.name;

async function fixture() {
    var Coinflip;
    var VRFv2SubscriptionManager;

    if (developmentChains.includes(networkName)) {}
    else {}

    return { Coinflip, VRFv2SubscriptionManager }
}

describe("Coinflip", function () {

    beforeEach(async function () {
        Object.assign(this, await loadFixture(fixture));
    });

    it("should allow a player to place a valid bet", async function () {
    });

    it("should not allow a player to place an invalid bet", async function () {
    });

    it("should not allow a player to place a new bet while a flip is in progress", async function () {
    });

    it("should fulfill the random words and update the outcome and player balance accordingly", async function () {
    });

    it("should allow the player to withdraw their winnings", async function () {
    });
});
