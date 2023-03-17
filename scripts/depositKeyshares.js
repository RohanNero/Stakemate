const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");
const fs = require("fs-extra");
process.env.NODE_NO_WARNINGS = "stream/web";

/** this function deposits validator keys for specified contract address and config file
 * ( will need to use hardhat task to pass parameters)
 */
async function depositKeyshares() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  //console.log("chainId:", chainId);
  let path;
  const stakingPool = await ethers.getContract("StakingPoolV1");
  //console.log("stakingPool:", stakingPool.address);
  if (chainId == 31337) {
    const network = await ethers.getContract("SSVNetworkMock");
    const registry = await ethers.getContract("SSVRegistryMock");
    const token = await ethers.getContract("SSVToken");
    const setRegistry = await network.setRegistryContract(registry.address);
    const setToken = await network.setTokenAddress(token.address);
    const owner = await registry.owner();
    //console.log("owner:", owner);
    const transferOwner = await registry.transferOwnership(network.address);
    const newOwner = await registry.owner();
    //console.log("newOwner:", newOwner);
  }
  // const abi = fs.readFile("./abi/StakingPoolV1.json", function (err, data) {
  //   console.log(data);
  // });
  const keysharesFolder = fs.readdirSync("./keys/keyshares", {
    encoding: "utf8",
  });
  const test = keysharesFolder[0];
  //console.log(keysharesFolder);

  //console.log("test:", test);
  for (let i = 0; i < keysharesFolder.length; i++) {
    if (keysharesFolder[i].includes("keyshares")) {
      //console.log(keyshares[i]);
      path = "./keys/keyshares/" + keysharesFolder[i];
      //console.log("path:", path);
    }
  }
  const keyshares = fs.readJsonSync(path, { encoding: "utf8" });
  //console.log(keyshares.payload.readable);
  const payload = keyshares.payload.readable;
  // console.log(payload.validatorPublicKey);
  // console.log(payload.operatorIds);
  // console.log(payload.sharePublicKeys);
  // console.log(payload.sharePrivateKey);
  // console.log(payload.ssvAmount);

  const depositContractAddress = await stakingPool.viewDepositContractAddress();
  //console.log("depositContractAddress:", depositContractAddress);

  const opIds = payload.operatorIds.split(",");
  //console.log("operatorIds:", opIds);
  //console.log("stakingPool owner:", await stakingPool.owner());
  try {
    const tx = await stakingPool.depositShares(
      payload.validatorPublicKey,
      opIds,
      payload.sharePublicKeys,
      payload.sharePrivateKey,
      payload.ssvAmount
    );
    const txReceipt = await tx.wait(1);
    //console.log(txReceipt.events[2]);
    if (txReceipt.events[2].event.includes("KeySharesDeposited")) {
      console.log("Successfully deposited keyshares:", payload.sharePublicKeys);
      console.log("Associated validatorKey:", payload.validatorPublicKey);
    }
  } catch (error) {
    if (error.message.includes("ValidatorAlreadyExists")) {
      console.log("ERROR: Validator already exists!");
      console.log(
        "You may need to restart your hardhat node or generate a new validator key."
      );
    }
  }
}

depositKeyshares()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
