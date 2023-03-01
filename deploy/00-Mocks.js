const { deployments, getNamedAccounts, network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config.js");

module.exports = async ({ deployments, getNamedAccounts, getChainId }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = await getChainId();
  log("chainId:", chainId);
  log("network name:", network.name);

  if (developmentChains.includes(network.name)) {
    const depositContract = await deploy("DepositContract", {
      from: deployer,
      log: true,
      args: [],
    });

    // SSVNetwork contract size exceeds size limit (30 KiB)
    // Might just create a SSVNetworkMock contract for local work
    // const SSVNetwork = await deploy("SSVNetwork", {
    //   from: deployer,
    //   log: true,
    //   args: [],
    //   gasLimit: 5000000,
    // });
  }
};

module.exports.tags = ["all", "mocks"];
