## V2 upgrades

### Managing unstaking

#### Notice: the straightforward solution would be to have pools of currency that are used to temporarily fill `unstake()` orders that fall below the **32 ETH** threshold, however I want to explore other options that don't require having an initial supply of capital.

- To manage users unstaking after the **32 ETH** has been sent, we can implement a mechanism that only allows users to **unstake** if the amount after the **unstake** is still enough to run the validator (**32 ETH**), if the amount they want to **unstake** is more than the contract allows, users will need to `proposeUnstake(uint amount)` with the **WEI** amount they wish to **unstake**. Any other user that attempts to **stake** will be diverted to a `proposedUnstake` first if they exist.

  - users can **unstake** at any time before the **32 ETH** has been sent to the **deposit contract**.
  - if a user tries to **stake** an amount that isnt <= to the oldest proposed **stake**, only part of the `proposedUnstake` will be fulfilled.
  - if a user tries to **stake** an amount that is greater than the oldest proposed **stake**, that `proposedUnstake` will be completely fulfilled, and then the next oldest `proposedUnstake` will get any remaining value.
  - _(if the stake is more than that `proposedUnstake` the cycle continues until the **stake** amount is finished, any remaining after that will be staked like normal)_
  - _(propose stake diversions will be on a first come first serve basis)_

### Managing withdrawals

### Managing rewards

- will may need **3 uints**
  - `originalStake`
  - `rewards`
  - `totalStake` _(this doesnt need to get its own variable since it is `originalStake + rewards`)_
- a **function** that returns what **percentage / portion** of stake you own would be helpful
-

### Multi sig implementation

- v2 contracts could use multi-sig transaction format as well as parameratized token address for using whichever token (instead of deploying one)

  - implement price feed to track token value since it wont be 1:1 like SSVETH.
  - v2 contracts could have type checks inside of functions calls to ensure function was called/variables were updated correctly.

- need to create a LiquidStakingPoolV2 that takes an additional param: `address token` _(duplicate of first point)_

  - this will be the token to use instead of deploying an ERC20 in constructor
  - need to update mint/burnFrom flow in that contract (`transfer`/`tranferFrom`)

- need to decrement/ do something with `userStake` when **validator key** is deposited aka **32 ETH** sent to `depositContract`

  - to calculate how much users should get back I will need to create `struct Validator` and an array: `Validators[] public validatorArray;`
  - It will require user withdrawals to be based upon the percentage of the `32 ETH` they staked.
  - a `uint rewards` inside of the validator struct would help calculate the how much the users have to withdraw
  - a `uint totalRewards` and a `mapping(address user => uint totalWithdrawn) public totalWithdrawn;` would also help with calculation
  - the `function withdraw()` would only allow users to withdraw a portion equivalent to the ratio/percentage they staked for the validator.
  - this would likely mean that the withdraw function would require either an `address pubkey` or a `uint validatorArrayIndex` relating to the correct `Validator` struct object.

  - need to add function to add _validatorKey_ && emit _PublicKeyDeposited_ event if the owner has interacted with DepositContract directly.
    - will call a view function on depositContract as proof that StakingPool owner owns the key

- alternative to scripts = tasks
  - these will be advanced scripts with parameters such as a contract address or config file name
  - this way users can also choose what amount and contract to stake/unstake to/from.
  - /\*@notice This function allows you to deposit validator keys at any desired stakingPool contract address

* @param stakingPoolAddress - the contract address that will be called
* @param depositDataFile - the json file name inside the keys/validator_keys folder \*/

- need to add try & catch statement to scripts, if error says "No contract deployed with name" then return console.log ✅✅✅

- need to implement [SSV Key distributer SDK](https://docs.ssv.network/developers/tools/ssv-key-distributor/key-distributer-sdk) instead of using the python key distributer cli

- need to upgrade smart contracts

- need to add events to Factory

  - need to finish creation scripts on factory

- plan atm
  - write plenty of tests
  - work on frontend
  - create V2 contracts and scripts

## Additional plans

- I propose a new `SafeStakingPoolV1` contract that comes with immutable values so that even if the owner is malicious, they can't affect users' stake. Also functions that are open to public after conditions are met.

- this brings the current suit to 3 V1 variations with 1 V1 contract Factory.
  - V2 is only added for format/structure
    s
