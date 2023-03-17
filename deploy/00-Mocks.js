const { deployments, getNamedAccounts, network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config.js");

module.exports = async ({ deployments, getNamedAccounts, getChainId }) => {
  const { deployer, withdrawalCreds } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = await getChainId();
  /* TESTING VARIABLES
   * log("chainId:", chainId);
   * log("network name:", network.name);
   * log("deployer:", deployer);
   * log("withdrawalCreds:", withdrawalCreds);
   * log("operatorIds:", networkConfig[chainId].operatorIds);
   * log("ssvContract:", networkConfig[chainId].ssvNetwork);
   */

  if (developmentChains.includes(network.name)) {
    // Deposit Contract
    const depositContract = await deploy("DepositContract", {
      from: deployer,
      log: true,
      args: [],
    });

    // SSVToken
    const SSVToken = await deploy("SSVToken", {
      from: deployer,
      log: true,
      args: [],
    });

    // SSVRegistry
    const SSVRegistry = await deploy("SSVRegistryMock", {
      from: deployer,
      log: true,
      args: [],
    });

    /* SSVNetwork contract
     *size exceeds size limit (30 KiB)
     * must have optimizer enabled
     * creating a SSVNetworkMock contract for local work */
    // const SSVNetwork = await deploy("SSVNetwork", {
    //   from: deployer,
    //   log: true,
    //   args: [],
    // });

    /* Mock SSVNetwork
     * depreciated but left in incase you wish to use Mock instead*/
    const SSVNetwork = await deploy("SSVNetworkMock", {
      from: deployer,
      log: true,
      args: [],
    });

    /* Mock SSVETH
     * this gets deployed inside (Liquid)StakingPool constructor */
    // const SSVETH = await deploy("SSVETH", {
    //   from: deployer,
    //   log: true,
    //   args: [],
    // });
  }
};

module.exports.tags = ["all", "mocks"];
