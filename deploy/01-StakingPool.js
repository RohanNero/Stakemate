const { deployments, getNamedAccounts, network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.js");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer, withdrawalCreds } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = await getChainId();
  let depositContract;
  //log("chainId:", chainId);
  //log("network name:", network.name);

  /* StakingPool takes 6 parameters:
        address keyGenerator - your public key (gets special whitelist permissions)      
        address depositAddress - the `DepositContract` address 
        address withdrawal - public key used for withdrawals
        address ssv_contract - `SSVNetwork` contract address
        address ssv_token - `SSVToken` contract address
        uint32[4] memory ids - the SSV operator IDs
   */
  if (developmentChains.includes(network.name)) {
    depositContract = await ethers.getContract("DepositContract");
    SSVNetwork = await ethers.getContract("SSVNetwork");
    opIds = networkConfig[chainId].operatorIds;

    //args = [, depositContract.address, , , , [1, 2, 9, 42]];
  } else {
    depositContract = networkConfig[chainId][depositContract];
    SSVNetwork = networkConfig[chainId][SSVNetwork];
  }
  args = [
    deployer,
    depositContract,
    withdrawalCreds,
    SSVNetwork,
    SSVToken,
    opIds,
  ];

  log("args:", args);

  const pool = await deploy("StakingPool", {
    from: deployer,
    log: true,
    args: args,
  });

  if (!developmentChains.includes(network.name)) {
    log("Verifying contract...");
  }
};

module.exports.tags = ["all", "main", "pool"];
