import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import InputDataDecoder from "ethereum-input-data-decoder";
import seaportAbi10 from "../abis/seaport10.json";
import seaportAbi11 from "../abis/seaport11.json";
import { AdvancedOrder, BasicOrderParameters, Order } from "../types/order";
import { basicOrderToOrder } from "./basicOrderToOrder";

const opProvider = new ethers.providers.AlchemyProvider(
  "optimism",
  process.env.ALCHEMY_API_KEY
);

export const txHashToOrderParams = async (txHash: string) => {
  console.log(`ALCHEMY_API_KEY: ${process.env.ALCHEMY_API_KEY}`);
  const tx = await opProvider.getTransaction(txHash);
  console.log("tx:", tx);
  // const decoder = new InputDataDecoder(seaportAbi10);
  const decoder = new InputDataDecoder(seaportAbi11);
  const result = decoder.decodeData(tx.data);
  console.log("result:", result);
  if (result.method === "fulfillBasicOrder") {
    const inputs = result.inputs[0];
    const basicOrderParams: BasicOrderParameters = {
      considerationToken: inputs[0],
      considerationIdentifier: inputs[1],
      considerationAmount: inputs[2],
      offerer: inputs[3],
      zone: inputs[4],
      offerToken: inputs[5],
      offerIdentifier: inputs[6],
      offerAmount: inputs[7],
      basicOrderType: inputs[8],
      startTime: inputs[9],
      endTime: inputs[10],
      zoneHash: inputs[11],
      salt: inputs[12],
      offererConduitKey: inputs[13],
      fulfillerConduitKey: inputs[14],
      totalOriginalAdditionalRecipients: inputs[15],
      additionalRecipients: inputs[16],
      signature: inputs[17],
    };
    console.log(JSON.stringify(basicOrderParams, null, 2));
    const order = await basicOrderToOrder(basicOrderParams);
    console.log("order: ", order);
    return { order: basicOrderParams };
  } else if (result.method === "fulfillOrder") {
    const inputs = result.inputs[0];
    const order: Order = {
      parameters: {
        offerer: inputs[0][0],
        zone: inputs[0][1],
        offer: inputs[0][2],
        consideration: inputs[0][3],
        orderType: inputs[0][4],
        startTime: inputs[0][5],
        endTime: inputs[0][6],
        zoneHash: inputs[0][7],
        salt: inputs[0][8],
        conduitKey: inputs[0][9],
        totalOriginalConsiderationItems: inputs[0][10],
      },
      signature: inputs[1],
    };
    console.log(JSON.stringify(order, null, 2));
    return { order };
  } else if (result.method === "fulfillAdvancedOrder") {
    const orderInputs = result.inputs[0];
    const order: AdvancedOrder = {
      parameters: {
        offerer: orderInputs[0][0],
        zone: orderInputs[0][1],
        offer: orderInputs[0][2],
        consideration: orderInputs[0][3],
        orderType: orderInputs[0][4],
        startTime: orderInputs[0][5],
        endTime: orderInputs[0][6],
        zoneHash: orderInputs[0][7],
        salt: orderInputs[0][8],
        conduitKey: orderInputs[0][9],
        totalOriginalConsiderationItems: orderInputs[0][10],
      },
      numerator: orderInputs[1],
      denominator: orderInputs[2],
      signature: orderInputs[3],
      extraData: orderInputs[4],
    };
    const criteriaResolver = [];
    for (let i = 0; i < result.inputs[1].length; i++) {
      criteriaResolver.push({
        orderIndex: result.inputs[1][i][0],
        side: result.inputs[1][i][1],
        index: result.inputs[1][i][2],
        identifier: result.inputs[1][i][3],
        criteriaProof: result.inputs[1][i][4],
      });
    }
    const fulfillerConduitKey = result.inputs[2];
    const recipient = result.inputs[3];
    console.log("order:", JSON.stringify(order, null, 2));
    console.log("criteriaResolver:", JSON.stringify(criteriaResolver, null, 2));
    console.log("fulfillerConduitKey:", fulfillerConduitKey);
    console.log("recipient:", recipient);
    return { order, criteriaResolver, fulfillerConduitKey, recipient };
  }
};
