import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import InputDataDecoder from "ethereum-input-data-decoder";
import seaportAbi from "../abis/seaport.json";

const opProvider = new ethers.providers.AlchemyProvider(
  "optimism",
  process.env.ALCHEMY_KEY
);

export const txHashToBasicOrderParams = async (txHash: string) => {
  console.log(`ALCHEMY_KEY: ${process.env.ALCHEMY_KEY}`);
  const tx = await opProvider.getTransaction(txHash);
  const decoder = new InputDataDecoder(seaportAbi);
  const result = decoder.decodeData(tx.data);
  let inputs;
  if (result.method === "fulfillBasicOrder") {
    console.log(result.inputs[0]);
    inputs = result.inputs[0];
  }
  return inputs;
};
