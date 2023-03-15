const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");

/*@notice This function requires you to be on a chain with StakingPool already deployed */
async function depositKeyShares() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  //console.log("chainId:", chainId);
  const StakingPool = await ethers.getContract("StakingPoolV1");
  //console.log("stakingPool:", StakingPool.address);
}

depositKeyShares()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
