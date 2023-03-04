# Staking DVT

Powered by the SSV network

## How to use

first clone into the repo

`git clone https://github.com/RohanNero/hardhat-dvt-staking`

install the dependencies

`yarn install`

compile the contracts

`yarn hardhat compile`

If you want to use the same validator public key as the withdrawal public key then you need to see the `namedAccounts` section in the `hardhat.config.js` file.

Now input your information into a `.env` file using the `.env.example` file as an example format.

Once you have set your variables to

### Deploying locally

Now you can use `yarn hardhat node` to deploy the contracts and start hardhat's local blockchain

### Steps to using SSV

**Notice:** When deploying to a forked chain pass `http://localhost:8545` as the RPC url
**Notice:** I had to add `override` to the SSVNetwork contract's `validatorsPerOperatorCount()`

1. ### Stake a collective 32 ETH between all stakers

   - This can be easily accomplished or mimicked for testing purposes, only involves StakingDVT logic.

2. ### Generate your ethereum validator keys along with the `deposit_data_root`

   -
   - **ssv-awesome** reads from a config file to pass the params
     1. **Command:** `python3 main.py create-keys -c sample_config/validator-config.json`
     2. **Description:** "This option can be used to generate ethereum validator keys and their deposit data"

3. ### Next step is to generate the key shares

   -

   - **ssv-awesome** reads from a config file to pass the params

     1. **Command:** `python3 main.py generate-keyshares -c sample_config/keyshare-config.json`
     2. **Description:** "This option can be used to generate SSV keyshares using ssv cli tool"

4. ### Then you deposit the validator keys

   - This should call the Beacon depositContract's `deposit()` function and pass it these params:

     1. **bytes calldata** `pubkey` - A BLS12-381 public key
     2. **bytes calldata** `withdrawal_credentials` - Commitment to a public key for withdrawals.
     3. **bytes calldata** `signature` - A BLS12-381 signature.
     4. **bytes32** `deposit_data_root` - The SHA-256 hash of the SSZ-encoded DepositData object. (Used as a protection against malformed input.)

   - **ssv-awesome** reads from a config file to pass the params
     1. **Command:** `python3 main.py deposit-validators -c sample_config/deposit-validator.json`
     2. **Description:** "This option can be used to submit validator to stakepool"

5. ### Finally you deposit the key shares

   - This should call SSVNetwork's `registerValidator()` function and pass it these params:

     1. **bytes** `publicKey` - Validator public key.
     2. **uint32[]** `operatorIds` - Operator public keys.
     3. **bytes[]** `sharesPublicKeys` - Shares public keys.
     4. **bytes[]** `sharesEncrypted` - Encrypted private keys.
     5. **uint256** `amount` - Amount of tokens to deposit.

   - **ssv-awesome** reads from a config file to pass the params

     1. **Command:** `python3 main.py deposit-keyshares -c sample_config/deposit-validator.json`
     2. **Description:** "This option can be used to submit validator keyshares to stakepool"

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
