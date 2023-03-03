//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
* @title SSVETH
* @author Rohan Nero
* @notice this is the liquid staking pool token issued when you stake with DVTLiquidStakingPool
 */
contract SSVETH is ERC20Burnable, Ownable {

    address private immutable stakingPool;
    
    constructor() ERC20("SecretSharedValidatorEthereum", "SSVETH"){
        stakingPool = msg.sender;
    }

    function mint(address to, uint amount) public onlyOwner {
        _mint(to, amount);
    }

    /** @notice this returns the address  */
    function viewStakingPoolAddress() public view returns(address) {
        return stakingPool;
    }



}