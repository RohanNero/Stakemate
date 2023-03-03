const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");

/*@notice This function requires you to be on a chain with StakingPool already deployed */
async function stake() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const stakeValue = networkConfig[chainId].stakeValue;
  //console.log("stakeValue:", stakeValue);
  //console.log("chainId:", chainId);
  const StakingPool = await ethers.getContract("StakingPool");
  await StakingPool.stake({ value: stakeValue });
  console.log("Successfully staked", stakeValue, "WEI!");
  const totalStaked = await StakingPool.viewUserStake(deployer);
  console.log("Bringing your total staked to:", totalStaked.toString(), "WEI!");
}

stake()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
