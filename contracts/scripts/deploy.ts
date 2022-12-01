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
import { SEAPORT_CONTRACT } from "../test/data/optimism_success_721";

const floorPrice = ethers.utils.parseEther("0.0089");
const offerPriceUnit = ethers.utils.parseEther("0.001");

async function main() {
  const [deployer, seller, user1, user2] = await ethers.getSigners();
  const mockERC721 = await new MockERC721__factory(deployer).deploy();
  await mockERC721.deployed();
  console.log("MockERC721 Deployed \t\t\t ", mockERC721.address);

  const defenDAOFactory = await new TestDefenDAOFactory__factory(
    deployer
  ).deploy();
  await defenDAOFactory.deployed();
  console.log("DefenDAOFactory Deployed \t\t ", defenDAOFactory.address);

  await defenDAOFactory.makeCollection(
    "0x0110Bb5739a6F82eafc748418e572Fc67d854a0F",
    SEAPORT_CONTRACT,
    "early-optimists",
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

  // const user1OfferCount = 8;
  // const offerPrice = ethers.utils.parseEther("0.008");
  // await user1.sendTransaction({
  //   to: defenDAO.address,
  //   value: offerPriceUnit.mul(user1OfferCount),
  // });
  // await defenDAO.connect(user1).makeOffer(offerPrice, user1OfferCount);

  // const user2OfferCount = 12;
  // await user2.sendTransaction({
  //   to: defenDAO.address,
  //   value: offerPriceUnit.mul(user2OfferCount),
  // });
  // await defenDAO.connect(user2).makeOffer(offerPrice, user2OfferCount);

  const user1Offers = [
    { price: "0.003", count: 20 },
    { price: "0.005", count: 13 },
    { price: "0.008", count: 7 },
  ];
  const user2Offers = [
    { price: "0.001", count: 12 },
    { price: "0.002", count: 18 },
    { price: "0.003", count: 23 },
    { price: "0.004", count: 50 },
    { price: "0.005", count: 40 },
    { price: "0.006", count: 21 },
    { price: "0.007", count: 15 },
    { price: "0.008", count: 5 },
  ];

  console.log("User1", user1.address);
  for (const user1Offer of user1Offers) {
    const price = ethers.utils.parseEther(user1Offer.price);
    const count = user1Offer.count;
    await user1.sendTransaction({
      to: defenDAO.address,
      value: price.mul(count),
    });

    await defenDAO.connect(user1).makeOffer(price, count);
  }

  for (const user2Offer of user2Offers) {
    const price = ethers.utils.parseEther(user2Offer.price);
    const count = user2Offer.count;
    await user2.sendTransaction({
      to: defenDAO.address,
      value: price.mul(count),
    });

    await defenDAO
      .connect(user2)
      .makeOffer(ethers.utils.parseEther(user2Offer.price), user2Offer.count);
  }

  await defenDAOFactory.makeCollection(
    "0xfA14e1157F35E1dAD95dC3F822A9d18c40e360E2",
    SEAPORT_CONTRACT,
    "optimism-quests",
    ethers.utils.parseEther("0.0005"),
    ethers.utils.parseEther("0.00005")
  );

  await defenDAOFactory.makeCollection(
    "0x74a002d13f5f8af7f9a971f006b9a46c9b31dabd",
    SEAPORT_CONTRACT,
    "rabbithole-l2-explorer",
    ethers.utils.parseEther("0.0005"),
    ethers.utils.parseEther("0.00005")
  );

  await defenDAOFactory.makeCollection(
    "0x81b30ff521D1fEB67EDE32db726D95714eb00637",
    SEAPORT_CONTRACT,
    "optimistic-explorer",
    ethers.utils.parseEther("0.0003"),
    ethers.utils.parseEther("0.00005")
  );

  await defenDAOFactory.mockRecordRecentSold(
    "0x0110Bb5739a6F82eafc748418e572Fc67d854a0F",
    1761,
    ethers.utils.parseEther("0.0089"),
    user1.address,
    "Early Optimists #1761",
    "https://i.seadn.io/gae/eFYickzmV6OdT64TLARFnUvYtmZ2Tthg_ACbplbZVVg-aYv9-SdwlQ1HxYwBRDeTF0ExLskLCogDHiMF1qyzZPvuOxDS-qsHHApfsA"
  );

  await defenDAOFactory.mockRecordRecentSold(
    "0x74a002d13f5f8af7f9a971f006b9a46c9b31dabd",
    210941,
    ethers.utils.parseEther("0.0005"),
    user1.address,
    "Rabbithole L2 Explorer #210941",
    "https://i.seadn.io/gae/EcXaMCNMCZlKGdzgbVoBQHKGapeWpJky9QT56wAoycm3JS0ZcI-5_oorqiuSO-ORHTM5qvuPlgiQ--nyDvU-_W_GybVI9fVJpNYFijo"
  );

  await defenDAOFactory.mockRecordRecentSold(
    "0x81b30ff521D1fEB67EDE32db726D95714eb00637",
    77329,
    ethers.utils.parseEther("0.0003"),
    user2.address,
    "Optimistic Explorer #77329",
    "https://i.seadn.io/gae/I7Mlo0iMHlqdf6ZE2x116hLR4CfKwaD1k_yAIGVQmk4DfqV4eIKV0m6VgyF0hfDQsr-3f2fEV9oBoKwWMFottYu55jCP798mGwQ9ug"
  );

  await defenDAOFactory.mockRecordRecentSold(
    "0x81b30ff521D1fEB67EDE32db726D95714eb00637",
    81372,
    ethers.utils.parseEther("0.00035"),
    user2.address,
    "Optimistic Explorer #81372",
    "https://i.seadn.io/gae/I7Mlo0iMHlqdf6ZE2x116hLR4CfKwaD1k_yAIGVQmk4DfqV4eIKV0m6VgyF0hfDQsr-3f2fEV9oBoKwWMFottYu55jCP798mGwQ9ug"
  );

  const recentSolds = await defenDAOFactory.getRecentSolds();
  console.log(recentSolds);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
