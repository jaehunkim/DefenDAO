//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IDefenDAO {
    event MadeOffer(
        address indexed user,
        uint256 indexed price,
        uint256 offerCount
    );
    event CancelledOffer(
        address indexed user,
        uint256 indexed price,
        uint256 offerCount
    );

    function makeOffer(uint256 price, uint256 offerCount) external;

    function cancelOffer(uint256 price, uint256 offerCount) external;

    function claimNFTs(uint256[] memory tokenIds) external;

    function execute() external;

    function getOfferBalanceAddrOrdersLength(
        uint256 price
    ) external view returns (uint256);

    function getUserOffers(
        address user,
        uint256 price
    ) external view returns (uint256);

    function getAllOffers(uint256 price) external view returns (uint256);

    function getBalance() external view returns (uint256);
}
