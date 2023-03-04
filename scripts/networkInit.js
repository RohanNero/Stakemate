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
  const network = await ethers.getContract("SSVNetwork");
  const registry = await ethers.getContract("SSVRegistry");
  const token = await ethers.getContract("SSVToken");
  await network.initialize(
    registry.address,
    token.address,
    networkConfig[chainId].networkInitialization.minimumBlocksBeforeLiquidation,
    networkConfig[chainId].networkInitialization.operatorMaxFeeIncrease,
    networkConfig[chainId].networkInitialization.declareOperatorFeePeriod,
    networkConfig[chainId].networkInitialization.executeOperatorFeePeriod
  );
  console.log("Successfully staked", stakeValue, "WEI!");
  const totalStaked = await StakingPool.viewUserStake(deployer);
  console.log("Bringing your total staked to:", totalStaked.toString(), "WEI!");
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
