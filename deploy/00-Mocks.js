const { deployments, getNamedAccounts, network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config.js");

module.exports = async ({ deployments, getNamedAccounts, getChainId }) => {
  const { deployer, withdrawalCreds } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = await getChainId();
  log("chainId:", chainId);
  log("network name:", network.name);
  log("deployer:", deployer);
  log("withdrawalCreds:", withdrawalCreds);
  log("operatorIds:", networkConfig[chainId].operatorIds);
  log("ssvContract:", networkConfig[chainId].ssvNetwork);

  if (developmentChains.includes(network.name)) {
    // Deposit Contract
    const depositContract = await deploy("DepositContract", {
      from: deployer,
      log: true,
      args: [],
    });

    // Mock SSVToken
    const SSVToken = await deploy("SSVTokenMock", {
      from: deployer,
      log: true,
      args: [],
    });

    // Mock SSVNetwork
    const SSVContract = await deploy("SSVNetworkMock", {
      from: deployer,
      log: true,
      args: [],
    });

    /* SSVNetwork contract
     *size exceeds size limit (30 KiB)
     * creating a SSVNetworkMock contract for local work */
    // const SSVNetwork = await deploy("SSVNetwork", {
    //   from: deployer,
    //   log: true,
    //   args: [],
    //   gasLimit: 5000000,
    // });
  }
};

module.exports.tags = ["all", "mocks"];
