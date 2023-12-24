const hre = require("hardhat");
const fs = require("fs");

const axios = require("axios");

require("dotenv").config()

const { SEPOLIA_LINK_ADDR } = require("./config");

async function verifyContract(_address, _constructorArguments)
{
    let res = await run(`verify:verify`, {
        address: _address,
        constructorArguments: _constructorArguments,
    });

    if (res == undefined) return false;
    else return true;
}

async function deployContract(_contractName, _constructorArguments)
{
    const contract = await hre.ethers.deployContract(_contractName, _constructorArguments);
    
    if (contract == undefined) return false;

    await contract.waitForDeployment();
    console.log(`Contract: ${_contract} deployed to ${contract.target}`);

    return contract;
}

async function getABI(address)
{
    let url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=` + address + `&format=raw`;
    res = await axios.get(url);
    return res.data
}

async function sendERC20(abi, toAddress, amount)
{
    const Token = await hre.ethers.getContractAt(abi, SEPOLIA_LINK_ADDR);
    const tx = await Token.transfer(toAddress, amount);
    return tx;
}
  
module.exports = {
    deployContract,
    verifyContract,
    sendERC20,
    getABI
};