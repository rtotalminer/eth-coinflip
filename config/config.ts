// config/config.ts

import { BigNumberish } from "ethers";

interface INetworkConfig {
    name: string,
    chainId: string,
    linkToken?: string,
    ethUsdPriceFeed?: string,
    keyHash?: string,
    vrfCoordinator?: string,
    vrfWrapper?: string,
    oracle?: string,
    jobId?: string,
    subscriptionId?: string,
    fee?: string,
    fundAmount: BigNumberish, // 0.1
    automationUpdateInterval?: string,
    url?: string
}

export const networkConfigs : Record<number, INetworkConfig> = {
    0: {
        name: "hardhat",
        chainId: "0",
        fee: "100000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
        fundAmount: "1000000000000000000",
        automationUpdateInterval: "30"
    },
    5777: {
        name: "ganache",
        chainId: "5777",
        fee: "100000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
        fundAmount: "1000000000000000000",
        automationUpdateInterval: "30",
        ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        url: "localhost:5777"
    },
    1: {
        name: "mainnet",
        chainId: "1",
        linkToken: "0x514910771af9ca656af840dff83e8264ecf986ca",
        fundAmount: "0",
        automationUpdateInterval: "30",
    },
    11155111: {
        name: "sepolia",
        chainId: "11155111",
        linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
        keyHash: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        vrfCoordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
        vrfWrapper: "0xab18414CD93297B0d12ac29E63Ca20f515b3DB46",
        oracle: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD",
        jobId: "ca98366cc7314957b8c012c72f05aeeb",
        subscriptionId: "777",
        fee: "100000000000000000",
        fundAmount: "100000000000000000", // 0.1
        automationUpdateInterval: "30",
    },
}

export const developmentChains = ["hardhat", "ganache"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
export const BASE_FEE = "100000000000000000";
export const GAS_PRICE_LINK = "1000000000"; // 0.000000001 LINK per gas


