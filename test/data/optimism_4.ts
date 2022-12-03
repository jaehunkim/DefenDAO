// https://opensea.io/assets/optimism/0xbf2794adaf7a48a2a24eb344a7ba221a52fe2171/482
// https://optimistic.etherscan.io/tx/0x489dc25ebb3ea9b4949a900105d82fa42e0d7ad520f219a09e347dd73790f869
// block number: 42280443

import { ethNumToWeiBn } from "../../utils/ethNumToWeiBn";

export const SEAPORT_CONTRACT = "0x00000000006c3852cbEf3e08E8dF289169EdE581";

export const NFT_CONTRACT = "0xbf2794adaf7a48a2a24eb344a7ba221a52fe2171";
export const NFT_TOKEN_ID = 482;

export const floorPrice = ethNumToWeiBn(0.1);
export const offerPrice = ethNumToWeiBn(0.1);
export const offerPriceUnit = ethNumToWeiBn(0.01);

export const buyerAddress = "0x114f0bbf1318ac34be7d75658c98ae5684809887";

export const orderParams = {
  considerationToken: "0x0000000000000000000000000000000000000000",
  considerationIdentifier: "0",
  considerationAmount: "97500000000000000",
  offerer: "0xc986cdE72A2f91dfDE731A6f933C702c108cC1a4",
  zone: "0x0000000000000000000000000000000000000000",
  offerToken: "0xBf2794ADAF7A48A2a24EB344a7bA221A52fe2171",
  offerIdentifier: "482",
  offerAmount: "1",
  basicOrderType: 0,
  startTime: "1669251952",
  endTime: "1677027952",
  zoneHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  salt: "24446860302761739304752683030156737591518664810215442929802895500003928782430",
  offererConduitKey:
    "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  fulfillerConduitKey:
    "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  totalOriginalAdditionalRecipients: 1,
  additionalRecipients: [
    {
      amount: "2500000000000000",
      recipient: "0x0000a26b00c1F0DF003000390027140000fAa719",
    },
  ],
  signature:
    "0x946415663cdc2206daa5f1236e2f48d44c97723985aa9d90e8fb43532b86d81248bda847a8feb566cf2200252958589cbdb4a0b1840db285802899c050601b711c",
};
