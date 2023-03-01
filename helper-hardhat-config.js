const developmentChains = ["hardhat", "localhost"];

const networkConfig = {
  1337: {
    name: "localhost",
  },
  5: {
    name: "goerli",
  },
  80001: {
    name: "mumbai",
  },
  43113: {
    name: "fuji",
  },
};

module.exports = {
  developmentChains,
  networkConfig,
};
