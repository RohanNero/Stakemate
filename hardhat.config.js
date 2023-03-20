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

/** This task allows users to stake a specified amount to a specific address */
task("stake", "stake an ether amount")
  .addParam("address", "which staking pool contract address to use")
  .addOptionalParam("amount", "amount to stake in WEI")
  .addOptionalParam(
    "liquid",
    "bool that if set true will use the Liquid version of the staking pool"
  )
  .setAction(async (taskArgs) => {
    try {
      const {
        networkConfig,
        developmentChains,
      } = require("./helper-hardhat-config.js");
      const { deployer } = await getNamedAccounts();
      const chainId = await getChainId();
      let stakingPool, stakingValue;
      if (taskArgs.liquid) {
        stakingPool = await ethers.getContractAt(
          "LiquidStakingPoolV1",
          taskArgs.address
        );
        //console.log(stakingPool);
      } else {
        stakingPool = await ethers.getContractAt(
          "StakingPoolV1",
          taskArgs.address
        );
        //console.log(stakingPool);
      }

      if (taskArgs.amount) {
        stakeValue = taskArgs.amount;
      } else {
        stakeValue = networkConfig[chainId].stakeValue;
      }

      const tx = await stakingPool.stake({ value: stakeValue });
      console.log("Successfully staked", stakeValue, "WEI!");
      //console.log("deployer:", deployer);
      const totalStaked = await stakingPool.viewUserStake(deployer);
      if (!developmentChains.includes(network.name)) {
        await tx.wait(1);
      }
      console.log(
        "Bringing your total staked to:",
        totalStaked.toString(),
        "WEI!"
      );
    } catch (error) {
      if (network.name == "hardhat") {
        console.log(
          "---------------------------------------------------------------------------------------------"
        );
        console.log(
          "If you are trying to use the hardhat local blockchain you need to pass `--network localhost` "
        );
        console.log(
          "---------------------------------------------------------------------------------------------"
        );
        throw error;
      } else {
        throw error;
      }
    }
  });
/** This task allows users to unstake a specified amount to a specific address */
task("unstake", "unstake an ether amount")
  .addParam("address", "which staking pool contract address to use")
  .addParam("amount", "amount to stake in WEI")
  .addOptionalParam(
    "liquid",
    "bool that if set true will use the Liquid version of the staking pool"
  )
  .setAction(async (taskArgs) => {
    //const balance = await ethers.provider.getBalance(taskArgs.account);
    let stakingPool;
    if (taskArgs.liquid) {
      stakingPool = await ethers.getContractAt(
        "LiquidStakingPoolV1",
        taskArgs.address
      );
      //console.log(stakingPool);
    } else {
      stakingPool = await ethers.getContractAt(
        "StakingPoolV1",
        taskArgs.address
      );
      //console.log(stakingPool);
    }
  });

/** This task allows users to deposit validator data at a specific address and config file */
task("deposit-validator", "deposits validator payload to deposit contract")
  .addParam("address", "which staking pool contract address to use")
  .addOptionalParam(
    "liquid",
    "bool that if set true will use the Liquid version of the staking pool"
  )
  .addOptionalParam(
    "depositDataFile",
    "if a file name is given then only deposit data for that file are deposited"
  )
  .setAction(async (taskArgs) => {
    //const balance = await ethers.provider.getBalance(taskArgs.account);
    let stakingPool;
    if (taskArgs.liquid) {
      stakingPool = await ethers.getContractAt(
        "LiquidStakingPoolV1",
        taskArgs.address
      );
      //console.log(stakingPool);
    } else {
      stakingPool = await ethers.getContractAt(
        "StakingPoolV1",
        taskArgs.address
      );
      //console.log(stakingPool);
    }
  });

/** This task allows users to deposit keyshares at a specific address and config file */
task("deposit-keyshares", "deposits keyshare payload to SSVNetwork contract")
  .addParam("address", "which staking pool contract address to use")
  .addOptionalParam(
    "liquid",
    "bool that if set true will use the Liquid version of the staking pool"
  )
  .addOptionalParam(
    "keysharesFile",
    "if a file name is given then only keyshares for that file are deposited"
  )
  .setAction(async (taskArgs) => {
    //const balance = await ethers.provider.getBalance(taskArgs.account);
    let stakingPool;
    if (taskArgs.liquid) {
      stakingPool = await ethers.getContractAt(
        "LiquidStakingPoolV1",
        taskArgs.address
      );
      //console.log(stakingPool);
    } else {
      stakingPool = await ethers.getContractAt(
        "StakingPoolV1",
        taskArgs.address
      );
      //console.log(stakingPool);
    }
  });
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
