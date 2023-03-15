const { ethers, network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../../helper-hardhat-config.js");

/*@notice This function requires you to be on a chain with StakingPool already deployed */
async function unStake() {
  const chainId = await getChainId();
  const { deployer } = await getNamedAccounts();
  const stakeValue = networkConfig[chainId].stakeValue;
  //console.log(stakeValue);
  //console.log(deployer);
  const StakingPool = await ethers.getContract("StakingPoolV1");
  const userStake = await StakingPool.viewUserStake(deployer);
  //console.log("userStake:", userStake.toString());

  const tx = await StakingPool.unstake(userStake);
  console.log("Successfully unStaked", userStake.toString(), "WEI!");
  if (!developmentChains.includes(network.name)) {
    await tx.wait(1);
  }
  const stillStaked = await StakingPool.viewUserStake(deployer);
  console.log("You now have", stillStaked.toString(), "still staked!");

  //const owner = await StakingPool.owner();
  //console.log("owner:", owner);
}

unStake()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
