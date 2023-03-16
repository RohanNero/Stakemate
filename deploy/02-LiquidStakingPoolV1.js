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
  let depositContract, SSVNetwork, opIds;
  //log("chainId:", chainId);
  //log("network name:", network.name);

  /* LiquidStakingPool takes 6 parameters:
        address keyGenerator - your public key (gets special whitelist permissions)      
        address depositAddress - the `DepositContract` address 
        address withdrawal - public key used for withdrawals
        address ssv_contract - `SSVNetwork` contract address
        address ssv_token - `SSVToken` contract address
        uint32[4] memory ids - the SSV operator IDs
   */
  if (developmentChains.includes(network.name)) {
    const depositContractObject = await ethers.getContract("DepositContract");
    depositContract = depositContractObject.address;
    const SSVNetworkObject = await ethers.getContract("SSVNetwork");
    SSVNetwork = SSVNetworkObject.address;
    const SSVTokenObject = await ethers.getContract("SSVToken");
    SSVToken = SSVTokenObject.address;
    opIds = networkConfig[chainId].operatorIds;
  } else {
    depositContract = networkConfig[chainId].depositContract;
    SSVNetwork = networkConfig[chainId].SSVNetwork;
    SSVToken = networkConfig[chainId].SSVToken;
    opIds = networkConfig[chainId].operatorIds;
  }

  args = [depositContract, SSVNetwork, SSVToken, opIds];
  //log("args:", args);

  const pool = await deploy("LiquidStakingPoolV1", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: networkConfig[chainId].blockConfirmations,
  });

  if (!developmentChains.includes(network.name)) {
    log("Verifying contract...");
    await verify(pool.address, args);
  }
};

module.exports.tags = ["all", "main", "liquid"];
