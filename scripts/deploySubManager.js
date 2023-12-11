const hre = require("hardhat");

async function main()
{
    const sepoliaCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
    const submanager = await hre.ethers.deployContract("VRFv2SubscriptionManager", [sepoliaCoordinator]);
    
    await submanager.waitForDeployment();
    console.log(`Contract deployed to ${submanager.target}`);

    // Wait 5 block confirmations instead
	await submanager.deploymentTransaction.wait(5);
    //await new Promise(t => setTimeout(t, 30000));
    
    await run(`verify:verify`, {
      address: submanager.target,
      constructorArguments: [sepoliaCoordinator],
    });
    console.log(`Verified contract on Etherscan.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
