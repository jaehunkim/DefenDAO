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
import {
  SEAPORT_CONTRACT,
  floorPrice,
  offerPrice,
  offerPriceUnit,
} from "../test/data/optimism_success_721_chad";

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
    "0x9b9f542456ad12796ccb8eb6644f29e3314e68e1",
    SEAPORT_CONTRACT,
    "optichads",
    floorPrice,
    offerPriceUnit
  );

  const blockNumBefore = await ethers.provider.getBlockNumber();
  const filter = defenDAOFactory.filters.CollectionCreated();
  const events = await defenDAOFactory.queryFilter(filter, blockNumBefore - 1);
  const lastevent = events[events.length - 1];
  const collectionAddr = lastevent.args.collection;
  const defenDAO = TestDefenDAO__factory.connect(collectionAddr, deployer);
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
    { price: "0.00125", count: 20 },
    { price: "0.0075", count: 15 },
    // { price: "0.0125", count: 17 },
  ];
  const user2Offers = [
    { price: "0.00125", count: 18 },
    { price: "0.0025", count: 23 },
    { price: "0.00375", count: 50 },
    { price: "0.005", count: 40 },
    { price: "0.00625", count: 25 },
    { price: "0.0075", count: 15 },
    { price: "0.00875", count: 5 },
    { price: "0.01", count: 80 },
    { price: "0.01125", count: 18 },
    // { price: "0.0125", count: 12 },
  ];

  console.log("User1", user1.address);
  for (const user1Offer of user1Offers) {
    const price = ethers.utils.parseEther(user1Offer.price);
    const count = user1Offer.count;
    await user1.sendTransaction({
      to: defenDAO.address,
      value: price.mul(count).div(10),
    });

    await defenDAO.connect(user1).makeOffer(price, count);
  }

  for (const user2Offer of user2Offers) {
    const price = ethers.utils.parseEther(user2Offer.price);
    const count = user2Offer.count;
    await user2.sendTransaction({
      to: defenDAO.address,
      value: price.mul(count).div(10),
    });

    await defenDAO.connect(user2).makeOffer(price, count);
  }

  const defenDAOInfos = [
    {
      address: "0x0110Bb5739a6F82eafc748418e572Fc67d854a0F",
      slug: "early-optimists",
      floor: ethers.utils.parseEther("0.008"),
      unit: ethers.utils.parseEther("0.0008"),
      dummyCount: 200,
    },
    {
      address: "0xfA14e1157F35E1dAD95dC3F822A9d18c40e360E2",
      slug: "optimism-quests",
      floor: ethers.utils.parseEther("0.0005"),
      unit: ethers.utils.parseEther("0.00005"),
      dummyCount: 180,
    },
    {
      address: "0x74a002d13f5f8af7f9a971f006b9a46c9b31dabd",
      slug: "rabbithole-l2-explorer",
      floor: ethers.utils.parseEther("0.0005"),
      unit: ethers.utils.parseEther("0.00005"),
      dummyCount: 170,
    },
    {
      address: "0x81b30ff521D1fEB67EDE32db726D95714eb00637",
      slug: "optimistic-explorer",
      floor: ethers.utils.parseEther("0.0005"),
      unit: ethers.utils.parseEther("0.00005"),
      dummyCount: 150,
    },
  ];

  for (const info of defenDAOInfos) {
    await defenDAOFactory.makeCollection(
      info.address,
      SEAPORT_CONTRACT,
      info.slug,
      info.floor,
      info.unit
    );

    const events = await defenDAOFactory.queryFilter(filter);
    const lastevent = events[events.length - 1];
    const newAddr = lastevent.args.collection;
    const daoContract = TestDefenDAO__factory.connect(newAddr, user2);

    const price = info.unit.mul(3);
    const count = info.dummyCount;
    await user2.sendTransaction({
      to: daoContract.address,
      value: price.mul(count).div(10),
    });

    await daoContract.makeOffer(price, count);
  }

  await defenDAOFactory.mockRecordRecentSold(
    "0x0110Bb5739a6F82eafc748418e572Fc67d854a0F",
    1761,
    ethers.utils.parseEther("0.0089"),
    user1.address,
    "Early Optimists #1761",
    "https://i.seadn.io/gae/eFYickzmV6OdT64TLARFnUvYtmZ2Tthg_ACbplbZVVg-aYv9-SdwlQ1HxYwBRDeTF0ExLskLCogDHiMF1qyzZPvuOxDS-qsHHApfsA"
  );

  await defenDAOFactory.mockRecordRecentSold(
    "0x9b9f542456ad12796ccb8eb6644f29e3314e68e1",
    8965,
    ethers.utils.parseEther("0.013"),
    user1.address,
    "Chad #8965",
    "https://i.seadn.io/gae/A45gUm0-AVTsjHaeD6rztReTBLTAmJU-xCp2FHGRLf4aJ3rzF8MBOhLTtabeK9L60l36W5L1idsOmUSf7J8NgXbrZY6mc1GQ8hkr"
  );

  await defenDAOFactory.mockRecordRecentSold(
    "0x9b9f542456ad12796ccb8eb6644f29e3314e68e1",
    8985,
    ethers.utils.parseEther("0.013"),
    user1.address,
    "Chad #8985",
    "https://i.seadn.io/gae/o6s_d94js0oyHQCAxSM5DoznWOE0jW1q3e0N2aFwLGltlnI_rN2m_uLkrN7vg9rayKR1-l80fl0F7a06IwAbLzVuApouf48vdm6Y"
  );

  await defenDAOFactory.mockRecordRecentSold(
    "0x9b9f542456ad12796ccb8eb6644f29e3314e68e1",
    7791,
    ethers.utils.parseEther("0.013"),
    user1.address,
    "Chad #7791",
    "https://i.seadn.io/gae/qQ5ojHPPfsV88ZMtbYzvSfc5iKhpPuJ7DItNW4Dt8gcj398qAH7BzQ29dmDChvmtW81s2H5SvCkCHgzwHU-x4fkpltZrDiJsuQxkiQ"
  );

  await defenDAOFactory.mockRecordRecentSold(
    "0x9b9f542456ad12796ccb8eb6644f29e3314e68e1",
    8400,
    ethers.utils.parseEther("0.0132"),
    user1.address,
    "Chad #8400",
    "https://i.seadn.io/gae/DAkl9zDYmjcG8IviKYEql2lhpEpp4wKObQhJ1ckjxEwIXfwmF9U-cBhPhrQ6lPYG4EdLPA5_3BY_OPSY8EqKeMqHyyNDBtLeshlp"
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
  // console.log(recentSolds);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
