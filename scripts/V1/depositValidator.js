const { ethers, network, deployments } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../../helper-hardhat-config.js");
const fs = require("fs-extra");

/** this function deposits validator keys for specified contract address and config file
 * ( will need to use hardhat task to pass parameters)
 */
async function depositValidator() {
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  //console.log("chainId:", chainId);
  try {
    const stakingPool = await ethers.getContract("StakingPoolV1");
    //console.log("stakingPool:", stakingPool.address);

    // const abi = fs.readFile("./abi/StakingPoolV1.json", function (err, data) {
    //   console.log(data);
    // });
    const depositDataFolder = fs.readdirSync("./keys/validator_keys", {
      encoding: "utf8",
    });
    const test = depositDataFolder[0];
    //console.log(depositDataFolder);
    let path;
    //console.log(test);
    for (let i = 0; i < depositDataFolder.length; i++) {
      if (depositDataFolder[i].includes("deposit_data")) {
        //console.log(depositData[i]);
        path = "./keys/validator_keys/" + depositDataFolder[i];
        //console.log("path:", path);
      }
    }
    const depositData = fs.readJsonSync(path, { encoding: "utf8" });
    //console.log(depositData);
    //console.log("depositData length:", depositData.length);
    for (let i = 0; i < depositData.length; i++) {
      try {
        // const args = [
        //   depositData[i].pubkey,
        //   depositData[i].withdrawal_credentials,
        //   depositData[i].signature,
        //   depositData[i].deposit_data_root,
        // ];
        // console.log(args);
        const tx = await stakingPool.depositValidator(
          "0x" + depositData[i].pubkey,
          "0x" + depositData[i].withdrawal_credentials,
          "0x" + depositData[i].signature,
          "0x" + depositData[i].deposit_data_root
        );
        const txReceipt = await tx.wait(1);
        //console.log(txReceipt.events[1].event);
        if (txReceipt.events[1].event.includes("PublicKeyDeposited")) {
          console.log(
            "The public key",
            depositData[i].pubkey,
            "was deposited!"
          );
        }
      } catch (error) {
        if (error.message.includes("InsufficientEtherBalance")) {
          console.log("You must stake atleast 32 Ether first!");
        } else {
          console.log(error);
        }
      }
    }
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

depositValidator()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
