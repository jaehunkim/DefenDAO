// https://opensea.io/assets/optimism/0x812053625db6b8fbd282f8e269413a6dd59724c9/9857
// https://optimistic.etherscan.io/tx/0xa12049d3f1cd74ca1109777d52a38df5bab7adb15ca02303aee218835c28d1d2
// block number: 42531915

import { ethNumToWeiBn } from "../../utils/ethNumToWeiBn";

export const SEAPORT_CONTRACT = "0x00000000006c3852cbEf3e08E8dF289169EdE581";

export const NFT_CONTRACT = "0x812053625DB6B8FBD282F8E269413a6DD59724C9";
export const NFT_TOKEN_ID = 9857;

export const floorPrice = ethNumToWeiBn(0.0006);
export const offerPrice = ethNumToWeiBn(0.0006);
export const offerPriceUnit = ethNumToWeiBn(0.0001);

export const buyerAddress = "0xe45c950efb371c331ffef421b5c8787c74830479";

export const orderParams = {
  considerationToken: "0x0000000000000000000000000000000000000000",
  considerationIdentifier: "0",
  considerationAmount: "525000000000000",
  offerer: "0x47e81209b45Df7287924DADfF900FAC8160DCDdf",
  zone: "0x0000000000000000000000000000000000000000",
  offerToken: "0x812053625DB6B8FBD282F8E269413a6DD59724C9",
  offerIdentifier: "9857",
  offerAmount: "1",
  basicOrderType: 0,
  startTime: "1669471529",
  endTime: "1672058843",
  zoneHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  salt: "24446860302761739304752683030156737591518664810215442929815595371760214247092",
  offererConduitKey:
    "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  fulfillerConduitKey:
    "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  totalOriginalAdditionalRecipients: 2,
  additionalRecipients: [
    {
      amount: "15000000000000",
      recipient: "0x0000a26b00c1F0DF003000390027140000fAa719",
    },
    {
      amount: "60000000000000",
      recipient: "0x49000B54784C0359A9ed744a5f3505d39043e451",
    },
  ],
  signature:
    "0x4da4a2ff3c1fcc24fe24dd789a66620baf6c3cde4e5af3d5e212f7a07641e9b109f0c09adfbbfd3e12033dd8764ea1179908349a5c1deb68ecf837cdfff91a871b",
};
