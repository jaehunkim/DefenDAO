//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {BasicOrderParameters, Order, AdvancedOrder, CriteriaResolver} from "./ConsiderationStructs.sol";

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

    function initialize(
        address nftAddress_,
        address marketplaceAddress_,
        uint256 curFloorPrice_,
        uint256 offerPriceUnit_
    ) external;

    function makeOffer(uint256 price, uint256 offerCount) external;

    function cancelOffer(uint256 price, uint256 offerCount) external;

    function claimNFTs(uint256[] memory tokenIds) external;

    function execute(
        uint256 price,
        AdvancedOrder calldata advancedOrder,
        CriteriaResolver[] calldata criteriaResolvers,
        bytes32 fulfillerConduitKey,
        address recipient
        // BasicOrderParameters calldata order // Seaport v1.1
        // Order calldata order // Seaport v1.0 ?
    ) external;

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
