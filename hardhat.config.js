require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("chai");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.18" },
      { version: "0.6.11" },
      { version: "0.8.4" },
    ],
  },
};
