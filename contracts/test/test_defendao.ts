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
  ISeaport,
  ISeaport__factory,
  ERC721__factory,
  ERC721,
  TestDefenDAOFactory__factory,
} from "../typechain";
// import {
//   BLOCK_NUMBER,
//   SEAPORT_CONTRACT,
//   NFT_CONTRACT,
//   NFT_TOKEN_ID,
//   floorPrice,
//   offerPrice,
//   offerPriceUnit,
//   buyerAddress,
//   orderParams,
//   criteriaResolvers,
//   fulfillerConduitKey,
//   recipient,
//   txData,
// } from "./data/optimism_success_721";
import {
  BLOCK_NUMBER,
  SEAPORT_CONTRACT,
  NFT_CONTRACT,
  NFT_TOKEN_ID,
  floorPrice,
  offerPrice,
  offerPriceUnit,
  buyerAddress,
  orderParams,
  criteriaResolvers,
  fulfillerConduitKey,
  recipient,
  txData,
  collectionSlug,
} from "./data/optimism_success_721_chad";
import { ethNumToWeiBn } from "../utils/ethNumToWeiBn";
import { ERC1155__factory } from "../typechain/factories/ERC1155__factory";
import seaportAbi from "../abis/seaport11.json";
import { txHashToOrderParams } from "../utils/txHashToOrderParams";
import { basicOrderToOrder } from "../utils/basicOrderToOrder";

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
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let erc721: ERC721;
  let defenDAO: TestDefenDAO;
  before(async function () {
    await ethers.provider.send("hardhat_reset", [
      {
        forking: {
          jsonRpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
          blockNumber: BLOCK_NUMBER - 1,
        },
      },
    ]);
  });
  it("Should create new DefenDAO", async function () {
    [deployer, user1, user2] = await ethers.getSigners();
    erc721 = ERC721__factory.connect(NFT_CONTRACT, deployer);

    const defenDAOFactory = await new TestDefenDAOFactory__factory(
      deployer
    ).deploy();
    await defenDAOFactory.deployed();

    await defenDAOFactory.makeCollection(
      erc721.address,
      SEAPORT_CONTRACT,
      collectionSlug,
      floorPrice,
      offerPriceUnit
    );

    const blockNumBefore = await ethers.provider.getBlockNumber();
    const filter = defenDAOFactory.filters.CollectionCreated();
    const events = await defenDAOFactory.queryFilter(
      filter,
      blockNumBefore - 1
    );
    const lastevent = events[events.length - 1];
    const collectionAddr = lastevent.args.collection;
    defenDAO = await TestDefenDAO__factory.connect(collectionAddr, deployer);
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
    const seaport = await ethers.getContractAt(seaportAbi, SEAPORT_CONTRACT);
    const offerer = await impersonateAddress(orderParams.parameters.offerer);

    const latest = await ethers.provider.getBlockNumber();
    const latestBlock = await ethers.provider.getBlock(latest);
    expect(latestBlock.timestamp).to.gte(
      parseInt(orderParams.parameters.startTime)
    );
    expect(latestBlock.timestamp).to.lt(
      parseInt(orderParams.parameters.endTime)
    );
    const balanceSumBefore = await defenDAO.offerBalanceSum(offerPrice);
    const user1BalanceBefore = await defenDAO.userOfferBalances(
      offerPrice,
      user1.address
    );
    const user2BalanceBefore = await defenDAO.userOfferBalances(
      offerPrice,
      user2.address
    );
    console.log("user1BalanceBefore: ", user1BalanceBefore);
    console.log("user2BalanceBefore: ", user2BalanceBefore);
    console.log("NFT OWNER:", await erc721.ownerOf(NFT_TOKEN_ID));

    // TODO: remove once signature validation issue is resolved
    const validateTx = await seaport.connect(offerer).validate(
      [
        {
          parameters: orderParams.parameters,
          signature: orderParams.signature,
        },
      ],
      { gasLimit: 500_000 }
    );
    const validateReceipt = await validateTx.wait();
    console.log("validateTx:", validateTx);
    console.log("validateReceipt:", validateReceipt);

    /* Version 1. defendao 통해서 seaport 함수콜 */
    const executeTx = await defenDAO
      .connect(deployer)
      .execute(
        offerPrice,
        orderParams,
        criteriaResolvers,
        fulfillerConduitKey,
        {
          gasLimit: 500_000,
        }
      );
    console.log("executeTx:", executeTx);
    console.log("NFT OWNER:", await erc721.ownerOf(NFT_TOKEN_ID));
    expect(await defenDAO.offerBalanceSum(offerPrice)).to.equal(
      balanceSumBefore.sub(10)
    );
    const user1BalanceAfter = await defenDAO.userOfferBalances(
      offerPrice,
      user1.address
    );
    const user2BalanceAfter = await defenDAO.userOfferBalances(
      offerPrice,
      user2.address
    );
    console.log("user1BalanceAfter: ", user1BalanceAfter);
    console.log("user2BalanceAfter: ", user2BalanceAfter);
    const claimerAddress = await defenDAO.claimableNFTs(NFT_TOKEN_ID);
    expect(claimerAddress).to.be.oneOf([user1.address, user2.address]);
    expect(await erc721.ownerOf(NFT_TOKEN_ID)).to.equal(defenDAO.address);

    /* Version 2. raw tx data 전송 */
    // const buyer = await impersonateAddress(buyerAddress);
    // const tx = await buyer.sendTransaction({
    //   to: SEAPORT_CONTRACT,
    //   data: txData,
    //   gasLimit: 300_000,
    //   value: offerPrice,
    // });
    // const receipt = await tx.wait();
    // console.log("tx:", tx);
    // console.log("receipt:", receipt);
    // console.log("NFT OWNER:", await erc721.ownerOf(NFT_TOKEN_ID));

    /* Version 3. seaport contract 에 직접 전송 */
    // console.log("NFT OWNER:", await erc721.ownerOf(NFT_TOKEN_ID));

    // const tx = await seaport
    //   .connect(deployer)
    //   .fulfillAdvancedOrder(
    //     orderParams,
    //     criteriaResolvers,
    //     fulfillerConduitKey,
    //     recipient,
    //     {
    //       value: offerPrice,
    //       gasLimit: 500_000,
    //     }
    //   );
    // const receipt = await tx.wait();
    // console.log("tx:", tx);
    // console.log("receipt:", receipt);
    // console.log("NFT OWNER:", await erc721.ownerOf(NFT_TOKEN_ID));
    // expect(await erc721.ownerOf(NFT_TOKEN_ID)).to.equal(recipient);
  });

  it("Should claim NFT", async function () {
    const claimerAddress = await defenDAO.claimableNFTs(NFT_TOKEN_ID);

    let claimableNFTs = await defenDAO.getClaimableNFTs(claimerAddress);
    expect(claimableNFTs.length).to.equal(1);
    expect(claimableNFTs[0]).to.equal(NFT_TOKEN_ID);

    const claimer = await impersonateAddress(claimerAddress);
    await defenDAO.connect(claimer).claimNFTs([NFT_TOKEN_ID]);
    expect(await erc721.ownerOf(NFT_TOKEN_ID)).to.equal(claimerAddress);

    claimableNFTs = await defenDAO.getClaimableNFTs(claimerAddress);
    expect(claimableNFTs.length).to.equal(1);
    expect(claimableNFTs[0]).to.equal(0);
  });
});
