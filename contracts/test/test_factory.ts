/* eslint-disable camelcase */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import {
  TestDefenDAO,
  MockERC721,
  MockERC721__factory,
  TestDefenDAO__factory,
  TestDefenDAOFactory,
  TestDefenDAOFactory__factory,
} from "../typechain";

function expand(num: number, pow: number): BigNumber {
  return BigNumber.from(num).mul(BigNumber.from(10).pow(pow));
}

async function getTxGas(tx: ContractTransaction): Promise<BigNumber> {
  const txReceipt = await ethers.provider.getTransactionReceipt(tx.hash);
  const gasPrice = tx.gasPrice ? tx.gasPrice : BigNumber.from(0);
  return gasPrice.mul(txReceipt.gasUsed);
}

describe("DefenDAOFactory", function () {
  const floorPrice = expand(1, 18);
  const offerPriceUnit = expand(1, 17);
  const offerPrice = expand(9, 17);
  const tokenId = 1;
  const tokenId2 = 2;
  let deployer: SignerWithAddress;
  let seller: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let mockERC721: MockERC721;
  let defenDAO: TestDefenDAO;
  let defenDAOFactory: TestDefenDAOFactory;

  it("Should create new DefenDAOFactory", async function () {
    [deployer, seller, user1, user2] = await ethers.getSigners();
    mockERC721 = await new MockERC721__factory(deployer).deploy();
    await mockERC721.deployed();
    defenDAOFactory = await new TestDefenDAOFactory__factory(deployer).deploy();
    await defenDAOFactory.deployed();
  });

  it("Should check initial states", async function () {
    expect((await defenDAOFactory.getAllCollections()).length).to.be.equals(0);
  });

  it("Should create new collecton", async function () {
    function anyValue(): boolean {
      return true;
    }

    await expect(
      defenDAOFactory.makeCollection(
        mockERC721.address,
        "0x00000000006c3852cbEf3e08E8dF289169EdE581", // opensea seaport
        "slug",
        floorPrice,
        offerPriceUnit
      )
    )
      .to.emit(defenDAOFactory, "CollectionCreated")
      .withArgs(mockERC721.address, anyValue);

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const filter = defenDAOFactory.filters.CollectionCreated();
    const events = await defenDAOFactory.queryFilter(
      filter,
      blockNumBefore - 1
    );
    const lastevent = events[events.length - 1];
    const collectionAddr = lastevent.args.collection;
    defenDAO = await TestDefenDAO__factory.connect(collectionAddr, deployer);

    expect((await defenDAOFactory.getAllCollections()).length).to.be.equals(1);
    expect(
      await defenDAOFactory.getCollection(mockERC721.address)
    ).to.be.equals(defenDAO.address);
  });

  it("Should mock execute", async function () {
    await mockERC721.connect(seller).mint(tokenId);
    await mockERC721.connect(seller).mint(tokenId2);

    await mockERC721.connect(seller).approve(defenDAO.address, tokenId);
    await mockERC721.connect(seller).approve(defenDAO.address, tokenId2);

    const user1OfferCount = 8;
    await user1.sendTransaction({
      to: defenDAO.address,
      value: offerPriceUnit.mul(user1OfferCount),
    });
    await defenDAO.connect(user1).makeOffer(offerPrice, user1OfferCount);

    const user2OfferCount = 12;
    await user2.sendTransaction({
      to: defenDAO.address,
      value: offerPriceUnit.mul(user2OfferCount),
    });
    await defenDAO.connect(user2).makeOffer(offerPrice, user2OfferCount);

    const luckyIndex = 5;
    await defenDAO
      .connect(seller)
      .mockExecuteWithRecord(offerPrice, tokenId, user1.address, luckyIndex);

    const recentSolds = await defenDAOFactory.getRecentSolds();
    expect(recentSolds.length).to.equal(1);
    expect(recentSolds[0].token).to.equal(mockERC721.address);
    expect(recentSolds[0].nftId).to.equal(tokenId);
    expect(recentSolds[0].price).to.equal(offerPrice);
    expect(recentSolds[0].claimer).to.equal(user1.address);

    await defenDAO
      .connect(seller)
      .mockExecuteWithRecord(offerPrice, tokenId2, user1.address, luckyIndex);
    const recentSolds2 = await defenDAOFactory.getRecentSolds();
    expect(recentSolds2.length).to.equal(2);
    expect(recentSolds2[0].token).to.equal(mockERC721.address);
    expect(recentSolds2[0].nftId).to.equal(tokenId2);
    expect(recentSolds2[0].price).to.equal(offerPrice);
    expect(recentSolds2[0].claimer).to.equal(user1.address);
    expect(recentSolds2[1].token).to.equal(mockERC721.address);
    expect(recentSolds2[1].nftId).to.equal(tokenId);
    expect(recentSolds2[1].price).to.equal(offerPrice);
    expect(recentSolds2[1].claimer).to.equal(user1.address);
  });
});
