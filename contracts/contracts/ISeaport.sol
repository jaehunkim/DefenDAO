// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BasicOrderParameters, Order} from "./ConsiderationStructs.sol";

/**
 * @title SeaportInterface
 * @author 0age
 * @custom:version 1.1
 * @notice Seaport is a generalized ETH/ERC20/ERC721/ERC1155 marketplace. It
 *         minimizes external calls to the greatest extent possible and provides
 *         lightweight methods for common routes as well as more flexible
 *         methods for composing advanced orders.
 *
 * @dev SeaportInterface contains all external function interfaces for Seaport.
 */
interface ISeaport {

    ///////////////////////////////////////////////////////////////////////////
    // Seaport v1.1
    ///////////////////////////////////////////////////////////////////////////
    /**
     * @notice Fulfill an order offering an ERC721 token by supplying Ether (or
     *         the native token for the given chain) as consideration for the
     *         order. An arbitrary number of "additional recipients" may also be
     *         supplied which will each receive native tokens from the fulfiller
     *         as consideration.
     *
     * @param parameters Additional information on the fulfilled order. Note
     *                   that the offerer must first approve this contract (or
     *                   their preferred conduit if indicated by the order) for
     *                   their offered ERC721 token to be transferred.
     *
     * @return fulfilled A boolean indicating whether the order has been
     *                   successfully fulfilled.
     */
    function fulfillBasicOrder(
        BasicOrderParameters calldata parameters
    ) external payable returns (bool fulfilled);


    ///////////////////////////////////////////////////////////////////////////
    // Seaport v1.0?
    ///////////////////////////////////////////////////////////////////////////
    /**
     * @notice Fulfill an order with an arbitrary number of items for offer and
     *         consideration. Note that this function does not support
     *         criteria-based orders or partial filling of orders (though
     *         filling the remainder of a partially-filled order is supported).
     *
     * @param order               The order to fulfill. Note that both the
     *                            offerer and the fulfiller must first approve
     *                            this contract (or the corresponding conduit if
     *                            indicated) to transfer any relevant tokens on
     *                            their behalf and that contracts must implement
     *                            `onERC1155Received` to receive ERC1155 tokens
     *                            as consideration.
     * @return fulfilled A boolean indicating whether the order has been
     *                   successfully fulfilled.
     */
    function fulfillOrder(Order calldata order)
        external
        payable
        returns (bool fulfilled);
}
