import { stringifyNestedObject } from "../utils/stringifyNestedObject";
import { txHashToBasicOrderParams } from "../utils/txHashToBasicOrderParams";

async function main() {
  const txHash =
    "0x953ad455d5a13ee8d7c6e67626fafd77dacb1cddc7320df3332e4e8e7c7db825";
  const params = await txHashToBasicOrderParams(txHash);
  if (!params) {
    throw Error(`Failed to decode tx data`);
  }
  const stringified = stringifyNestedObject(params);
  console.log("\n\n");
  console.log(stringified);
  console.log(JSON.parse(stringified));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
