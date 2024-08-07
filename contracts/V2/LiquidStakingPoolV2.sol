// //SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "../interfaces/IDepositContract.sol";
// import "../interfaces/ISSVNetwork.sol";
// import "../SSVETH.sol";


// error LiquidStakingPool__AtleastFourOperators(uint idsLength);
// error LiquidStakingPool__CantStakeZeroWei();
// error LiquidStakingPool__EtherCallFailed();
// error LiquidStakingPool__OperatorIdAlreadyAdded(uint32 operatorId, uint index);
// error LiquidStakingPool__InputLengthsMustMatch(uint operatorsIds, uint sharesPublicKeys, uint encryptedKeys);
// error LiquidStakingPool__InvalidOperatorIndex(uint operatorIdsLength, uint operatorIndex);
// error LiquidStakingPool__InvalidPublicKeyLength(uint publicKeyLength);
// error LiquidStakingPool__InsufficientEtherBalance(uint requiredBalance, uint currentBalance);

// /**
// * @title StakingPool
// * @author Rohan Nero
// * @notice this contract allows multiple users to activate a validator and split the key into SSV keyshares
// * @dev this contract issues a staking token called SSVETH upon calling `stake()` */
// contract LiquidStakingPoolV2 is Ownable, ReentrancyGuard {

//     IDepositContract private immutable DepositContract;
//     SSVETH private ssvETH;
//     IERC20 private token;
//     ISSVNetwork private network;
//     uint72 private constant VALIDATOR_AMOUNT = 32 * 1e18;
//     uint32[] private operatorIds;
//     bytes[] private validators;
//     mapping(address => uint256) private userStake;

//     event UserStaked(address indexed user, uint256 indexed amount);
//     event UserUnstaked(address indexed user, uint256 indexed amount);
//     event PublicKeyDeposited(bytes indexed pubkey);
//     event OperatorAdded(uint32 indexed operatorId, uint operatorIdsIndex);
//     event OperatorRemoved(uint32 indexed operatorId);
//     event KeySharesDeposited(
//         bytes indexed pubkey,
//         bytes[] indexed sharesPublicKeys,
//         uint32[] indexed operatorIds,
//         uint256 SSVamount
//     );

//     /**@notice sets contract addresses and operatorIds 
//      * @param depositAddress the beacon chain's deposit contract
//      * @param ssvNetwork the ISSVNetwork contract address (interface)
//      * @param ssvToken the SSVToken contract address
//      * @param _operatorIds the SSV operatorIds you've selected */
//      constructor(
//         address depositAddress,
//         address ssvNetwork,
//         address ssvToken,
//         uint32[] memory _operatorIds
//     ) payable {
//         DepositContract = IDepositContract(depositAddress);
//         SSVETH _ssvETH = new SSVETH();
//         ssvETH = SSVETH(address(_ssvETH));
//         token = IERC20(ssvToken);
//         network = ISSVNetwork(ssvNetwork);
//         if(_operatorIds.length < 4) {
//             revert LiquidStakingPool__AtleastFourOperators(_operatorIds.length);
//         }
//         if(msg.value > 0) {
//             userStake[tx.origin] += msg.value;
//             ssvETH.mint(tx.origin, msg.value);
//             emit UserStaked(tx.origin, msg.value);
//         }
//         operatorIds = _operatorIds;
//     }

//     /**@notice called when the contract receives ETH 
//      */
//     receive() external payable {
//         ssvETH.mint(msg.sender, msg.value);
//         userStake[msg.sender] += msg.value;
//         emit UserStaked(msg.sender, msg.value);
//     }    


//     /** Main functions */


//     /**@notice stake tokens on behalf of msg.sender
//      */
//     function stake() public payable nonReentrant {
//         if(msg.value == 0) {
//             revert LiquidStakingPool__CantStakeZeroWei();
//         }
//         ssvETH.mint(msg.sender, msg.value);
//         userStake[msg.sender] += msg.value;
//         emit UserStaked(msg.sender, msg.value);
//     }

//     /**@notice Unstake tokens
//      * @param amount: Amount to be unstaked
//      */
//     function unstake(uint256 amount) public nonReentrant {
//         ssvETH.burnFrom(msg.sender, amount);
//         (bool sent, ) = payable(msg.sender).call{value: amount}("");
//         if(!sent) {
//             revert LiquidStakingPool__EtherCallFailed();
//         }
//         userStake[msg.sender] -= amount;
//         emit UserUnstaked(msg.sender, amount);
//     }

//     /**@notice Deposit a validator to the deposit contract
//      * @dev these params together are known as the DepositData
//      * @param publicKey: Public key of the validator
//      * @param _withdrawal_credentials: Withdrawal public key of the validator
//      * @param _signature: BLS12-381 signature of the deposit data
//      * @param _deposit_data_root: The SHA-256 hash of the SSZ-encoded DepositData object
//      */
//     function depositValidator(
//         bytes calldata publicKey,
//         bytes calldata _withdrawal_credentials,
//         bytes calldata _signature,
//         bytes32 _deposit_data_root
//     ) external onlyOwner {
//         if(address(this).balance < VALIDATOR_AMOUNT) {
//             revert LiquidStakingPool__InsufficientEtherBalance(VALIDATOR_AMOUNT ,address(this).balance);
//         }
//         if (publicKey.length != 48) {
//             revert LiquidStakingPool__InvalidPublicKeyLength(publicKey.length);
//         }
//         DepositContract.deposit{value: VALIDATOR_AMOUNT}(
//             publicKey,
//             _withdrawal_credentials,
//             _signature,
//             _deposit_data_root
//         );
//         emit PublicKeyDeposited(publicKey);
//     }

