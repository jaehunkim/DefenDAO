/// ////////////////////////////////////////////////////////////////////////
// Seaport v1.1
/// ////////////////////////////////////////////////////////////////////////
export type AdditionalRecipient = {
  amount: string;
  recipient: string;
};

export type BasicOrderParameters = {
  considerationToken: string;
  considerationIdentifier: string;
  considerationAmount: string;
  offerer: string;
  zone: string;
  offerToken: string;
  offerIdentifier: string;
  offerAmount: string;
  basicOrderType: number;
  startTime: string;
  endTime: string;
  zoneHash: string;
  salt: string;
  offererConduitKey: string;
  fulfillerConduitKey: string;
  totalOriginalAdditionalRecipients: number;
  additionalRecipients: AdditionalRecipient[];
  signature: string;
};

/// ////////////////////////////////////////////////////////////////////////
// Seaport v1.0?
/// ////////////////////////////////////////////////////////////////////////

enum ItemType {
  // 0: ETH on mainnet, MATIC on polygon, etc.
  NATIVE,
  // 1: ERC20 items (ERC777 and ERC20 analogues could also technically work)
  ERC20,
  // 2: ERC721 items
  ERC721,
  // 3: ERC1155 items
  ERC1155,
  // 4: ERC721 items where a number of tokenIds are supported
  ERC721_WITH_CRITERIA,
  // 5: ERC1155 items where a number of ids are supported
  ERC1155_WITH_CRITERIA,
}

/**
 * @dev An offer item has five components: an item type (ETH or other native
 *      tokens, ERC20, ERC721, and ERC1155, as well as criteria-based ERC721 and
 *      ERC1155), a token address, a dual-purpose "identifierOrCriteria"
 *      component that will either represent a tokenId or a merkle root
 *      depending on the item type, and a start and end amount that support
 *      increasing or decreasing amounts over the duration of the respective
 *      order.
 */
type OfferItem = {
  itemType: ItemType;
  token: string;
  identifierOrCriteria: string;
  startAmount: string;
  endAmount: string;
};

/**
 * @dev A consideration item has the same five components as an offer item and
 *      an additional sixth component designating the required recipient of the
 *      item.
 */
type ConsiderationItem = {
  itemType: ItemType;
  token: string;
  identifierOrCriteria: string;
  startAmount: string;
  endAmount: string;
  recipient: string;
};

enum OrderType {
  // 0: no partial fills, anyone can execute
  FULL_OPEN,
  // 1: partial fills supported, anyone can execute
  PARTIAL_OPEN,
  // 2: no partial fills, only offerer or zone can execute
  FULL_RESTRICTED,
  // 3: partial fills supported, only offerer or zone can execute
  PARTIAL_RESTRICTED,
}

type OrderParameters = {
  offerer: string; // 0x00
  zone: string; // 0x20
  offer: OfferItem[]; // 0x40
  consideration: ConsiderationItem[]; // 0x60
  orderType: OrderType; // 0x80
  startTime: string; // 0xa0
  endTime: string; // 0xc0
  zoneHash: string; // 0xe0
  salt: string; // 0x100
  conduitKey: string; // 0x120
  totalOriginalConsiderationItems: number; // 0x140
  // offer.length                          // 0x160
};

export type Order = {
  parameters: OrderParameters;
  signature: string;
};
