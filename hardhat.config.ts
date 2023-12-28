// hardhat.config.ts

require("dotenv").config()

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import './scripts/interact';

const config: HardhatUserConfig = {
    solidity: "0.8.20",

    networks: {
        hardhat: {
            chainId: 0,
        },
        ganache: {
            url: "http://127.0.0.1:7545",
            accounts: [
                "6d041573cc2b2a7e145c0589b824e16969e7bf48c30986892e2cd8ef1aa976ae",
                "86831ecebf5a8258a84ae56400e14c7715e0fdb2721c25129ba1e0c8d25324e3",
                "dc5e422714ebc9ae6e74b8a56d416129d9a40e0b7ab1ac1453535bfd344d3fcf"
            ],
            chainId: 1337,
        },
        // sepolia: {
        //     url: process.env.SEPOLIA_RPC_URL,
        //     accounts: [ (process.env.PRIVATE_KEY) ? process.env.PRIVATE_KEY : ""],
        //     chainId: 11155111,
        // },
    },
    
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },

    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    }
};

export default config;
