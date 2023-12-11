const hre = require("hardhat");

async function main(l)
{
    let subManagerAddr = "0x7323d6B9D393C0525A0e2BE1De895098421a75d2"; // this needs to be oved dynamically

    const SubManager = await ethers.getContractFactory("VRFv2SubscriptionManager");
    const submanager = SubManager.attach(subManagerAddr);

    // top up the subscription manager with 10 link
    let tx = await submanager.topUpSubscription(1000000);
    console.log(tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
