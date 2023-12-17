const { expect } = require("chai");
const hre = require("hardhat");

describe("Coinflip", function () {

    const coinflipAddress = "0x5748d878bA3AC383535642B613816838C94bf7f6";
    var coinflip = undefined;
    var requestId = undefined;

    it("Should attach to the correct contract address.", async function () {
        coinflip = await hre.ethers.getContractAt("Coinflip", coinflipAddress); // set coinflip contract to a var
        const _coinflipAddress = await coinflip.getAddress();

        expect(_coinflipAddress).to.equal(coinflipAddress);
    });

    it("Should be the owner of its own parent VRF Consumer.", async function() {
        const _owner = await coinflip.owner();
        expect(_owner.toLowerCase()).to.equal(coinflipAddress.toLowerCase());
    });

    it("Should flip correctly with a bet of allowed values i.e. [1, 0].", async function() {
        const flipTx0 = await coinflip.flip(0, {value: hre.ethers.parseEther("0.01")});
        await flipTx0.wait();

        // wait for event request fulfilled
    });

    it("Should break when flipped an unallowed bet i.e. not [1, 0].", async function() {
    });


    it("Should not allow a user to have two flips running.", async function() {
    });
});
