const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");

/*@notice This function initializes the SSVNetwork (calls initalize())*/
async function initialize() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const stakeValue = networkConfig[chainId].stakeValue;
  //console.log("stakeValue:", stakeValue);
  //console.log("chainId:", chainId);
  let network, registry;
  if (chainId.toString() == "31337") {
    network = await ethers.getContract("SSVNetworkMock");
    registry = await ethers.getContract("SSVRegistryMock");
  } else {
    network = await ethers.getContract("SSVNetwork");
    registry = await ethers.getContract("SSVRegistry");
  }

  const token = await ethers.getContract("SSVToken");
  // this is a proxy contracts' "constructor", unsure on the specifics
  // await network.initialize(
  //   registry.address,
  //   token.address,
  //   networkConfig[chainId].networkInitialization.minimumBlocksBeforeLiquidation,
  //   networkConfig[chainId].networkInitialization.operatorMaxFeeIncrease,
  //   networkConfig[chainId].networkInitialization.declareOperatorFeePeriod,
  //   networkConfig[chainId].networkInitialization.executeOperatorFeePeriod
  // );
  const setRegistry = await network.setRegistryContract(registry.address);
  const setToken = await network.setTokenAddress(token.address);
  const owner = await registry.owner();
  console.log(owner);
  const transferOwner = await registry.transferOwnership(network.address);
  const newOwner = await registry.owner();
  console.log(newOwner);
  //console.log("values:", setRegistry, setToken);
}

initialize()
  .then(() => process.exit(0))
  .catch((error) => {
    if (error.message.toLowerCase().includes("already initialized")) {
      console.log("SSVNetwork already initialized!");
    } else {
      console.error(error);
      process.exit(1);
    }
  });
