import { stringifyNestedObject } from "../utils/stringifyNestedObject";
import { txHashToOrderParams } from "../utils/txHashToOrderParams";

async function main() {
  const txHash =
    "0x80154f95f5a1bba3e11df72a072365bb7db7ecbc1b3903e1197b62a301dcd1ce";
  const params = await txHashToOrderParams(txHash);
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
