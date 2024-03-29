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
  try {
    const StakingPool = await ethers.getContract("LiquidStakingPoolV1");
    const StakingPoolssvEthAddress = await StakingPool.viewSSVETHAddress();
    //console.log("ssvEth:", StakingPoolssvEthAddress);
    const SSVETH = await ethers.getContractAt(
      "SSVETH",
      StakingPoolssvEthAddress.toString()
    );
    //console.log(SSVETH);
    const userStake = await StakingPool.viewUserStake(deployer);
    //console.log("userStake:", userStake.toString());
    const SSVETHBalance = await SSVETH.balanceOf(deployer);
    //console.log("SSVETHBalance:", SSVETHBalance.toString());

    await SSVETH.approve(StakingPool.address, SSVETHBalance);
    await StakingPool.unstake(userStake);
    console.log("Successfully unStaked", userStake.toString(), "WEI!");

    const stillStaked = await StakingPool.viewUserStake(deployer);
    console.log("You now have", stillStaked.toString(), "still staked!");

    //const owner = await StakingPool.owner();
    //console.log("owner:", owner);
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
    }
    console.log(error);
  }
}

unStake()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
