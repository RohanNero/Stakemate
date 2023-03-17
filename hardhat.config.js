require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("chai");
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const FUJI_RPC_URL = process.env.FUJI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const WITHDRAWAL_PRIVATE_KEY = process.env.WITHDRAWAL_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const SNOWTRACE_API_KEY = process.env.SNOWTRACE_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

// task("deposit-keyshares", "deposits keyshare payload to SSVNetwork contract")
//   .addParam("address", "which c")
//   .setAction(async (taskArgs) => {
//     const balance = await ethers.provider.getBalance(taskArgs.account);

//     console.log(ethers.utils.formatEther(balance), "ETH");
//   });
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    withdrawalCreds: 1, // Set this value to 0 if you wish to use the same address for withdrawals
  },
  gasReporter: {
    enabled: false,
  },
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        enabled: false, // set to true for forking
        url: GOERLI_RPC_URL || "",
      },
    },
    sepolia: {
      chainId: 11155111,
      blockConfirmations: 5,
      url: SEPOLIA_RPC_URL || "",
      accounts: [PRIVATE_KEY, WITHDRAWAL_PRIVATE_KEY],
    },
    goerli: {
      chainId: 5,
      blockConfirmations: 5,
      url: GOERLI_RPC_URL || "",
      accounts: [PRIVATE_KEY, WITHDRAWAL_PRIVATE_KEY],
    },
    mumbai: {
      chainId: 80001,
      blockConfirmations: 5,
      url: MUMBAI_RPC_URL || "",
      accounts: [PRIVATE_KEY, WITHDRAWAL_PRIVATE_KEY],
    },
    fuji: {
      chainId: 43113,
      blockConfirmations: 5,
      url: FUJI_RPC_URL || "",
      accounts: [PRIVATE_KEY, WITHDRAWAL_PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      blockConfirmations: 3,
      url: MAINNET_RPC_URL || "",
      accounts: [PRIVATE_KEY, WITHDRAWAL_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY || "",
      goerli: ETHERSCAN_API_KEY || "",
      polygonMumbai: POLYGONSCAN_API_KEY || "",
      avalancheFujiTestnet: SNOWTRACE_API_KEY || "",
    },
  },
};
