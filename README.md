# Staking DVT

Powered by the SSV network

## How to use

first clone into the repo

`git clone https://github.com/RohanNero/hardhat-dvt-staking`

install the dependencies

`yarn install`

compile the contracts

`yarn hardhat compile`

Now input your information into a `.env` file using the `.env.example` file as an example format

Now if you already have **validator keys** and **keyshares**, you can skip this next section and [begin deploying](#deploying-locally). If not then don't worry this next section will provide you with everything you need to generate your own keys


### Generating Keys 

Before we can split our validator key, we will obviously need to create some! So for now, we'll be using implemented scripts from the [staking-deposit-cli](https://github.com/ethereum/staking-deposit-cli). These scripts are written in Python so you will need to have atleast version 3.8 installed, if you don't currently have it, then you can get the latest version [here](https://www.python.org/downloads/).

*Notice, before you generate keyshares you should've already picked out your preferred SSV operators. If you haven't already done this, you can view the entire selection of operators on the [ssv.network explorer](https://explorer.ssv.network/operators)*

The `keys` folder is where we will handle all of the key generation/splitting, so begin by running this command to enter into it: 

`cd keys`

Now we need to install some additional dependencies 

`pip install -r requirements.txt`

To see what command line options are supported you can run 

`python main.py -h` / `--help`

But before we can call any functions, we first have to set our `keys/config` file variables to our desired values

`keys/config/validator.json` is the first file you need to interact with. Replace the sample values for `validator_count`, `withdrawal_creds`, and `keystore_password`. *(You may leave the `keystore_password` blank if you're not using one)*

Now you're ready to generate validator keys! To do so run this command:

`python3 main.py create-keys -c config/validator.json`

Once you've generated validator keys, you're ready to update your `keys/config/keyshare.json` values with the correct `keystore_files` path and your desired operator information. Now finally lets split the validator key(s) by running:


`python3 main.py generate-keyshares -c config/keyshare.json`


### Deploying locally 

Now you can use `yarn hardhat node` to deploy the contracts and start hardhat's local blockchain

To fork mainnet locally you can uncomment the `forking: { url: <key> }` url line in the network section of `hardhat.config.js` and run the previous command again.
Or alternatively you can pass your api key directly when starting the blockchain like this:
`yarn hardhat node --fork <apiKey>`

Once your local blockchain is up and running, open a new terminal and you can now run some scripts!

Try out staking and unstaking to the StakingPoolV1 contract with these commands:

`yarn hardhat run scripts/stake.js`

`yarn hardhat run scripts/unstake.js`

Whenever you're ready to take things to the next step, lets deploy on Goerli testnet!

### Deploying to a testnet

For example:

`yarn hardhat deploy --network goerli`

The command line should return you your new contract addresses so you can view them on a block explorer

From this point you can run your scripts like you did before but this time pass the corresponding network's name as an argument:

`yarn hardhat run scripts/stake.js --network goerli`

### Deployed contract addresses:

#### Goerli testnet

- [StakingPoolV1](https://goerli.etherscan.io/address/0xB772Efb53A5dfAb66BaC0B025D07aF46623359e2#code)
- [LiquidStakingPoolV1](https://goerli.etherscan.io/address/0xAD59421FA63088091f96aD24675011bF9C4Cfa92#code)
- [StakingFactoryV1](https://goerli.etherscan.io/address/0xD051E12d194D6D0378098D27C01dDee09fdE3Cea#code)

## Helpful links & sources

- [Goerli SSVToken on etherscan](https://goerli.etherscan.io/address/0x3a9f01091c446bde031e39ea8354647afef091e7)
- [Goerli SSV faucet](https://faucet.ssv.network/)
- [Mainnet validator deposit contract](https://etherscan.io/address/0x00000000219ab540356cBB839Cbe05303d7705Fa)
- [Mnemonic wordlist](https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md)
- [vanity ETH](https://vanity-eth.tk/)
- [SSV Documentation](https://ssv.network/)
- [Go Ethereum keystore docs](https://goethereumbook.org/keystore/)
- [keystore EIP](https://github.com/ethereum/EIPs/issues/2339)
- [Ethereum staking CLI](https://github.com/ethereum/staking-deposit-cli)
- [ETH denver](https://hackathon.ssv.network/#ba1b1f80aedd4932ae7c56a119eac4d0)
- [SSZ encoding (`deposit_data_root`)](https://ethereum.org/en/developers/docs/data-structures-and-encoding/ssz/)
- [Validator key documentation](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/keys/#validator-key)
- [BLS12-381 key generation](https://eips.ethereum.org/EIPS/eip-2333)
- [Goerli Deposit Contract](https://goerli.etherscan.io/address/0xff50ed3d0ec03ac01d4c79aad74928bff48a7b2b)
- [Mainnet Deposit Contract](https://etherscan.io/address/0x00000000219ab540356cbb839cbe05303d7705fa)
- [Goerli SSVNetwork](https://goerli.etherscan.io/address/0x3d776231fe7ee264c89a9b09647acfd955cd1d9b)
- [Hardhat-contract sizer](https://github.com/sc-forks/solidity-coverage/issues/417#issuecomment-730539065)
- [Example ssv grant proposal](https://docs.google.com/document/d/1ZOPtScnGhrMO3oFbeZMdlxmLdS4JTnup5rydVky9RC0/edit)
- [SSV grant template](https://docs.google.com/document/d/11gW05q5zOd07mPMCBNw-u54NQWjLzadfuP5PK94vSJw/edit#)
- [BLS12-381](https://hackmd.io/@benjaminion/bls12-381)
- [BIP-0039](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [EIP-2333](https://eips.ethereum.org/EIPS/eip-2333#implementation)
