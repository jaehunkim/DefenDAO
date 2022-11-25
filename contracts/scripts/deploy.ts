/* eslint-disable camelcase */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import {
  MockERC721__factory,
  TestDefenDAOFactory__factory,
  TestDefenDAO__factory,
} from "../typechain";

const floorPrice = ethers.utils.parseEther("1");
const offerPriceUnit = ethers.utils.parseEther("0.1");

async function main() {
  const [deployer, seller, user1, user2] = await ethers.getSigners();
  const mockERC721 = await new MockERC721__factory(deployer).deploy();
  await mockERC721.deployed();
  await mockERC721.connect(deployer).mint(1);
  console.log("MockERC721 Deployed \t\t\t ", mockERC721.address);

  const defenDAOFactory = await new TestDefenDAOFactory__factory(
    deployer
  ).deploy();
  await defenDAOFactory.deployed();
  console.log("DefenDAOFactory Deployed \t\t ", defenDAOFactory.address);

  await defenDAOFactory.makeCollection(
    "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    "bored-ape-yocht-ciub-officiai",
    floorPrice,
    offerPriceUnit
  );

  const blockNumBefore = await ethers.provider.getBlockNumber();
  const filter = defenDAOFactory.filters.CollectionCreated();
  const events = await defenDAOFactory.queryFilter(filter, blockNumBefore - 1);
  const lastevent = events[events.length - 1];
  const collectionAddr = lastevent.args.collection;
  const defenDAO = await TestDefenDAO__factory.connect(
    collectionAddr,
    deployer
  );
  console.log("DefenDAO collection created \t\t ", defenDAO.address);

  const user1OfferCount = 8;
  const offerPrice = ethers.utils.parseEther("0.9");
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

  await defenDAOFactory.makeCollection(
    "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    "azuki",
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("0.5")
  );

  await defenDAOFactory.makeCollection(
    "0x477F885f6333317f5B2810ECc8AfadC7d5b69dD2",
    "yugiyn-official",
    ethers.utils.parseEther("0.3"),
    ethers.utils.parseEther("0.05")
  );

  await defenDAOFactory.makeCollection(
    "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    "doodles-official",
    ethers.utils.parseEther("6.7"),
    ethers.utils.parseEther("0.5")
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
