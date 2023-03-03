//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
* @title SSVNetworkMock
* @author Rohan Nero
* @notice This contract is less than 30Kib */
contract SSVNetworkMock {
    
    function registerValidator(
        bytes calldata _pubkey,
        uint32[] calldata _operatorIds,
        bytes[] calldata _sharesPublicKeys,
        bytes[] calldata _sharesEncrypted,
        uint256 _amount
        ) public {

    }
}