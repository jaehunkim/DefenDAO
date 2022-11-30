//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import {IDefenDAOFactory} from "./IDefenDAOFactory.sol";
import {IDefenDAO} from "./IDefenDAO.sol";
import {DefenDAO} from "./DefenDAO.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DefenDAOFactory is IDefenDAOFactory, Ownable {
    mapping(uint256 => RecentSold) public recentSolds;
    uint256 public rsBeginIdx;
    uint256 public rsEndIdx;

    mapping(address => address) public getCollections;
    mapping(address => uint256) public getCollectionIndex;
    mapping(address => address) public collectionToToken;
    address[] public collections;
    string[] public slugs;

    event CollectionCreated(address indexed token, address collection);

    constructor() Ownable() {
        rsBeginIdx = 0;
        rsEndIdx = 0;
    }

    function makeCollection(
        address token_,
        address marketplaceAddress_,
        string calldata slug_,
        uint256 curFloorPrice_,
        uint256 offerPriceUnit_
    ) public virtual override onlyOwner {
        require(token_ != address(0), "token cannot be zero address");
        // TODO : check erc721
        require(getCollections[token_] == address(0), "collection exists");
        bytes memory bytecode = type(DefenDAO).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token_));
        address col;
        assembly {
            col := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IDefenDAO(col).initialize(
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
        emit CollectionCreated(token_, col);
    }

    function getCollection(
        address token_
    ) external view override returns (address) {
        require(getCollections[token_] != address(0), "collection not exists");
        return getCollections[token_];
    }

    function getAllCollections()
        external
        view
        override
        returns (address[] memory)
    {
        return collections;
    }

    function getAllSlugs() external view override returns (string[] memory) {
        return slugs;
    }

    function getRecentSolds()
        external
        view
        override
        returns (RecentSold[] memory)
    {
        uint256 len = rsEndIdx - rsBeginIdx;
        RecentSold[] memory rss = new RecentSold[](len);
        for (uint256 i = rsBeginIdx; i < rsEndIdx; i++) {
            rss[len - 1 - (i - rsBeginIdx)] = recentSolds[i];
        }
        return rss;
    }

    function recordRecentSold(
        address token_,
        uint256 nftId_,
        uint256 price_,
        address claimer_
    ) external override {
        require(collectionToToken[msg.sender] == token_, "Invalid call");
        recentSolds[rsEndIdx] = RecentSold(token_, nftId_, price_, claimer_, msg.sender);
        rsEndIdx++;

        if (rsEndIdx - rsBeginIdx > 10) {
            delete recentSolds[rsBeginIdx];
            rsBeginIdx++;
        }
    }
}
