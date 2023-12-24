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
            accounts: [
                "c8142e430aa10e0d2fa214d4999dbc81cc52b57456dadb718106128ad28100ac",
                "346c7cf9a43707c6e3b8f8ef4f97a8a492117e5089b17c56b6a0ed0d81ddc38b",
                "1539507fc41ab617fe5e238955583985c9e4e3ccbbd3d2c0552197d345801349"
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
