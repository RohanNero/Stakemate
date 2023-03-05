const developmentChains = ["hardhat", "localhost"];

const networkConfig = {
  1337: {
    name: "hardhat",
    operatorIds: [1, 2, 9, 42],
    ssvNetwork: "0x3D776231fE7EE264c89a9B09647ACFD955cD1d9b",
    stakeValue: "32010000000000000000", // 32.01 ETH
    blockConfirmations: 1,
  },
  31337: {
    name: "localhost",
    operatorIds: [1, 2, 9, 42],
    SSVNetwork: "0x3D776231fE7EE264c89a9B09647ACFD955cD1d9b",
    stakeValue: "32010000000000000000", // 32.01 ETH
    blockConfirmations: 1,
    networkInitialization: {
      minimumBlocksBeforeLiquidation: "1",
      operatorMaxFeeIncrease: "3",
      declareOperatorFeePeriod: "3",
      executeOperatorFeePeriod: "7",
    },
  },
  5: {
    name: "goerli",
    operatorIds: [1, 2, 9, 42],
    depositContract: "0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b",
    SSVNetwork: "0x3D776231fE7EE264c89a9B09647ACFD955cD1d9b",
    SSVToken: "0x3a9f01091C446bdE031E39ea8354647AFef091E7",
    stakeValue: "1000000000000000", // .01 ETH
    blockConfirmations: 5,
    networkInitialization: {
      minimumBlocksBeforeLiquidation: "1",
      operatorMaxFeeIncrease: "3",
      declareOperatorFeePeriod: "3",
      executeOperatorFeePeriod: "7",
    },
  },
  80001: {
    name: "mumbai",
    depositContract: "0x",
    blockConfirmations: 3,
  },
  43113: {
    name: "fuji",
    depositContract: "0x",
    blockConfirmations: 3,
  },
  1: {
    name: "mainnet",
    depositContract: "0x00000000219ab540356cbb839cbe05303d7705fa",
    blockConfirmations: 3,
  },
};

module.exports = {
  developmentChains,
  networkConfig,
};
