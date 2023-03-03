//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
* @title SSVETH
* @author Rohan Nero
* @notice this is the liquid staking pool token issued when you stake with DVTLiquidStakingPool
 */
contract SSVETH is ERC20Burnable {
    
    constructor() ERC20("SecretSharedValidatorEthereum", "SSVETH"){
    }

    function mint(address to, uint amount) public {
        _mint(to, amount);
    }

}