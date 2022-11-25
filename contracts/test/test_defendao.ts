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

function expand(num: number, pow: number): BigNumber {
  return BigNumber.from(num).mul(BigNumber.from(10).pow(pow));
}

async function getTxGas(tx: ContractTransaction): Promise<BigNumber> {
  const txReceipt = await ethers.provider.getTransactionReceipt(tx.hash);
  const gasPrice = tx.gasPrice ? tx.gasPrice : BigNumber.from(0);
  return gasPrice.mul(txReceipt.gasUsed);
}

describe("DefenDAO", function () {
  const floorPrice = expand(1, 18);
  const offerPrice = expand(9, 17);
  const offerPriceUnit = expand(1, 17);
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
    await defenDAO.initialize(mockERC721.address, floorPrice, offerPriceUnit);
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
  it("Should claim NFT", async function () {
    await defenDAO.connect(user1).claimNFTs([tokenId]);
    expect(await mockERC721.ownerOf(tokenId)).to.equal(user1.address);
  });
});
