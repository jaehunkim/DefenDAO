//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IDefenDAO.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract DefenDAO is Ownable, IDefenDAO {
    address public nftAddress;
    uint256 public curFloorPrice;
    uint256 public offerPriceUnit;
    uint256 public reserve;
    mapping(uint256 => mapping(address => uint256)) public userOfferBalances;
    mapping(uint256 => uint256) public offerBalanceSum;
    mapping(uint256 => address[]) public offerBalanceAddrOrders;
    mapping(uint256 => address) public claimableNFTs;

    function initialize(
        address nftAddress_,
        uint256 curFloorPrice_,
        uint256 offerPriceUnit_
    ) public onlyOwner {
        nftAddress = nftAddress_;
        curFloorPrice = curFloorPrice_;
        offerPriceUnit = offerPriceUnit_;
        // TODO: Should we enforce a ratio between curFloorPrice and offerPriceUnit?
    }

    // TODO: need to handle transferring eth and making an offer atomically
    function makeOffer(uint256 price, uint256 offerCount) external override {
        uint256 contractEtherBalance = getBalance();
        uint256 totalOfferAmount = getBalance() - reserve;
        require(
            totalOfferAmount == offerCount * offerPriceUnit,
            "incorrect offer count"
        );
        userOfferBalances[price][msg.sender] += offerCount;
        offerBalanceSum[price] += offerCount;
        reserve = contractEtherBalance;

        // TODO: Test that existing addresses are not added multiple times
        address[] memory addresses = offerBalanceAddrOrders[price];
        if (addresses.length == 0) {
            offerBalanceAddrOrders[price].push(msg.sender);
        } else {
            bool found;
            for (uint256 i = 0; i < addresses.length; i++) {
                if (addresses[i] == msg.sender) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                offerBalanceAddrOrders[price].push(msg.sender);
            }
        }
        emit MadeOffer(msg.sender, price, offerCount);
    }

    function cancelOffer(uint256 price, uint256 offerCount) external override {
        address user = msg.sender;
        require(
            userOfferBalances[price][user] >= offerCount,
            "user does not have enough offer count"
        );
        userOfferBalances[price][user] -= offerCount;
        offerBalanceSum[price] -= offerCount;
        emit CancelledOffer(user, price, offerCount);
        (bool sent, bytes memory data) = user.call{
            value: offerPriceUnit * offerCount
        }("");
        require(sent, "Failed to send Ether");
    }

    function claimNFTs(uint256[] memory tokenIds) external override {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                claimableNFTs[tokenIds[i]] == msg.sender,
                "no authority to claim given token"
            );
            require(
                IERC721(nftAddress).ownerOf(tokenIds[i]) == address(this),
                "given token is not owned by this contract"
            );
            IERC721(nftAddress).safeTransferFrom(
                address(this),
                msg.sender,
                tokenIds[i],
                ""
            );
            delete claimableNFTs[tokenIds[i]];
        }
    }

    function execute() external override {
        // TODO
    }

    // 자신의 collection별 buy offer
    function getUserOffers(
        address user,
        uint256 price
    ) external view override returns (uint256) {
        return userOfferBalances[price][user];
    }

    // collection별 전체 buy offer 데이터
    function getAllOffers(
        uint256 price
    ) external view override returns (uint256) {
        return offerBalanceSum[price];
    }

    function getOfferBalanceAddrOrdersLength(
        uint256 price
    ) public view override returns (uint256) {
        return offerBalanceAddrOrders[price].length;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view override returns (uint256) {
        return address(this).balance;
    }
}
