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
    const StakingPool = await ethers.getContract("StakingPoolV1");
    //console.log("stakingPool:", StakingPool.address);

    const tx = await StakingPool.stake({ value: stakeValue });
    console.log("Successfully staked", stakeValue, "WEI!");
    const totalStaked = await StakingPool.viewUserStake(deployer);
    if (!developmentChains.includes(network.name)) {
      await tx.wait(1);
    }
    console.log(
      "Bringing your total staked to:",
      totalStaked.toString(),
      "WEI!"
    );
  } catch (error) {
    if (network.name == "hardhat") {
      console.log(
        "---------------------------------------------------------------------------------------------"
      );
      console.log(
        "If you are trying to use the hardhat local blockchain you need to pass `--network localhost` "
      );
      console.log(
        "---------------------------------------------------------------------------------------------"
      );
      throw error;
    } else {
      throw error;
    }
  }
}

stake()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
