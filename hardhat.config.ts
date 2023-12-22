// hardhat.config.ts

require("dotenv").config()

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.20",

    networks: {
        hardhat: {
            chainId: 0,
        },
        ganache: {
            url: "http://127.0.0.1:7545",
            accounts: [ "0x5feea272e44fabca5fbbb7b4b792a3c0853044b057e3dd85b3a060253075a184"],
            chainId: 5777,
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL,
            accounts: [ (process.env.PRIVATE_KEY) ? process.env.PRIVATE_KEY : ""],
            chainId: 11155111,
        },
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
