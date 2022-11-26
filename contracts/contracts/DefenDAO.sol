//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IDefenDAO.sol";
import {ISeaport} from "./ISeaport.sol";

contract DefenDAO is Ownable, IDefenDAO {
    address public nftAddress;
    address public marketplaceAddress;
    uint256 public curFloorPrice;
    uint256 public offerPriceUnit;
    uint256 public reserve;
    uint8 public constant EXECUTE_BALANCE_THRESHOLD = 10;
    mapping(uint256 => mapping(address => uint256)) public userOfferBalances;
    mapping(uint256 => uint256) public offerBalanceSum;
    mapping(uint256 => address[]) public offerBalanceAddrOrders;
    mapping(uint256 => address) public claimableNFTs;

    function initialize(
        address nftAddress_,
        address marketplaceAddress_,
        uint256 curFloorPrice_,
        uint256 offerPriceUnit_
    ) external override onlyOwner {
        nftAddress = nftAddress_;
        marketplaceAddress = marketplaceAddress_;
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
        reserve = getBalance();
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

    function burnBalances(
        uint256 price,
        address[] memory users,
        uint256[] memory balancesToBurn
    ) internal {
        mapping(address => uint256) storage balancesRef = userOfferBalances[
            price
        ];
        uint256 burnTotal = 0;
        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            if (user == address(0x0)) continue;
            balancesRef[user] -= balancesToBurn[i];
            burnTotal += balancesToBurn[i];
            if (balancesRef[user] == 0) {
                delete balancesRef[user];
            }
        }
        offerBalanceSum[price] -= burnTotal;
    }

    // TODO: improve security (e.g. using a vrf solution)
    function random(uint256 nonInclusiveMax) public view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            ) % nonInclusiveMax;
    }

    function isTargetAddressInArray(
        address[] memory addresses,
        address target
    ) internal pure returns (uint256) {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (addresses[i] == target) return i + 1;
        }
        return 0;
    }

    function selectRandomAddresses(
        address[] memory addresses,
        uint256[] memory weights,
        uint256 weightSum,
        uint256 numToSelect
    ) public view returns (address[] memory, uint256[] memory) {
        address[] memory selectedAddresses = new address[](numToSelect);
        uint256[] memory selectedTimes = new uint256[](numToSelect);
        uint256 curIndex = 1; // to distinguish b/w empty and 0 index
        for (uint256 i = 0; i < numToSelect; i++) {
            uint256 randomNum = random(weightSum);
            uint256 pointer = 0;
            address selected;
            // TODO: use binary search
            for (uint256 j = 0; j < addresses.length; j++) {
                address addr = addresses[j];
                uint256 weight = weights[j];
                if (weight == 0) continue;
                if (pointer <= randomNum && randomNum < pointer + weight) {
                    selected = addr;
                    weights[j] -= 1;
                    break;
                }
                pointer += weight;
            }
            weightSum -= 1;
            uint256 index = isTargetAddressInArray(selectedAddresses, selected);
            if (index > 0) {
                selectedTimes[index - 1] += 1;
            } else {
                selectedAddresses[curIndex - 1] = selected;
                selectedTimes[curIndex - 1] += 1;
                curIndex++;
            }
        }
        return (selectedAddresses, selectedTimes);
    }

    function execute(
        uint256 price,
        BasicOrderParameters calldata order
    ) external override {
        require(
            order.considerationToken == address(0x0),
            "considerationToken must be ETH"
        );
        require(curFloorPrice <= price * offerPriceUnit, "invalid price");
        uint256 orderPrice = order.considerationAmount;
        for (uint256 i = 0; i < order.additionalRecipients.length; i++) {
            orderPrice += order.additionalRecipients[0].amount;
        }
        require(orderPrice <= price, "nft too expensive");
        require(
            offerBalanceSum[price] >= EXECUTE_BALANCE_THRESHOLD,
            "not enough balance at the price"
        );
        mapping(address => uint256) storage balancesRef = userOfferBalances[
            price
        ];
        address[] memory addresses = offerBalanceAddrOrders[price];
        uint256[] memory balances = new uint256[](addresses.length);
        for (uint256 i = 0; i < addresses.length; i++) {
            balances[i] = balancesRef[addresses[i]];
        }
        (
            address[] memory selectedAddresses,
            uint256[] memory selectedTimes
        ) = selectRandomAddresses(
                addresses,
                balances,
                offerBalanceSum[price],
                EXECUTE_BALANCE_THRESHOLD
            );
        burnBalances(price, selectedAddresses, selectedTimes);
        (address[] memory winner, ) = selectRandomAddresses(
            selectedAddresses,
            selectedTimes,
            price,
            1
        );
        bool fulfilled = ISeaport(marketplaceAddress).fulfillBasicOrder{
            value: orderPrice
        }(order);
        require(fulfilled, "nft purchase failed");
        claimableNFTs[order.considerationIdentifier] = winner[0];
        // TODO: reward msg.sender
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
