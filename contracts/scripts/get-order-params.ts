import { stringifyNestedObject } from "../utils/stringifyNestedObject";
import { txHashToBasicOrderParams } from "../utils/txHashToBasicOrderParams";

async function main() {
  const txHash =
    "0xcb4d318b2ce79255e0be09ad9913c51e71c066fcfeb7b79938a476c91dc4ee59";
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
