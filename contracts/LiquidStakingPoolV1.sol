//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IDepositContract.sol";
import "./interfaces/ISSVNetwork.sol";
import "./SSVETH.sol";


error StakingPool__AtleastFourOperators(uint idsLength);
error StakingPool__CantStakeZeroWei();
error StakingPool__EtherCallFailed();

/**
* @title StakingPool
* @author Rohan Nero
* @notice this contract allows multiple users to activate a validator and split the key into SSV keyshares */
contract LiquidStakingPoolV1 is Ownable, ReentrancyGuard {

    IDepositContract private immutable DepositContract;
    SSVETH public ssvETH;
    IERC20 private token;
    ISSVNetwork private network;
    uint256 private constant VALIDATOR_AMOUNT = 32 * 1e18;

    uint32[] private operatorIDs;
    bytes[] private validators;
    mapping(address => uint256) private userStake;

    event UserStaked(address indexed user, uint256 indexed amount);
    event UserUnstaked(address indexed user, uint256 indexed amount);
    event PubKeyDeposited(bytes pubkey);
    event OperatorIDsChanged(uint32[] oldOperators, uint32[] newOperators);
    event KeySharesDeposited(
        bytes pubkey,
        bytes[] sharesPublicKeys,
        uint256 amount
    );

    /**
        * @param depositAddress the beacon chain's deposit contract
        * @param ssvNetwork the ISSVNetwork contract address (interface)
        * @param ssvToken the SSVToken contract address
        * @param ids the SSV operatorIds you've selected */
    constructor(
        address depositAddress,
        address ssvNetwork,
        address ssvToken,
        uint32[] memory ids
    ) {
        DepositContract = IDepositContract(depositAddress);
        SSVETH _ssvETH = new SSVETH();
        ssvETH = SSVETH(address(_ssvETH));
        token = IERC20(ssvToken);
        network = ISSVNetwork(ssvNetwork);
        if(ids.length < 4) {
            revert StakingPool__AtleastFourOperators(ids.length);
        }
        operatorIDs = ids;
    }

    /** @notice called when the contract receives ETH */
    receive() external payable {
        ssvETH.mint(msg.sender, msg.value);
        userStake[msg.sender] += msg.value;
        emit UserStaked(msg.sender, msg.value);
    }    

    /**
     * @notice stake tokens
     */
    function stake() public payable nonReentrant {
        if(msg.value == 0) {
            revert StakingPool__CantStakeZeroWei();
        }
        ssvETH.mint(msg.sender, msg.value);
        userStake[msg.sender] += msg.value;
        emit UserStaked(msg.sender, msg.value);
    }

    /**
     * @notice Unstake tokens
     * @param _amount: Amount to be unstaked
     */
    function unstake(uint256 _amount) public nonReentrant {
        ssvETH.burnFrom(msg.sender, _amount);
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        if(!sent) {
            revert StakingPool__EtherCallFailed();
        }
        userStake[msg.sender] -= _amount;
        emit UserUnstaked(msg.sender, _amount);
    }

    /** 
     * @notice BUG FOUND INSIDE SSV CONTRACTS, I HAVE EMAILED SSVNETWORK ABOUT THIS. AWAITING RESPONSE
     * @dev calls SSVNetwork which calls SSVRegistry to register operator
     * @param name Operator's display name
     * @param operatorAddr Operator's ethereum address that can collect fees
     * @param fee The fee which the operator charges for each block. */
    function registerOperator(string memory name, address operatorAddr, uint fee) public onlyOwner returns(uint operatorId) {

    }

    /**
     * @notice Deposit a validator to the deposit contract
     * @dev these params together are known as the DepositData
     * @param _pubkey: Public key of the validator
     * @param _withdrawal_credentials: Withdrawal public key of the validator
     * @param _signature: BLS12-381 signature of the deposit data
     * @param _deposit_data_root: The SHA-256 hash of the SSZ-encoded DepositData object
     */
    function depositValidator(
        bytes calldata _pubkey,
        bytes calldata _withdrawal_credentials,
        bytes calldata _signature,
        bytes32 _deposit_data_root
    ) external onlyOwner {
        // Deposit the validator to the deposit contract
        DepositContract.deposit{value: VALIDATOR_AMOUNT}(
            _pubkey,
            _withdrawal_credentials,
            _signature,
            _deposit_data_root
        );
        emit PubKeyDeposited(_pubkey);
    }

    /**
     * @notice Deposit shares for a validator
     * @param _pubkey: Public key of the validator
     * @param _operatorIds: IDs of the validator's operators
     * @param _sharesPublicKeys: Public keys of the shares
     * @param _sharesEncrypted: Encrypted shares
     * @param _amount: Amount of tokens to be deposited
     */
    function depositShares(
        bytes calldata _pubkey,
        uint32[] calldata _operatorIds,
        bytes[] calldata _sharesPublicKeys,
        bytes[] calldata _sharesEncrypted,
        uint256 _amount
    ) external onlyOwner {
        // Approve the transfer of tokens to the SSV contract
        token.approve(address(network), _amount);
        // Register the validator and deposit the shares
        network.registerValidator(
            _pubkey,
            _operatorIds,
            _sharesPublicKeys,
            _sharesEncrypted,
            _amount
        );
        validators.push(_pubkey);
        emit KeySharesDeposited(_pubkey, _sharesPublicKeys, _amount);
    }

    /**
     * @dev Update operators
     * @param _newOperators: Array of the the new operators Ids
     */
    function updateOperators(uint32[] memory _newOperators) public onlyOwner {
        if(_newOperators.length < 4) {
            revert StakingPool__AtleastFourOperators(_newOperators.length);
        }
        uint32[] memory oldIds = operatorIDs;
        operatorIDs = _newOperators;
        emit OperatorIDsChanged(oldIds, _newOperators);
    }

    function updateValidators(bytes calldata _pubkey,
        uint32[] calldata _operatorIds,
        bytes[] calldata _sharesPublicKeys,
        bytes[] calldata _sharesEncrypted,
        uint256 _amount
    ) external onlyOwner {
        network.updateValidator(_pubkey, _operatorIds, _sharesPublicKeys, _sharesEncrypted, _amount);
    }

    /**
     * @notice returns operator ids, check operators here https://explorer.ssv.network/
     */
    function viewOperators() public view returns (uint32[] memory) {
        return operatorIDs;
    }

    /**
     * @notice returns the Validators array
     */
    function viewValidators() public view returns (bytes[] memory) {
        return validators;
    }
    
    /**
     * @notice returns user's staked amount
     */
    function viewUserStake(address _userAddress) public view returns (uint256) {
        return userStake[_userAddress];
    }


    

    
}
