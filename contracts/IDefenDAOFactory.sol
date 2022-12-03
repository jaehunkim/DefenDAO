//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDefenDAOFactory {
    struct cInfo {
        address token;
        address defenDAO;
        string slug;
        uint256 totalTickets;
        uint256 offerPriceUnit;
    }

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

    function getAllInfos() external returns (cInfo[] memory);

    function getRecentSolds() external returns (RecentSold[] memory);

    function onTicketCountDiff(bool, uint256) external;

    function recordRecentSold(address, uint256, uint256, address) external;
}
