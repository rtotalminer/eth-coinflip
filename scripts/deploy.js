const { task, types } = require("hardhat/config");

task("deploy", "Generic contract deployment script.")
  .addParam("contract", "The contract's artifact name.")
  .addVariadicPositionalParam("constructorArgs", "The contract's constructor arguements.")
  .setAction(async (args, hre) => {
    console.log(`Deploying contract: ${args.contract}(${args.constructorArgs})`);
    let contract = await hre.ethers.deployContract(args.contract, args.constructorArgs);
    await contract.waitForDeployment();
    console.log(`Contract deployed to ${contract.target}`);
  });
