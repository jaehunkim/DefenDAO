//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MockERC721 is ERC1155 {
    constructor() ERC1155("test_uri") {}

    function mint(uint256 tokenId, uint256 amount) public {
        _mint(msg.sender, tokenId, amount, "");
    }
}
