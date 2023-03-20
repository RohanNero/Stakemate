const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../../helper-hardhat-config.js");

/*@notice This function requires you to be on a chain with StakingFactory already deployed */
async function stake() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const stakeValue = networkConfig[chainId].stakeValue;
  //console.log("stakeValue:", stakeValue);
  //console.log("chainId:", chainId);
  try {
    const StakingFactory = await ethers.getContract("StakingFactoryV1");
    console.log("stakingFactory:", stakingFactory.address);
    let depositContract, SSVNetwork, SSVToken, opIds;
    if (developmentChains.includes(network.name)) {
      const depositContractObject = await ethers.getContract("DepositContract");
      depositContract = depositContractObject.address;
      const SSVNetworkObject = await ethers.getContract("SSVNetworkMock");
      SSVNetwork = SSVNetworkObject.address;
      const SSVTokenObject = await ethers.getContract("SSVToken");
      SSVToken = SSVTokenObject.address;
      opIds = networkConfig[chainId].operatorIds;
    } else {
      //log(networkConfig[chainId].SSVNetwork);
      depositContract = networkConfig[chainId].depositContract;
      SSVNetwork = networkConfig[chainId].SSVNetwork;
      SSVToken = networkConfig[chainId].SSVToken;

      opIds = networkConfig[chainId].operatorIds;
      //log(opIds);
    }
    const tx = await StakingFactory.createStakingPool(
      depositContract,
      SSVNetwork,
      SSVToken,
      opIds
    );
    console.log(await tx.wait(1));
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
