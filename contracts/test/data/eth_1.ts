// https://opensea.io/assets/optimism/0x812053625db6b8fbd282f8e269413a6dd59724c9/7914
// https://etherscan.io/tx/0xa5fa4312311ade4b1ff26afe66e0f1872b83f466e5ae02f967288d562e922940
// block number: 16065697

import { ethNumToWeiBn } from "../../utils/ethNumToWeiBn";

export const SEAPORT_CONTRACT = "0x00000000006c3852cbEf3e08E8dF289169EdE581";

export const NFT_CONTRACT = "0x477F885f6333317f5B2810ECc8AfadC7d5b69dD2";
export const NFT_TOKEN_ID = 223;

export const floorPrice = ethNumToWeiBn(0.25);
export const offerPrice = ethNumToWeiBn(0.248);
export const offerPriceUnit = ethNumToWeiBn(0.05);

export const buyerAddress = "0xF6E312845D157f94d894C6a853287f3206D1F04f";

export const orderParams = {
  considerationToken: "0x0000000000000000000000000000000000000000",
  considerationIdentifier: "0",
  considerationAmount: "223200000000000000",
  offerer: "0xF6E312845D157f94d894C6a853287f3206D1F04f",
  zone: "0x004C00500000aD104D7DBd00e3ae0A5C00560C00",
  offerToken: "0x477F885f6333317f5B2810ECc8AfadC7d5b69dD2",
  offerIdentifier: "223",
  offerAmount: "1",
  basicOrderType: "2",
  startTime: "1669599826",
  endTime: "1672191826",
  zoneHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  salt: "24446860302761739304752683030156737591518664810215442929810282450932195863314",
  offererConduitKey:
    "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  fulfillerConduitKey:
    "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  totalOriginalAdditionalRecipients: 2,
  additionalRecipients: [
    {
      amount: "6200000000000000",
      recipient: "0x0000a26b00c1F0DF003000390027140000fAa719",
    },
    {
      amount: "18600000000000000",
      recipient: "0x0241091b76B77efbDbA1A99442ca0D60cD881A25",
    },
  ],
  signature:
    "0x298c8cba808bacaa2bde57aa77332c86187fd766d572bfb3ff86a3fcb3b40e9b5c5d13afa1f67eba34fbb1d39fe9c679b2101afa2c3924abe18a4d18aa4d9ec01c",
};
