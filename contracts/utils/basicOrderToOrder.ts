import { AdvancedOrder, BasicOrderParameters, Order } from "../types/order";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export const basicOrderToOrder = async (basicOrder: BasicOrderParameters) => {
  let offerItemType = 0;
  if (
    basicOrder.basicOrderType < 4 ||
    (basicOrder.basicOrderType >= 8 && basicOrder.basicOrderType < 12)
  ) {
    offerItemType = 2;
  } else {
    // TODO: add support for when offerItem is ERC1155 or ERC20
  }
  const considerationItemType =
    basicOrder.considerationToken ===
    "0x0000000000000000000000000000000000000000"
      ? 0
      : 1;
  const orderType = basicOrder.basicOrderType % 4;
  const consideration = [];
  consideration.push({
    itemType: considerationItemType,
    token: basicOrder.considerationToken,
    identifierOrCriteria: basicOrder.considerationIdentifier,
    startAmount: basicOrder.considerationAmount,
    endAmount: basicOrder.considerationAmount,
    recipient: basicOrder.offerer,
  });
  const totalAdditionalRecipients = BigNumber.from(
    basicOrder.totalOriginalAdditionalRecipients
  ).toNumber();
  for (let i = 0; i < totalAdditionalRecipients; i++) {
    consideration.push({
      itemType: considerationItemType,
      token: basicOrder.considerationToken,
      identifierOrCriteria: basicOrder.considerationIdentifier,
      startAmount: basicOrder.additionalRecipients[i][0],
      endAmount: basicOrder.additionalRecipients[i][0],
      recipient: basicOrder.additionalRecipients[i][1],
    });
  }
  console.log("consideration: ", consideration);

  return {
    offerer: basicOrder.offerer,
    zone: basicOrder.zone,
    offer: [
      {
        itemType: offerItemType,
        token: basicOrder.offerToken,
        identifierOrCriteria: basicOrder.offerIdentifier,
        startAmount: "1",
        endAmount: "1",
      },
    ],
    consideration: consideration,
    orderType: orderType,
    startTime: basicOrder.startTime,
    endTime: basicOrder.endTime,
    zoneHash: basicOrder.zoneHash,
    salt: basicOrder.salt,
    conduitKey: basicOrder.fulfillerConduitKey,
    totalOriginalConsiderationItems:
      basicOrder.totalOriginalAdditionalRecipients.toNumber() + 1,
  };
};
