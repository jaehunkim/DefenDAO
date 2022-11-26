export type AdditionalRecipient = {
  amount: string;
  recipient: string;
};

export type BasicOrderParameters = {
  considerationToken: string;
  considerationIdentifier: string;
  considerationAmount: string;
  offerer: string;
  zone: string;
  offerToken: string;
  offerIdentifier: string;
  offerAmount: string;
  basicOrderType: number;
  startTime: string;
  endTime: string;
  zoneHash: string;
  salt: string;
  offererConduitKey: string;
  fulfillerConduitKey: string;
  totalOriginalAdditionalRecipients: number;
  additionalRecipients: AdditionalRecipient[];
  signature: string;
};