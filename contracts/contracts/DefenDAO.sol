//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "./IDefenDAO.sol";
import "./IDefenDAOFactory.sol";
import {ISeaport} from "./ISeaport.sol";
import {Order, AdvancedOrder, CriteriaResolver, ItemType} from "./ConsiderationStructs.sol";

contract DefenDAO is
    Ownable,
    IDefenDAO,
    IERC721Receiver,
    IERC1155Receiver,
    ERC165
{
    address public nftAddress;
    address public marketplaceAddress;
    uint256 public curFloorPrice;
    uint256 public offerPriceUnit;
    uint256 public reserve;
    address public defenDAOFactory;
    uint8 public constant EXECUTE_BALANCE_THRESHOLD = 10;
    mapping(uint256 => mapping(address => uint256)) public userOfferBalances;
    mapping(uint256 => uint256) public offerBalanceSum;
    mapping(uint256 => address[]) public offerBalanceAddrOrders;
    mapping(address => uint256[]) public userClaimableNFTs;
    mapping(uint256 => address) public claimableNFTs;

    function initialize(
        address nftAddress_,
        address marketplaceAddress_,
        uint256 curFloorPrice_,
        uint256 offerPriceUnit_
    ) external override onlyOwner {
        defenDAOFactory = msg.sender;
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

        console.log("makeOffer:price \t\t", price);
        console.log("makeOffer:offerCount \t\t", offerCount);
        console.log("makeOffer:offerPriceUnit \t", offerPriceUnit);
        console.log("makeOffer:totalOfferAmount \t", totalOfferAmount);
        console.log("makeOffer:offerCount * price \t", offerCount * price);

        require(
            totalOfferAmount >= (offerCount * price) / 10,
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
        IDefenDAOFactory(defenDAOFactory).onTicketCountDiff(true, offerCount);
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
            value: (price * offerCount) / 10
        }("");
        require(sent, "Failed to send Ether");
        reserve = getBalance();
        IDefenDAOFactory(defenDAOFactory).onTicketCountDiff(false, offerCount);
    }

    function getClaimableNFTs(
        address addr
    ) external view override returns (uint256[] memory) {
        return userClaimableNFTs[addr];
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
            for (uint256 j = 0; j < userClaimableNFTs[msg.sender].length; j++) {
                if (userClaimableNFTs[msg.sender][j] == tokenIds[i]) {
                    delete userClaimableNFTs[msg.sender][j];
                    break;
                }
            }
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
                // TODO: emit an event
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

    // TODO: Add the following:
    /* Seaport v1.1 - fulfillBasicOrder */
    // BasicOrderParameters calldata order
    /* Seaport v1.0  - fulfillOrder */
    // Order calldata order
    function execute(
        uint256 price,
        /* Seaport v1.1 - fulfillAdvancedOrder */
        AdvancedOrder calldata order,
        CriteriaResolver[] calldata criteriaResolvers,
        bytes32 fulfillerConduitKey
    ) external override {
        require(order.parameters.offer[0].token == nftAddress, "invalid nft");
        require(curFloorPrice <= price * offerPriceUnit, "invalid price");
        uint256 orderPrice;
        for (uint256 i = 0; i < order.parameters.consideration.length; i++) {
            require(
                order.parameters.consideration[i].itemType == ItemType.NATIVE,
                "consideration token must be ETH"
            );
            orderPrice += order.parameters.consideration[i].endAmount;
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
            console.log("address %s: %s", i, addresses[i]);
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
        console.log("selected 10 addresses:");
        for (uint256 i = 0; i < selectedAddresses.length; i++) {
            console.log(
                "address %s (%s)",
                selectedAddresses[i],
                selectedTimes[i]
            );
        }
        burnBalances(price, selectedAddresses, selectedTimes);
        (address[] memory winner, ) = selectRandomAddresses(
            selectedAddresses,
            selectedTimes,
            EXECUTE_BALANCE_THRESHOLD,
            1
        );
        console.log("selected winner: %s", winner[0]);
        /* Seaport v1.1 - fulfillBasicOrder */
        // bool fulfilled = ISeaport(marketplaceAddress).fulfillBasicOrder{
        //     value: orderPrice
        // }(order);
        // require(fulfilled, "nft purchase failed");
        // claimableNFTs[order.considerationIdentifier] = winner[0];

        /* Seaport v1.1 - fulfillAdvancedOrder */
        bool fulfilled = ISeaport(marketplaceAddress).fulfillAdvancedOrder{
            value: price
        }(order, criteriaResolvers, fulfillerConduitKey, address(this));
        require(fulfilled, "nft purchase failed");
        claimableNFTs[order.parameters.offer[0].identifierOrCriteria] = winner[
            0
        ];
        userClaimableNFTs[winner[0]].push(
            order.parameters.offer[0].identifierOrCriteria
        );

        /* Seaport v1.0 */
        // bool fulfilled = ISeaport(marketplaceAddress).fulfillOrder{
        //     value: price // orderPrice
        // }(order);
        // require(fulfilled, "nft purchase failed");
        // claimableNFTs[order.parameters.offer[0].identifierOrCriteria] = winner[0];
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

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC721Receiver).interfaceId ||
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
