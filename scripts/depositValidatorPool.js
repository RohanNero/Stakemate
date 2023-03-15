const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");
const fs = require("fs");

/** this function deposits validator keys for specified contract address and config file
 * ( will need to use hardhat task to pass parameters)
 */
async function depositValidator() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  const stakeValue = networkConfig[chainId].stakeValue;
  //console.log("stakeValue:", stakeValue);
  //console.log("chainId:", chainId);
  const StakingPool = await ethers.getContract("StakingPoolV1");
  // const abi = fs.readFile("./abi/StakingPoolV1.json", function (err, data) {
  //   console.log(data);
  // });
  const depositData = fs.readdirSync("./keys/validator_keys", {
    encoding: "utf8",
  });
  const test = depositData[0];
  console.log(depositData);
  //console.log(test);
  for (let i = 0; i < depositData.length; i++) {
    if (depositData[i].includes("deposit_data")) {
      console.log(depositData[i]);
      const path = "./keys/validator_keys/" + depositData[i];
      console.log(path);
    }
  }

  //console.log("stakingPool:", StakingPool.address);
}

depositValidator()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
