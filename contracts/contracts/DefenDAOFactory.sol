//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {IDefenDAOFactory} from "./IDefenDAOFactory.sol";
import {IDefenDAO} from "./IDefenDAO.sol";
import {DefenDAO} from "./DefenDAO.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DefenDAOFactory is IDefenDAOFactory, Ownable {
    mapping(address => address) public getCollections;
    address[] public collections;

    event CollectionCreated(address indexed token, address collection);

    constructor() Ownable() {}

    function makeCollection(address token_) public override onlyOwner {
        require(token_ != address(0), "token cannot be zero address");
        // TODO : check erc721
        require(getCollections[token_] == address(0), "collection exists");
        bytes memory bytecode = type(DefenDAO).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token_));
        address col;
        assembly {
            col := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        // IDefenDAO(col).initialize(token_);
        getCollections[token_] = col;
        collections.push(col);
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
}
