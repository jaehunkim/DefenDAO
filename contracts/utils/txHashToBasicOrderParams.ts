import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import prompts from "prompts";
import InputDataDecoder from "ethereum-input-data-decoder";
import seaportAbi from "../abis/seaport.json";

const opProvider = new ethers.providers.AlchemyProvider(
  "optimism",
  process.env.ALCHEMY_KEY
);

async function main() {
  console.log("Note: Make sure to set ALCHEMY_KEY in .env");
  const response = await prompts({
    type: "text",
    name: "txHash",
    message: `Please enter the tx hash for the *fulfillBasicOrder* function on the Optimism network.`,
  });

  const tx = await opProvider.getTransaction(response.txHash);
  const decoder = new InputDataDecoder(seaportAbi);
  const result = decoder.decodeData(tx.data);
  if (result.method === "fulfillBasicOrder") {
    console.log(result.inputs[0]);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
