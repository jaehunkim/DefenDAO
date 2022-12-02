//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {TestIDefenDAO} from "./TestIDefenDAO.sol";
import {TestDefenDAO} from "./TestDefenDAO.sol";
import {DefenDAOFactory} from "./DefenDAOFactory.sol";

contract TestDefenDAOFactory is DefenDAOFactory {
    function makeCollection(
        address token_,
        address marketplaceAddress_,
        string calldata slug_,
        uint256 curFloorPrice_,
        uint256 offerPriceUnit_
    ) public override onlyOwner {
        require(token_ != address(0), "token cannot be zero address");
        // TODO : check erc721
        require(getCollections[token_] == address(0), "collection exists");
        bytes memory bytecode = type(TestDefenDAO).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token_));
        address col;
        assembly {
            col := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        TestIDefenDAO(col).initialize(
            token_,
            marketplaceAddress_,
            curFloorPrice_,
            offerPriceUnit_
        );
        getCollections[token_] = col;
        getCollectionIndex[token_] = collections.length;
        collectionToToken[col] = token_;
        collections.push(col);
        slugs.push(slug_);
        infos.push(cInfo(token_, col, slug_, 0, offerPriceUnit_));
        emit CollectionCreated(token_, col);
    }

    function mockRecordRecentSold(
        address token_,
        uint256 nftId_,
        uint256 price_,
        address claimer_,
        string calldata tokenName_,
        string calldata image_
    ) public onlyOwner {
        recentSolds[rsEndIdx] = RecentSold(token_, nftId_, price_, claimer_, getCollections[token_], tokenName_, image_);
        rsEndIdx++;

        if (rsEndIdx - rsBeginIdx > 10) {
            delete recentSolds[rsBeginIdx];
            rsBeginIdx++;
        }
    }
}
