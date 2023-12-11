
const hre = require("hardhat");

async function main() {

    const subManagerId = 7687;
    const sepoliaCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";

    const coinflip = await hre.ethers.deployContract("Coinflip", [subManagerId, sepoliaCoordinator]);
    
    await coinflip.waitForDeployment();
    console.log(`Contract deployed to ${coinflip.target}`);

    // Wait 5 block confirmations instead
    //await new Promise(t => setTimeout(t, 25000));

	await coinflip.deploymentTransaction().wait(5);
    
    await run(`verify:verify`, {
        address: coinflip.target,
        constructorArguments: [subManagerId, sepoliaCoordinator],
    });
    console.log(`Verified contract on Etherscan.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
