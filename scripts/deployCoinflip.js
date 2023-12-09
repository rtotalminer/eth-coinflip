// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

    const subscriptionId = 7652;
    const coordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
    // move this hard coded value from the contract to the constructor
    // const keyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    
    const coinflip = await hre.ethers.deployContract("Coinflip", [subscriptionId, coordinator]);
    
    await coinflip.waitForDeployment();
    console.log(`Contract deployed to ${coinflip.target}`);

    // Wait 5 block confirmations instead
    await new Promise(t => setTimeout(t, 10000));
    
    await run(`verify:verify`, {
      address: coinflip.target,
      constructorArguments: [subscriptionId, coordinator],
    });
    console.log(`Verified contract on Etherscan.`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
