import axios from 'axios';
import { error } from 'console';
import { parseEther } from 'ethers';
import hre from 'hardhat';

export async function deployContract(_contractName: string, _constructorArguments: any[])
{
  const _contract = await hre.ethers.deployContract(_contractName, _constructorArguments);

  if (_contract == undefined) throw error;

  await _contract.waitForDeployment();
  console.log(`Contract: ${_contractName} deployed to ${_contract.target}`);

  const contract = await hre.ethers.getContractAt(_contractName, _contract.target);
  return contract;
}

export async function getABI(address: string)
{
    let url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=` + address + `&format=raw`;
    let res = await axios.get(url);
    return res.data;
}

export async function sendERC20(tokenAddr: string, abi: string, toAddress: string, amount: string)
{
    const Token = await hre.ethers.getContractAt(abi, tokenAddr);
    const tx = await Token.transfer(toAddress, parseEther(amount));
    return tx;
}

// async function verifyContract(_address, _constructorArguments)
// {
//     let res = await run(`verify:verify`, {
//         address: _address,
//         constructorArguments: _constructorArguments,
//     });

//     if (res == undefined) return false;
//     else return true;
// }
