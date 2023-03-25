// //SPDX-License-Identifier: MIT

// pragma solidity ^0.8.0;

// import './StakingPoolV2.sol';
// import './LiquidStakingPoolV2.sol';

// /**
// * @title StakingFactoryV1
// * @author Rohan Nero
// * @notice this contract is used to deploy either StakingFactoryV1 or LiquidStakingPoolV1 */
// contract StakingFactoryV2 {

//     /**@notice creates contract addresses and operatorIds 
//      * @param depositAddress the beacon chain's deposit contract
//      * @param ssvNetwork the ISSVNetwork contract address (interface)
//      * @param ssvToken the SSVToken contract address
//      * @param _operatorIds the SSV operatorIds you've selected */
//     function createStakingPool(address depositAddress, address ssvNetwork, address ssvToken, uint32[] memory _operatorIds ) public returns(address stakingPool) {
//         stakingPool = address(new StakingPoolV2(depositAddress, ssvNetwork, ssvToken, _operatorIds));
//     }

//     /**@notice creates contract addresses and operatorIds 
//      * @param depositAddress the beacon chain's deposit contract
//      * @param ssvNetwork the ISSVNetwork contract address (interface)
//      * @param ssvToken the SSVToken contract address
//      * @param _operatorIds the SSV operatorIds you've selected */
//     function createLiquidStakingPool(address depositAddress, address ssvNetwork, address ssvToken, uint32[] memory _operatorIds ) public returns(address liquidStakingPool) {
//         liquidStakingPool = address(new LiquidStakingPoolV2(depositAddress, ssvNetwork, ssvToken, _operatorIds));
//     }


// }