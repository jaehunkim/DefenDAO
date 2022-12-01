//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDefenDAOFactory {
    struct RecentSold {
        address token;
        uint256 nftId;
        uint256 price;
        address claimer;
        address defenDAO;
        string tokenName;
        string tokenImage;
    }

    /// functions
    // - create new DefenDAO unit for specific NFT collection
    function makeCollection(
        address,
        address,
        string calldata,
        uint256,
        uint256
    ) external;

    function getCollection(address) external returns (address);

    function getAllCollections() external returns (address[] memory);

    function getAllSlugs() external returns (string[] memory);

    function getRecentSolds() external returns (RecentSold[] memory);

    function recordRecentSold(address, uint256, uint256, address) external;
}
