// https://optimistic.etherscan.io/tx/0x953ad455d5a13ee8d7c6e67626fafd77dacb1cddc7320df3332e4e8e7c7db825
// block number: 42709462

import { ethNumToWeiBn } from "../../utils/ethNumToWeiBn";

export const SEAPORT_CONTRACT = "0x00000000006c3852cbEf3e08E8dF289169EdE581";

export const NFT_CONTRACT = "0x2f05e799C61b600c65238a9DF060cABA63Db8E78";
export const NFT_TOKEN_ID = 1;

export const floorPrice = ethNumToWeiBn(0.007);
export const offerPrice = ethNumToWeiBn(0.007);
export const offerPriceUnit = ethNumToWeiBn(0.001);

export const buyerAddress = "0x5caf777a1e62088ecfd1446fbbfdd354835d1013";

export const orderParams = {
  parameters: {
    offerer: "0xEA49A93c8Eac3E14560F36dFB7b6487A5D660259",
    zone: "0x0000000000000000000000000000000000000000",
    offer: [
      {
        itemType: "3",
        token: "0x2f05e799C61b600c65238a9DF060cABA63Db8E78",
        identifierOrCriteria: "1",
        startAmount: "25",
        endAmount: "25",
      },
    ],
    consideration: [
      {
        itemType: "0",
        token: "0x0000000000000000000000000000000000000000",
        identifierOrCriteria: "0",
        startAmount: "170625000000000000",
        endAmount: "170625000000000000",
        recipient: "0xEA49A93c8Eac3E14560F36dFB7b6487A5D660259",
      },
      {
        itemType: "0",
        token: "0x0000000000000000000000000000000000000000",
        identifierOrCriteria: "0",
        startAmount: "4375000000000000",
        endAmount: "4375000000000000",
        recipient: "0x0000a26b00c1F0DF003000390027140000fAa719",
      },
    ],
    orderType: "1",
    startTime: "1669388050",
    endTime: "1671980050",
    zoneHash:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    salt: "24446860302761739304752683030156737591518664810215442929818103697458915835491",
    conduitKey:
      "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    totalOriginalConsiderationItems: "2",
  },
  numerator: "1",
  denominator: "25",
  signature:
    "0x81dfd9d87a242dedeaf4d60bbef7ac91708953c0d9916792f36f2320741c2cda7966cfa46fc937b7b71aa31f0b87184ea56f287a5da86a0039d6220b27a77e461b",
  extraData: "0x",
};
export const criteriaResolvers = [];
export const fulfillerConduitKey =
  "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000";
export const recipient = "0x0000000000000000000000000000000000000000";
