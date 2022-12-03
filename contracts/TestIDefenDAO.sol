//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface TestIDefenDAO {
    function initialize(
        address nftAddress_,
        address marketplaceAddress_,
        uint256 curFloorPrice_,
        uint256 offerPriceUnit_
    ) external;

    function mockRecordRecentSold(address, uint256, uint256, address) external;
}
