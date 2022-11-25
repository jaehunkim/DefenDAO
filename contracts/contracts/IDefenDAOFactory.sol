//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDefenDAOFactory {
/// functions
// - create new DefenDAO unit for specific NFT collection
    function makeCollection(address, uint256, uint256) external;
    function getCollection(address) external returns (address);
    function getAllCollections() external returns (address[] memory);
}
