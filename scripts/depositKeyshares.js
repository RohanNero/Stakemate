const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js");
const fs = require("fs-extra");

/** this function deposits validator keys for specified contract address and config file
 * ( will need to use hardhat task to pass parameters)
 */
async function depositKeyshares() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  //console.log("chainId:", chainId);
  const stakingPool = await ethers.getContract("StakingPoolV1");
  console.log("stakingPool:", stakingPool.address);
  // const abi = fs.readFile("./abi/StakingPoolV1.json", function (err, data) {
  //   console.log(data);
  // });
  const keysharesFolder = fs.readdirSync("./keys/keyshares", {
    encoding: "utf8",
  });
  const test = keysharesFolder[0];
  //console.log(keysharesFolder);
  let path;
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
  //console.log("keyshares length:", keyshares.length);

  const depositContractAddress = await stakingPool.viewDepositContractAddress();
  console.log("depositContractAddress:", depositContractAddress);

  const opIds = payload.operatorIds.split(",");
  console.log(opIds);
  console.log(await stakingPool.owner());
  const tx = await stakingPool.depositShares(
    payload.validatorPublicKey,
    opIds,
    payload.sharePublicKeys,
    payload.sharePrivateKey,
    payload.ssvAmount
  );
  //const txReceipt = await tx.wait(1);
  //console.log(txReceipt.events);
  // if (txReceipt.events[1].event.includes("KeySharesDeposited")) {
  //   console.log(true);
  // }
}

depositKeyshares()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
