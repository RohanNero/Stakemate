const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");

/*@notice This function allows you to deposit validator keys at any desired stakingPool contract address
 * @param stakingPoolAddress - the contract address that will be called
 * @param depositDataFile - the json file name inside the keys/validator_keys folder */
async function depositValidator(stakingPoolAddress, depositDataFile) {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const stakeValue = networkConfig[chainId].stakeValue;
  //console.log("stakeValue:", stakeValue);
  //console.log("chainId:", chainId);
  const StakingPool = await ethers.getContract("StakingPoolV1");
  //console.log("stakingPool:", StakingPool.address);
}

depositValidator()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