//     /**@notice allows owner to submit validator keys and operator keys to SSVNetwork
//      * @dev Deposit shares for a validator
//      * @param publicKey: Public key of the validator
//      * @param _operatorIds: IDs of the validator's operators
//      * @param sharesPublicKeys: Public keys of the shares
//      * @param encryptedKeys: Encrypted private keys
//      * @param amount: Amount of tokens to be deposited
//      */
//     function depositShares(
//         bytes calldata publicKey,
//         uint32[] calldata _operatorIds,
//         bytes[] calldata sharesPublicKeys,
//         bytes[] calldata encryptedKeys,
//         uint256 amount
//     ) external onlyOwner {
//         if (publicKey.length != 48) {
//             revert LiquidStakingPool__InvalidPublicKeyLength(publicKey.length);
//         }
//         if (_operatorIds.length < 4 ) {
//             revert LiquidStakingPool__AtleastFourOperators(_operatorIds.length);
//         }
//         if (
//             _operatorIds.length != sharesPublicKeys.length ||
//             _operatorIds.length != encryptedKeys.length
            
//         ) {
//             revert LiquidStakingPool__InputLengthsMustMatch(_operatorIds.length, sharesPublicKeys.length, encryptedKeys.length);
//         }
//         token.approve(address(network), amount);
//         network.registerValidator(
//             publicKey,
//             _operatorIds,
//             sharesPublicKeys,
//             encryptedKeys,
//             amount
//         );
//         validators.push(publicKey);
//         emit KeySharesDeposited(publicKey, sharesPublicKeys,_operatorIds, amount);
//     }

//     /**@notice allows the owner to add operators to the operatorIds array
//      * @param  operatorId the operatorId assigned by SSV */
//     function addOperator(uint32 operatorId) public onlyOwner {
//         for(uint i; i < operatorIds.length; i++) {
//             if(operatorIds[i] == operatorId) {
//                 revert LiquidStakingPool__OperatorIdAlreadyAdded(operatorId, i);
//             }
//         }
//         operatorIds.push(operatorId);
//         emit OperatorAdded(operatorId, operatorIds.length -1);
//     }

//     /**@notice allows owner to remove operators from the operatorIds array 
//      * @param operatorIndex operatorIds array index of the Id to be removed */
//     function removeOperator(uint32 operatorIndex) public onlyOwner {
//         uint32 operatorId = operatorIds[operatorIndex];
//         if(operatorIndex >= operatorIds.length) {
//             revert LiquidStakingPool__InvalidOperatorIndex(operatorIds.length, operatorIndex);
//         }
//         if(operatorIds.length - 1 == operatorIndex) {
//             operatorIds.pop;
//         } else {
//             operatorIds[operatorIndex] = operatorIds[operatorIds.length - 1];
//             operatorIds.pop;
//         }
//         emit OperatorRemoved(operatorId);
//     }

//     /**@notice this function calls SSVNetwork's `updateValidator()`
//      * @dev Updates a validator.
//      * @param publicKey Validator public key.
//      * @param _operatorIds Operator public keys.
//      * @param sharesPublicKeys Shares public keys.
//      * @param sharesEncrypted Encrypted private keys.
//      * @param amount Amount of tokens to deposit.
//      */
//     function updateValidators(bytes calldata publicKey,
//         uint32[] calldata _operatorIds,
//         bytes[] calldata sharesPublicKeys,
//         bytes[] calldata sharesEncrypted,
//         uint256 amount
//     ) external onlyOwner {
//         network.updateValidator(publicKey, _operatorIds, sharesPublicKeys, sharesEncrypted, amount);
//     }


//     /** View / Pure functions */


//     /**@notice returns current address of the deposit contract 
//      */
//     function viewDepositContractAddress() public view returns (address depositContract) {
//         depositContract = address(DepositContract);
//     }
    
//     /**@notice returns the current liquid staking token address
//       */
//     function viewSSVETHAddress() public view returns(address ssvEth) {
//         ssvEth = address(ssvETH);
//     }

//     /**@notice returns the current SSVToken contract address 
//      */
//     function viewSSVTokenAddress() public view returns (address ssvToken) {
//         ssvToken = address(token);
//     }

//     /**@notice returns the current SSVNetwork contract address
//       */
//     function viewSSVNetworkAddress() public view returns(address ssvNetwork) {
//         ssvNetwork = address(network);
//     }

//     /**@notice returns the amount required to activate a validator in wei
//       *@dev this is the uint72 VALIDATOR_AMOUNT variable which was initialized in the constructor 
//       */
//     function viewValidatorAmount() public pure returns(uint72 validatorAmount) {
//         validatorAmount = VALIDATOR_AMOUNT;
//     }

//     /**@notice returns operator ids, check operators here https://explorer.ssv.network/
//      */
//     function viewOperators() public view returns (uint32[] memory operatorArray) {
//         operatorArray = operatorIds;
//     }

//     /**@notice returns the list of validator public keys activated by this contract
//       *@dev returns the Validators array
//      */
//     function viewValidators() public view returns (bytes[] memory validatorArray) {
//         validatorArray = validators;
//     }

//     /**@notice returns user's staked amount
//      */
//     function viewUserStake(address _userAddress) public view returns (uint256 usersStake) {
//         usersStake = userStake[_userAddress];
//     }

// }
