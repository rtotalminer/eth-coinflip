const { expect } = require("chai");
const hre = require("hardhat");

describe("Coinflip", function () {

    const coinflipAddress = "0xe296207dabae16a848517dd90ae3d49ea6968a75";
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
        
        //call flip
        // const flipTx0 = await coinflip.flip(0, {value: hre.ethers.parseEther("0.01")});
        // await flipTx0.wait();
        // requestId = BigInt(flipTx0.data).toString()

        // console.log(requestId);

        coinflip.on("RequestFulfilled", (_requestId, numWords, event) => {
            let info = {
                requestId: requestId,
                numWords: numWords
            };
            console.log(info);
        });

        // subscribe to the request fulfileed event
        // await when one with request id is resolved 
        // filter = {
        //     address: coinflipAddress,
        //     topics: [
        //         // the name of the event, parnetheses containing the data type of each event, no spaces
        //         hre.ethers.id("RequestFulfilled(uint256, uint256[])")
        //     ]
        // }
        // let event = await coinflip.on("RequestFulfilled", async (requestId, numWords) => {
            
        // }).then(console.log("Working"));

        // let x = coinflip.listeners( "RequestFulfilled" ) ;

        // 

    });

    it("Should break when flipped an unallowed bet i.e. not [1, 0].", async function() {
    });


    it("Should not allow a user to have two flips running.", async function() {
    });
});
