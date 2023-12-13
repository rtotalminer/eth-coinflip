const { expect } = require("chai");
const hre = require("hardhat");

describe("Coinflip", function () {

    // create a fund 

    const coinflipAddress = "0xe89e163F2F1c1218f3b99F5A71378618921fAf07";

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

    //it("Should")
});
