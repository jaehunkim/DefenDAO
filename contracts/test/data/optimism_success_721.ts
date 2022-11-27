// https://opensea.io/assets/optimism/0x672f466B13eE1856C32f8bD956730D8Eff28bF16/4
// https://optimistic.etherscan.io/tx/0x80154f95f5a1bba3e11df72a072365bb7db7ecbc1b3903e1197b62a301dcd1ce
// block number: 25782513

import { ethNumToWeiBn } from "../../utils/ethNumToWeiBn";

export const SEAPORT_CONTRACT = "0x00000000006c3852cbEf3e08E8dF289169EdE581";

export const NFT_CONTRACT = "0x672f466B13eE1856C32f8bD956730D8Eff28bF16";
export const NFT_TOKEN_ID = 4;

export const floorPrice = ethNumToWeiBn(0.001);
export const offerPrice = ethNumToWeiBn(0.001);
export const offerPriceUnit = ethNumToWeiBn(0.0001);

export const buyerAddress = "0x63b81972320b5b8d1c1fc90e29f145380b5b9bd4";

export const orderParams = {
  parameters: {
    offerer: "0x601984a2A5a910981fb8d60C4d8c00d5D49093B6",
    zone: "0x0000000000000000000000000000000000000000",
    offer: [
      {
        itemType: "2",
        token: "0x672f466B13eE1856C32f8bD956730D8Eff28bF16",
        identifierOrCriteria: "4",
        startAmount: "1",
        endAmount: "1",
      },
    ],
    consideration: [
      {
        itemType: "0",
        token: "0x0000000000000000000000000000000000000000",
        identifierOrCriteria: "0",
        startAmount: "975000000000000",
        endAmount: "975000000000000",
        recipient: "0x601984a2A5a910981fb8d60C4d8c00d5D49093B6",
      },
      {
        itemType: "0",
        token: "0x0000000000000000000000000000000000000000",
        identifierOrCriteria: "0",
        startAmount: "25000000000000",
        endAmount: "25000000000000",
        recipient: "0x0000a26b00c1F0DF003000390027140000fAa719",
      },
    ],
    orderType: "0",
    startTime: "1664293546",
    endTime: "1666885246",
    zoneHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    salt: "24446860302761739304752683030156737591518664810215442929801525965300034749836",
    conduitKey:
      "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    totalOriginalConsiderationItems: "2",
  },
  numerator: "1",
  denominator: "1",
  signature:
    "0x049f4c88299c200e49d4d3c35ccaa2efc58cd64064ce4c173bbfe9b89aff58ea6215bd49b799caa4178b368493715623d1784c2d91fb1030578024fe3242b81c1b",
  extraData: "0x",
};
export const criteriaResolvers = [];
export const fulfillerConduitKey =
  "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
export const recipient = "0xFAD445029D2BA1FAb6D5d3225e0f52b3Ea8D812f";
