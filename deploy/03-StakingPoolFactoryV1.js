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
  //log("chainId:", chainId);
  //log("network name:", network.name);

  const factory = await deploy("StakingFactoryV1", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: networkConfig[chainId].blockConfirmations,
  });

  if (!developmentChains.includes(network.name)) {
    log("Verifying contract...");
    await verify(factory.address, []);
  }
};

module.exports.tags = ["all", "main", "factory"];
