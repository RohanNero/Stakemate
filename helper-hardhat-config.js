const developmentChains = ["hardhat", "localhost"];

const networkConfig = {
  1337: {
    name: "localhost",
  },
  5: {
    name: "goerli",
    depositContract: "0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b",
  },
  80001: {
    name: "mumbai",
    depositContract: "0x",
  },
  43113: {
    name: "fuji",
    depositContract: "0x",
  },
  1: {
    name: "mainnet",
    depositContract: "0x00000000219ab540356cbb839cbe05303d7705fa",
  },
};

module.exports = {
  developmentChains,
  networkConfig,
};
