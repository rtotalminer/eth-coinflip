const hre = require("hardhat");

async function verifyContract(_address, _constructorArguments)
{
    let res = await run(`verify:verify`, {
        address: _address,
        constructorArguments: _constructorArguments,
    });

    if (res == undefined) return false;
    else return true;
}

async function deployContract(_contract, _constructorArguments)
{
    const contract = await hre.ethers.deployContract(_contract, _constructorArguments);
    
    if (contract == undefined) return false;

    await contract.waitForDeployment();
    console.log(`Contract: ${_contract} deployed to ${contract.target}`);

    return contract;
}

async function sendLink(address, amount)
{
    //
}

module.exports = {
    deployContract,
    verifyContract,
    sendLink
};