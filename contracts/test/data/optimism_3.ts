// https://opensea.io/assets/optimism/0x74a002d13f5f8af7f9a971f006b9a46c9b31dabd/85561
// https://optimistic.etherscan.io/tx/0xcb4d318b2ce79255e0be09ad9913c51e71c066fcfeb7b79938a476c91dc4ee59
// block number: 42482773
// 얘는 seaport contract, function 이 다름 (v1 일듯?)

import { ethNumToWeiBn } from "../../utils/ethNumToWeiBn";

export const SEAPORT_CONTRACT = "0xc78a09d6a4badecc7614a339fd264b7290361ef1";

export const NFT_CONTRACT = "0x74a002d13f5f8af7f9a971f006b9a46c9b31dabd";
export const NFT_TOKEN_ID = 85561;

export const floorPrice = ethNumToWeiBn(0.00021);
export const offerPrice = ethNumToWeiBn(0.00021);
export const offerPriceUnit = ethNumToWeiBn(0.00001);

export const buyerAddress = "0xe45c950efb371c331ffef421b5c8787c74830479";

export const orderParams = {
  parameters: {
    offerer: "0x213b06991AA086F89240618eea8dA79Cf6A3262D",
    zone: "0x5D9102D6a0734Fc6731A958a685DE18101d98357",
    offer: [
      [2, "0x74A002D13f5F8AF7f9A971f006B9a46c9b31DaBD", "85561", "1", "1"],
    ],
    consideration: [
      [
        0,
        "0x0000000000000000000000000000000000000000",
        0,
        "5250000000000",
        "5250000000000",
        "0xeC1557A67d4980C948cD473075293204F4D280fd",
      ],
      [
        0,
        "0x0000000000000000000000000000000000000000",
        0,
        "204750000000000",
        "204750000000000",
        "0x213b06991AA086F89240618eea8dA79Cf6A3262D",
      ],
    ],
    orderType: 2,
    startTime: "1669446799",
    endTime: "1677395599",
    zoneHash:
      "0x3000000000000000000000000000000000000000000000000000000000000000",
    salt: "327045356446617823474368806848698632520",
    conduitKey:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    totalOriginalConsiderationItems: 2,
  },
  signature:
    "0x4da4a2ff3c1fcc24fe24dd789a66620baf6c3cde4e5af3d5e212f7a07641e9b109f0c09adfbbfd3e12033dd8764ea1179908349a5c1deb68ecf837cdfff91a871b",
};
