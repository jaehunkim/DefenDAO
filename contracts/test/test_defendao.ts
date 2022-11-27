import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
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
import {
  SEAPORT_CONTRACT,
  NFT_CONTRACT,
  NFT_TOKEN_ID,
  floorPrice,
  offerPrice,
  offerPriceUnit,
  buyerAddress,
  orderParams,
} from "./data/optimism_1";
import { ethNumToWeiBn } from "../utils/ethNumToWeiBn";


async function getTxGas(tx: ContractTransaction): Promise<BigNumber> {
  const txReceipt = await ethers.provider.getTransactionReceipt(tx.hash);
  const gasPrice = tx.gasPrice ? tx.gasPrice : BigNumber.from(0);
  return gasPrice.mul(txReceipt.gasUsed);
}

const impersonateAddress = (address: string) => {
  return ethers.getImpersonatedSigner(address);
};

describe("DefenDAO", function () {
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
      mockERC721.address, // TODO(liayoo): this needs to be updated as well..
      SEAPORT_CONTRACT,
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
  it("Should mock execute", async function () {
    await mockERC721.connect(seller).approve(defenDAO.address, tokenId);

    const allOffers = await defenDAO.getAllOffers(offerPrice);
    const offerPerNFT = offerPrice.div(offerPriceUnit);
    const sellerBalance = await ethers.provider.getBalance(seller.address);
    const luckyIndex = 5;
    const executeTx = await defenDAO
      .connect(seller)
      .mockExecute(offerPrice, tokenId, user1.address, luckyIndex);
    const txGas = await getTxGas(executeTx);
    expect(await defenDAO.getAllOffers(offerPrice)).to.equal(
      allOffers.sub(offerPerNFT)
    );
    expect(await ethers.provider.getBalance(seller.address)).to.equal(
      sellerBalance.add(offerPrice).sub(txGas)
    );
    expect(await defenDAO.claimableNFTs(tokenId)).to.equal(user1.address);
  });

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
    const addresses = new Array(20);
    const weights = new Array(20);

    // randomly populate the addresses and weights
    let weightSum = 0;
    for (let i = 0; i < addresses.length; i++) {
      addresses[i] = ethers.Wallet.createRandom().address;
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
      expect(selectedAddresses.length).to.be.lte(numToSelect);
      expect(selectedAddresses.length).to.equal(selectedTimes.length);
      expect(
        selectedTimes.reduce((acc, cur) => acc.add(cur), BigNumber.from(0))
      ).to.equal(numToSelect);
      await time.increase(3600); // for different randomness
    }
  });

  it("Should execute", async function () {
    const buyer = await impersonateAddress(buyerAddress);
    // const giver = await impersonateAddress(
    //   "0x0D0707963952f2fBA59dD06f2b425ace40b492Fe"
    // );
    // await giver.sendTransaction({
    //   to: buyer.address,
    //   value: ethNumToWeiBn(0.1),
    // });
    const nft = await ethers.getContractAt("MockERC721", NFT_CONTRACT);
    // await nft
    //   .connect(buyer)
    //   .setApprovalForAll("0x1E0049783F008A0085193E00003D00cd54003c71", true);
    const offerCount = 10;
    await buyer.sendTransaction({
      to: defenDAO.address,
      value: offerPriceUnit.mul(offerCount),
    });
    await defenDAO.connect(buyer).makeOffer(offerPrice, offerCount);
    console.log("BLOCK NUMBER:", await ethers.provider.getBlockNumber());
    console.log("NFT OWNER:", await nft.ownerOf(NFT_TOKEN_ID));
    const executeTx = await defenDAO
      .connect(buyer)
      .execute(offerPrice, orderParams);
    console.log("executeTx:", executeTx);
    expect(
      await defenDAO.userOfferBalances(offerPrice, buyer.address)
    ).to.equal(0);
    expect(await defenDAO.offerBalanceSum(offerPrice)).to.equal(0);
    expect(await defenDAO.claimableNFTs(NFT_TOKEN_ID)).to.equal(buyer.address);
    expect(await nft.ownerOf(NFT_TOKEN_ID)).to.equal(defenDAO.address);
  });

  it("Should claim NFT", async function () {
    // TODO(liayoo): update this
    await defenDAO.connect(user1).claimNFTs([tokenId]);
    expect(await mockERC721.ownerOf(tokenId)).to.equal(user1.address);
  });
});
