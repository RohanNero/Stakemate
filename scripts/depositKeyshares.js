const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");
const fs = require("fs-extra");
process.env.NODE_NO_WARNINGS = "stream/web";

/** this function deposits validator keys for most recently deployed contracts on the chosen network
 * the payload is taken from the last file in your keys/keyshares/ folder
 */
async function depositKeyshares() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  //console.log("chainId:", chainId);
  let path;
  const stakingPool = await ethers.getContract("StakingPoolV1");
  //console.log("stakingPool:", stakingPool.address);

  /** If on localhost some values need to be set before the script can run */
  if (chainId == 31337) {
    const network = await ethers.getContract("SSVNetworkMock");
    const registry = await ethers.getContract("SSVRegistryMock");
    const token = await ethers.getContract("SSVToken");
    const setRegistry = await network.setRegistryContract(registry.address);
    const setToken = await network.setTokenAddress(token.address);
    //owner = await registry.owner();
    //console.log("owner:", owner);
    const transferOwner = await registry.transferOwnership(network.address);
    //newOwner = await registry.owner();
    //console.log("newOwner:", newOwner);
    //console.log("stakingPool owner:", await stakingPool.owner());
    // const depositContractAddress =
    //   await stakingPool.viewDepositContractAddress();
    // console.log("depositContractAddress:", depositContractAddress);
  }

  const keysharesFolder = fs.readdirSync("./keys/keyshares", {
    encoding: "utf8",
  });
  //const test = keysharesFolder[0];
  //console.log(keysharesFolder);
  //console.log("test:", test);
  console.log("keysharesFolder Length:", keysharesFolder.length);

  for (let i = 0; i < keysharesFolder.length; i++) {
    if (keysharesFolder[i].includes("keyshares")) {
      path = "./keys/keyshares/" + keysharesFolder[i];
      //console.log("path:", path);
      const keyshares = fs.readJsonSync(path, { encoding: "utf8" });
      //console.log("keyshareAtIndex:", keyshares[i]);
      //console.log(keyshares.payload.readable);
      const payload = keyshares.payload.readable;
      //console.log("---------------------");
      //console.log("PAYLOAD CONSOLE LOGS");
      //console.log("---------------------");
      //console.log("validatorKey:", payload.validatorPublicKey);
      //console.log("operatorIds:", payload.operatorIds);
      //console.log(payload.sharePublicKeys);
      //console.log(payload.sharePrivateKey);
      //console.log("ssvAmount:", payload.ssvAmount);
      //console.log("---------------------");

      try {
        const opIds = payload.operatorIds.split(",");
        //console.log("operatorIds:", opIds);
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
          console.log(
            "Successfully deposited keyshares:",
            payload.sharePublicKeys
          );
          console.log("Associated validatorKey:", payload.validatorPublicKey);
        }
      } catch (error) {
        if (error.message.includes("ValidatorAlreadyExists")) {
          console.log("ERROR: Validator already exists!");
          console.log(
            "You may need to restart your hardhat node or generate a new validator key."
          );
        } else {
          console.log(error);
        }
      }
    }
  }
}

depositKeyshares()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
