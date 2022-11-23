//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./DefenDAO.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TestDefenDAO is DefenDAO {
    function mockExecute(
        uint256 price,
        uint256 nftId,
        address claimer,
        uint256 luckyIndex
    ) external {
        address payable seller = payable(msg.sender);
        require(offerBalanceSum[price] >= price / offerPriceUnit);
        require(getBalance() >= price);
        require(luckyIndex < offerBalanceSum[price]);
        claimableNFTs[nftId] = claimer;
        offerBalanceSum[price] -= price / offerPriceUnit;
        address luckyAddress;
        uint256 addrIndex;
        uint256 counter;
        uint256 indexInLuckyAddress;
        // TODO: revisit
        while (true) {
            address addr = offerBalanceAddrOrders[price][addrIndex];
            uint256 userOfferCount = userOfferBalances[price][addr];
            if (counter + userOfferCount - 1 < luckyIndex) {
                addrIndex += 1;
                counter += userOfferCount;
                continue;
            } else {
                luckyAddress = addr;
                indexInLuckyAddress = luckyIndex - counter + 1;
                break;
            }
        }
        // TODO: implement removing userOfferBalances
        (bool sent, bytes memory data) = seller.call{value: price}("");
        require(sent, "Failed to send Ether");
        IERC721(nftAddress).transferFrom(msg.sender, address(this), nftId);
    }
}
