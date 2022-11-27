import { AdditionalRecipient, BasicOrderParameters } from "../types/order";
import { stringifyNestedObject } from "./stringifyNestedObject";

export const orderToBasicOrderParams = (order: any) => {
  const {
    token: considerationToken,
    identifierOrCriteria: considerationIdentifier,
    startAmount: considerationAmount,
  } = order.protocol_data.parameters.consideration[0];
  const {
    offerer,
    zone,
    zoneHash,
    orderType: basicOrderType,
    startTime,
    endTime,
    salt,
    conduitKey: offererConduitKey,
  } = order.protocol_data.parameters;
  const {
    token: offerToken,
    identifierOrCriteria: offerIdentifier,
    startAmount: offerAmount,
  } = order.protocol_data.parameters.offer[0];
  const fulfillerConduitKey = offererConduitKey;
  const totalOriginalAdditionalRecipients = 1;
  const additionalRecipients = [];
  for (
    let i = 1;
    i < order.protocol_data.parameters.consideration.length;
    i++
  ) {
    additionalRecipients.push({
      amount: order.protocol_data.parameters.consideration[i].startAmount,
      recipient: order.protocol_data.parameters.consideration[i].recipient,
    });
  }
  const signature = order.protocol_data.signature;

  const basicOrderParams: BasicOrderParameters = {
    considerationToken,
    considerationIdentifier,
    considerationAmount,
    offerer,
    zone,
    offerToken,
    offerIdentifier,
    offerAmount,
    basicOrderType,
    startTime,
    endTime,
    zoneHash,
    salt,
    offererConduitKey,
    fulfillerConduitKey,
    totalOriginalAdditionalRecipients,
    additionalRecipients,
    signature,
  };

  console.log(
    "raw basicOrderParams:",
    JSON.stringify(basicOrderParams, null, 2)
  );

  console.log(
    "basicOrderParams to etherscan tuple:",
    stringifyNestedObject(basicOrderParams)
  );

  return basicOrderParams;
};
