const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../../helper-hardhat-config.js");

/*@notice This function requires you to be on a chain with StakingPool already deployed */
async function stake() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const stakeValue = networkConfig[chainId].stakeValue;
  //console.log("stakeValue:", stakeValue);
  //console.log("chainId:", chainId);
  try {
    const StakingPool = await ethers.getContract("LiquidStakingPoolV1");
    console.log("stakingPool:", StakingPool.address);
    await StakingPool.stake({ value: stakeValue });
    console.log("Successfully staked", stakeValue, "WEI!");
    const totalStaked = await StakingPool.viewUserStake(deployer);
    console.log(
      "Bringing your total staked to:",
      totalStaked.toString(),
      "WEI!"
    );
  } catch (error) {
    console.log(error);
    console.log(
      "---------------------------------------------------------------------------------------------"
    );
    console.log(
      "if you are trying to use the hardhat local blockchain you need to pass `--network localhost` "
    );
  }
}

stake()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
