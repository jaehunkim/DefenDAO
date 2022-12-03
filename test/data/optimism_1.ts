// https://opensea.io/assets/optimism/0x812053625db6b8fbd282f8e269413a6dd59724c9/7914
// https://optimistic.etherscan.io/tx/0xeab870b52b5122cfd3fcb0d88f2fe8546809cf299c65438890b840c2110426f5
// block number: 42341094

import { ethNumToWeiBn } from "../../utils/ethNumToWeiBn";

export const SEAPORT_CONTRACT = "0x00000000006c3852cbEf3e08E8dF289169EdE581";

export const NFT_CONTRACT = "0x812053625DB6B8FBD282F8E269413a6DD59724C9";
export const NFT_TOKEN_ID = 7914;

export const floorPrice = ethNumToWeiBn(0.0009);
export const offerPrice = ethNumToWeiBn(0.0009);
export const offerPriceUnit = ethNumToWeiBn(0.0001);

export const buyerAddress = "0x91628188530F7B93919C81eb4D5dFE9D93ECb5bE";

export const orderParams = {
  considerationToken: "0x0000000000000000000000000000000000000000",
  considerationIdentifier: "0",
  considerationAmount: "787500000000000",
  offerer: "0x9dbf443e2e1157C1d290453431fF7A4b0b745D9C",
  zone: "0x0000000000000000000000000000000000000000",
  offerToken: "0x812053625DB6B8FBD282F8E269413a6DD59724C9",
  offerIdentifier: "7914",
  offerAmount: "1",
  basicOrderType: 0,
  startTime: "1669437111",
  endTime: "1672029111",
  zoneHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  salt: "24446860302761739304752683030156737591518664810215442929805327830719245937990",
  offererConduitKey:
    "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  fulfillerConduitKey:
    "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
  totalOriginalAdditionalRecipients: 2,
  additionalRecipients: [
    {
      amount: "22500000000000",
      recipient: "0x0000a26b00c1F0DF003000390027140000fAa719",
    },
    {
      amount: "90000000000000",
      recipient: "0x49000B54784C0359A9ed744a5f3505d39043e451",
    },
  ],
  signature:
    "0x65e883e16b37c852693f66f30ae119e10cc7c248b6a3575a68bd9b701f0e80b8184c447ca012f3da58a7433fb7773353cb7819211b3a8c11a0b3051fd06dd5ea1b",
};
