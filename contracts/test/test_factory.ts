/* eslint-disable camelcase */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
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

describe("DefenDAOFactory", function () {
  const floorPrice = expand(1, 18);
  const offerPriceUnit = expand(1, 17);
  let deployer: SignerWithAddress;
  let mockERC721: MockERC721;
  let defenDAO: TestDefenDAO;
  let defenDAOFactory: TestDefenDAOFactory;

  it("Should create new DefenDAOFactory", async function () {
    [deployer] = await ethers.getSigners();
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
});
