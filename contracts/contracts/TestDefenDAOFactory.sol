//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {TestIDefenDAO} from "./TestIDefenDAO.sol";
import {TestDefenDAO} from "./TestDefenDAO.sol";
import {DefenDAOFactory} from "./DefenDAOFactory.sol";

contract TestDefenDAOFactory is DefenDAOFactory {
    function makeCollection(
        address token_,
        address marketplaceAddress_,
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
        TestIDefenDAO(col).initialize(token_, marketplaceAddress_, curFloorPrice_, offerPriceUnit_);
        getCollections[token_] = col;
        collections.push(col);
        emit CollectionCreated(token_, col);
    }
}
