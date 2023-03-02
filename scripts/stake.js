const { ethers, network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");

/*@notice This function requires you to be on a chain with StakingPool already deployed */
async function stake() {
  const chainId = await getChainId();
  const stakeValue = networkConfig[chainId].stakeValue;
  //console.log(stakeValue);
  const StakingPool = await ethers.getContract("StakingPool");
  await StakingPool.stake({ value: stakeValue });
  console.log("Successfully staked", stakeValue, "WEI!");

  // Only formats correctly if stakeValue is set to 32.01 ether in helper-hardhat-config.js
  if (developmentChains.includes(network.name)) {
    const formattedStakeValue =
      stakeValue.slice(0, 2) + "." + stakeValue.slice(2, 7);
    console.log("Which is", formattedStakeValue, "Ether!");
  }
}

stake()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
