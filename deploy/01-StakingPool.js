const { deployments, getNamedAccounts, network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config.js");
const { verify } = require("../utils/verify.js");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = await getChainId();
  //log("chainId:", chainId);
  //log("network name:", network.name);

  if (developmentChains.includes(network.name)) {
  } else {
  }

  const pool = await deploy("StakingPool", {
    from: deployer,
    log: true,
    args: [],
  });

  if (!developmentChains.includes(network.name)) {
    log("Verifying contract...");
  }
};

module.exports.tags = ["all", "main", "pool"];
