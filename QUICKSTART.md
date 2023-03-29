# 🧙 Staking DVT

Powered by the SSV network

## 🌺 Initial setup

first **clone** into the repo

1. `git clone https://github.com/RohanNero/Stakemate`

**install** the dependencies

2. `yarn install`

**update** env variables

Now input your information into a `.env` file using the `.env.example` file as an example format
(you should only need to update the RPC endpoints, the private keys are default for the hardhat network)

3. `mv .env.example .env`

Now if you already have **validator keys** and **keyshares**, you can skip this next section and [begin deploying](#deploying-locally). If not then don't worry, this next section will provide you with everything you need to generate your own keys

### 🌼 Generating Keys

The **keys** folder is where we will handle all of the key generation/splitting, so begin by running:

4. `cd keys`

Before we can split our **validator key**, we will obviously need to create some! So for now, we'll be using implemented scripts from the [staking-deposit-cli](https://github.com/ethereum/staking-deposit-cli). These scripts are written in **Python** so you will need to have atleast version 3.8 installed, if you don't currently have it, then you can get the latest version [here](https://www.python.org/downloads/).

_Notice, before you generate keyshares you should've already picked out your preferred SSV operators. If you haven't already done this, you can view the entire selection of operators on the [ssv.network explorer](https://explorer.ssv.network/operators)_

First thing we should do is setup the [SSV Key Distributer CLI](https://docs.ssv.network/developers/tools/ssv-key-distributor/key-distributer-cli)

5. `chmod +x setup.sh`

6. `./setup.sh`

and install some additional dependencies

7. `pip install -r requirements.txt`

**🍄 But before we can call any functions**, we first have to set our `keys/config` file variables to our desired values

`keys/config/validator.json` is the first file you need to interact with. Replace the sample values for `validator_count`, `withdrawal_creds`, and `keystore_password`. _(You may leave the `keystore_password` blank if you're not using one)_

Now you're ready to generate **validator keys!** To do so run this command:

8. `python3 main.py create-keys -c config/validator.json`

Once you've generated **validator keys**, you're ready to **update your `keys/config/keyshare.json` values** with the correct `keystore_files` path and your desired operator information. Now finally lets split the **validator key(s)** by running:

9. `python3 main.py generate-keyshares -c config/keyshare.json`

Congratulations! You have now generated both **validator keys** and **SSV keyshares** from the command line!

### 🏵️ Deploying locally

_you must be in the root directory, either run `cd ..` or open a new terminal_

Now you can use 

10. `cd ..`
11. `yarn hardhat node` 

to **deploy the contracts** and **start hardhat's local blockchain**


To **fork mainnet locally** you can uncomment the `forking: { url: <key> }` url line in the **network** section of `hardhat.config.js` and run the previous command again.
Alternatively you can pass your api key directly when starting the blockchain like this:
`yarn hardhat node --fork <apiKey>`

Once your local blockchain is up and running, **open a new terminal** and you can now run some scripts!

### 🌸 Running scripts

Try out staking and unstaking to the **StakingPoolV1** contract with these commands:

12. `yarn hardhat run scripts/V1/stake.js --network localhost`

#### 🌹 Depositing keys

First lets deposit your **validator key** and send 32 ETH to the **deposit contract** with this command for **StakingPoolV1**

13. `yarn hardhat run scripts/V1/depositValidator.js --network localhost`

_If you try to run this script without having atleast 32 ETH in the contract it will throw an error_

Once you have successfully deposited your **validator key**, it's time to deposit your **keyshares**!

14. `yarn hardhat run scripts/V1/depositKeyshares.js --network localhost`

Whenever you're ready to take things to the next step, lets deploy on **Goerli testnet!**
[README](README.md)
