import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { assert } from "console";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import {
  TestDefenDAO,
  MockERC721,
  MockERC721__factory,
  TestDefenDAO__factory,
} from "../typechain";

const NFT_CONTRACT = "0x812053625DB6B8FBD282F8E269413a6DD59724C9";
const NFT_TOKEN_ID = 7914;

const ethNumToWeiBn = (eth: number) => ethers.utils.parseEther(eth.toString());

async function getTxGas(tx: ContractTransaction): Promise<BigNumber> {
  const txReceipt = await ethers.provider.getTransactionReceipt(tx.hash);
  const gasPrice = tx.gasPrice ? tx.gasPrice : BigNumber.from(0);
  return gasPrice.mul(txReceipt.gasUsed);
}

const impersonateAddress = (address: string) => {
  return ethers.getImpersonatedSigner(address);
};

describe("DefenDAO", function () {
  const floorPrice = ethNumToWeiBn(0.0009);
  const offerPrice = BigNumber.from(9);
  const offerPriceUnit = ethNumToWeiBn(0.0001);
  const tokenId = 1;
  let deployer: SignerWithAddress;
  let seller: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let mockERC721: MockERC721;
  let defenDAO: TestDefenDAO;
  it("Should create new DefenDAO", async function () {
    [deployer, seller, user1, user2] = await ethers.getSigners();
    mockERC721 = await new MockERC721__factory(deployer).deploy();
    await mockERC721.deployed();
    defenDAO = await new TestDefenDAO__factory(deployer).deploy();
    await defenDAO.deployed();
    await defenDAO.initialize(
      mockERC721.address,
      "0x00000000006c3852cbEf3e08E8dF289169EdE581", // opensea seaport
      floorPrice,
      offerPriceUnit
    );
  });

  it("Should set up seller", async function () {
    await mockERC721.connect(seller).mint(tokenId);
    expect(await mockERC721.ownerOf(tokenId)).to.equal(seller.address);
  });

  it("Should make offer", async function () {
    console.log(
      "balance: ",
      ethers.utils.formatEther(await ethers.provider.getBalance(user1.address))
    );
    const user1OfferCount = 8;
    await user1.sendTransaction({
      to: defenDAO.address,
      value: offerPriceUnit.mul(user1OfferCount),
    });
    await defenDAO.connect(user1).makeOffer(offerPrice, user1OfferCount);
    expect(await defenDAO.getBalance()).to.equal(
      offerPriceUnit.mul(user1OfferCount)
    );
    expect(await defenDAO.getUserOffers(user1.address, offerPrice)).to.equal(
      user1OfferCount
    );
    expect(await defenDAO.getAllOffers(offerPrice)).to.equal(user1OfferCount);
    expect(await defenDAO.getOfferBalanceAddrOrdersLength(offerPrice)).to.equal(
      1
    );
    expect(await defenDAO.offerBalanceAddrOrders(offerPrice, 0)).to.contain(
      user1.address
    );

    const user2OfferCount = 12;
    await user2.sendTransaction({
      to: defenDAO.address,
      value: offerPriceUnit.mul(user2OfferCount),
    });
    await defenDAO.connect(user2).makeOffer(offerPrice, user2OfferCount);
    expect(await defenDAO.getBalance()).to.equal(
      offerPriceUnit.mul(user1OfferCount + user2OfferCount)
    );
    expect(await defenDAO.getUserOffers(user2.address, offerPrice)).to.equal(
      user2OfferCount
    );
    expect(await defenDAO.getAllOffers(offerPrice)).to.equal(
      user1OfferCount + user2OfferCount
    );
    expect(await defenDAO.getOfferBalanceAddrOrdersLength(offerPrice)).to.equal(
      2
    );
    expect(await defenDAO.offerBalanceAddrOrders(offerPrice, 1)).to.contain(
      user2.address
    );
  });

  it("Should cancel offer", async function () {
    const user1CancelCount = 1;
    const user1OfferCount = await defenDAO.getUserOffers(
      user1.address,
      offerPrice
    );
    const user1Balance = await user1.getBalance();
    console.log("user1Balance: ", user1Balance);
    const cancelTx = await defenDAO.connect(user1).cancelOffer(offerPrice, 1);
    const txGas = await getTxGas(cancelTx);
    expect(await user1.getBalance()).to.equal(
      user1Balance.add(offerPriceUnit.mul(user1CancelCount)).sub(txGas)
    );
    expect(await defenDAO.getUserOffers(user1.address, offerPrice)).to.equal(
      user1OfferCount.sub(user1CancelCount)
    );
  });

  // TODO(liayoo): remove this
  // it("Should mock execute", async function () {
  //   await mockERC721.connect(seller).approve(defenDAO.address, tokenId);

  //   const allOffers = await defenDAO.getAllOffers(offerPrice);
  //   const offerPerNFT = offerPrice.div(offerPriceUnit);
  //   const sellerBalance = await ethers.provider.getBalance(seller.address);
  //   const luckyIndex = 5;
  //   const executeTx = await defenDAO
  //     .connect(seller)
  //     .mockExecute(offerPrice, tokenId, user1.address, luckyIndex);
  //   const txGas = await getTxGas(executeTx);
  //   expect(await defenDAO.getAllOffers(offerPrice)).to.equal(
  //     allOffers.sub(offerPerNFT)
  //   );
  //   expect(await ethers.provider.getBalance(seller.address)).to.equal(
  //     sellerBalance.add(offerPrice).sub(txGas)
  //   );
  //   expect(await defenDAO.claimableNFTs(tokenId)).to.equal(user1.address);
  // });

  it("Should return a random integer", async function () {
    for (let i = 0; i < 100; i++) {
      const max = Math.floor(Math.random() * 10000);
      const randNum = await defenDAO.random(max);
      expect(randNum).to.be.gte(0);
      expect(randNum).to.be.lt(max);
    }
  });

  it("Should select random addresses", async function () {
    const numToSelect = 10;
    const addresses = (await ethers.getSigners())
      .slice(20)
      .map((signer) => signer.address);
    const weights = new Array(20);

    // randomly populate the weights
    let weightSum = 0;
    for (let i = 0; i < weights.length; i++) {
      weights[i] = Math.floor(Math.random() * 100);
      weightSum = weightSum + weights[i];
    }

    for (let i = 0; i < 10; i++) {
      const [selectedAddresses, selectedTimes] =
        await defenDAO.selectRandomAddresses(
          addresses,
          weights,
          weightSum,
          numToSelect
        );
      console.log(selectedAddresses);
      console.log(selectedTimes);
      expect(selectedAddresses.length).to.be.lte(numToSelect);
      expect(selectedAddresses.length).to.equal(selectedTimes.length);
      expect(
        selectedTimes.reduce((acc, cur) => acc.add(cur), BigNumber.from(0))
      ).to.equal(numToSelect);
    }
  });

  it("Should execute", async function () {
    const buyer = await impersonateAddress(
      "0x91628188530F7B93919C81eb4D5dFE9D93ECb5bE"
    );
    const offerCount = 10;
    const orderParams = {
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
      totalOriginalAdditionalRecipients: "2",
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
    await buyer.sendTransaction({
      to: defenDAO.address,
      value: offerPriceUnit.mul(offerCount),
    });
    await defenDAO.connect(buyer).makeOffer(offerPrice, offerCount);
    const executeTx = await defenDAO
      .connect(buyer)
      .execute(offerPrice, orderParams);
    console.log("executeTx:", executeTx);
    expect(
      await defenDAO.userOfferBalances(offerPrice, buyer.address)
    ).to.equal(0);
    expect(await defenDAO.offerBalanceSum(offerPrice)).to.equal(0);
    expect(await defenDAO.claimableNFTs(NFT_TOKEN_ID)).to.equal(buyer.address);
    const nft = await ethers.getContractAt("MockERC721", NFT_CONTRACT);
    expect(await nft.ownerOf(NFT_TOKEN_ID)).to.equal(defenDAO.address);
  });

  it("Should claim NFT", async function () {
    // TODO(liayoo): update this
    // await defenDAO.connect(user1).claimNFTs([tokenId]);
    // expect(await mockERC721.ownerOf(tokenId)).to.equal(user1.address);
  });
});
