require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",

    networks: {
    ganache: {
      url: "http://127.0.0.1:8545", // replace with your Ganache RPC server URL
      accounts: {
        mnemonic: process.env.GANACHE_KEY,
      },
    },
      sepolia: {
          url: process.env.SEPOLIA_RPC_URL,
          accounts: [ process.env.PRIVATE_KEY],
          chainId: 11155111,
          blockConfirmations: 6,
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
