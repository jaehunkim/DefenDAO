import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import InputDataDecoder from "ethereum-input-data-decoder";
import seaportAbi from "../abis/seaport.json";
import { BasicOrderParameters } from "../types/order";

const opProvider = new ethers.providers.AlchemyProvider(
  "optimism",
  process.env.ALCHEMY_API_KEY
);

export const txHashToBasicOrderParams = async (txHash: string) => {
  console.log(`ALCHEMY_API_KEY: ${process.env.ALCHEMY_API_KEY}`);
  const tx = await opProvider.getTransaction(txHash);
  const decoder = new InputDataDecoder(seaportAbi);
  const result = decoder.decodeData(tx.data);
  let inputs;
  if (result.method === "fulfillBasicOrder") {
    console.log(result.inputs[0]);
    inputs = result.inputs[0];
  }
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
  return basicOrderParams;
};
