const { expect } = require("chai");
const hre = require("hardhat");

describe("Coinflip", function () {

    // create a fund 

    const coinflipAddress = "0xdc3ad01031A2635F57A484E2B346107FafF0C1fD";

    it("Should attach to the correct contract address.", async function () {
        const coinflip = await hre.ethers.getContractAt("Coinflip", coinflipAddress); // set coinflip contract to a var
        const _coinflipAddress = await coinflip.getAddress();

        expect(_coinflipAddress).to.equal(coinflipAddress);
    });

    it("Should be the owner of its own parent VRF Consumer.", async function() {
        const coinflip = await hre.ethers.getContractAt("Coinflip", coinflipAddress);
        const _owner = await coinflip.owner();

        expect(_owner).to.equal(coinflipAddress);
    });

    it("Should flip correctly with a bet of allowed values i.e. [1, 0].", async function() {
        const _owner = await coinflip.flip();
    });

    it("Should not allow a user to have to flips running.", async function() {

    });
});
