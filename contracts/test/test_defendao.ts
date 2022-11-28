import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { assert } from "console";
import { BigNumber, ContractTransaction, providers } from "ethers";
import { ethers } from "hardhat";
import {
  TestDefenDAO,
  MockERC721,
  MockERC721__factory,
  TestDefenDAO__factory,
  ISeaport,
  ISeaport__factory,
  IERC721__factory,
  ERC721__factory,
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
  criteriaResolvers,
  fulfillerConduitKey,
  recipient,
} from "./data/eth_1";
import { ethNumToWeiBn } from "../utils/ethNumToWeiBn";
import { ERC1155__factory } from "../typechain/factories/ERC1155__factory";
import seaportAbi from "../abis/seaport11.json";

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
  let mockERC721: MockERC721;
  let defenDAO: TestDefenDAO;
  const offerPrice2 = offerPrice.sub(offerPriceUnit);
  it("Should create new DefenDAO", async function () {
    [deployer, user1, user2] = await ethers.getSigners();
    mockERC721 = await new MockERC721__factory(deployer).deploy(); // TODO(liayoo): replace this with the nft instance
    await mockERC721.deployed();
    defenDAO = await new TestDefenDAO__factory(deployer).deploy();
    await defenDAO.deployed();
    await defenDAO.initialize(
      mockERC721.address,
      SEAPORT_CONTRACT,
      floorPrice,
      offerPriceUnit
    );
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
    await defenDAO.connect(user1).makeOffer(offerPrice2, user1OfferCount);
    expect(await defenDAO.getBalance()).to.equal(
      offerPriceUnit.mul(user1OfferCount)
    );
    expect(await defenDAO.getUserOffers(user1.address, offerPrice2)).to.equal(
      user1OfferCount
    );
    expect(await defenDAO.getAllOffers(offerPrice2)).to.equal(user1OfferCount);
    expect(
      await defenDAO.getOfferBalanceAddrOrdersLength(offerPrice2)
    ).to.equal(1);
    expect(await defenDAO.offerBalanceAddrOrders(offerPrice2, 0)).to.contain(
      user1.address
    );

    const user2OfferCount = 12;
    await user2.sendTransaction({
      to: defenDAO.address,
      value: offerPriceUnit.mul(user2OfferCount),
    });
    await defenDAO.connect(user2).makeOffer(offerPrice2, user2OfferCount);
    expect(await defenDAO.getBalance()).to.equal(
      offerPriceUnit.mul(user1OfferCount + user2OfferCount)
    );
    expect(await defenDAO.getUserOffers(user2.address, offerPrice2)).to.equal(
      user2OfferCount
    );
    expect(await defenDAO.getAllOffers(offerPrice2)).to.equal(
      user1OfferCount + user2OfferCount
    );
    expect(
      await defenDAO.getOfferBalanceAddrOrdersLength(offerPrice2)
    ).to.equal(2);
    expect(await defenDAO.offerBalanceAddrOrders(offerPrice2, 1)).to.contain(
      user2.address
    );
  });

  it("Should cancel offer", async function () {
    const user1CancelCount = 1;
    const user1OfferCount = await defenDAO.getUserOffers(
      user1.address,
      offerPrice2
    );
    const user1Balance = await user1.getBalance();
    console.log("user1Balance: ", user1Balance);
    const cancelTx = await defenDAO.connect(user1).cancelOffer(offerPrice2, 1);
    const txGas = await getTxGas(cancelTx);
    expect(await user1.getBalance()).to.equal(
      user1Balance.add(offerPriceUnit.mul(user1CancelCount)).sub(txGas)
    );
    expect(await defenDAO.getUserOffers(user1.address, offerPrice2)).to.equal(
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
    // const buyer = await impersonateAddress(buyerAddress);
    // const giver = await impersonateAddress(
    //   "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
    // );
    // await giver.sendTransaction({
    //   to: buyer.address,
    //   value: ethNumToWeiBn(20),
    // });
    // const nft = ERC1155__factory.connect(NFT_CONTRACT, deployer);
    // const nft = await ethers.getContractAt("MockERC721", NFT_CONTRACT);
    // const offerCount = 10;
    // await buyer.sendTransaction({
    //   to: defenDAO.address,
    //   value: offerPriceUnit.mul(offerCount),
    // });
    // await defenDAO.connect(buyer).makeOffer(offerPrice, offerCount);
    // const balanceSumBefore = await defenDAO.offerBalanceSum(offerPrice);
    // const userBalanceBefore = await defenDAO.userOfferBalances(
    //   offerPrice,
    //   buyer.address
    // );
    // console.log("BLOCK NUMBER:", await ethers.provider.getBlockNumber());
    // console.log("NFT OWNER:", await nft.ownerOf(NFT_TOKEN_ID));
    // /* Version 1. defendao 통해서 seaport 함수콜 */
    // orderParams.offerer = defenDAO.address;
    // console.log(orderParams);
    // const executeTx = await defenDAO
    //   .connect(buyer)
    //   .execute(offerPrice, orderParams, {
    //     gasLimit: 500_000,
    //   });
    // console.log("executeTx:", executeTx);
    // expect(await defenDAO.offerBalanceSum(offerPrice)).to.equal(
    //   balanceSumBefore.sub(10)
    // );
    // expect(
    //   await defenDAO.userOfferBalances(offerPrice, buyer.address)
    // ).to.equal(userBalanceBefore.sub(10));
    // expect(await defenDAO.claimableNFTs(NFT_TOKEN_ID)).to.equal(buyer.address);
    // expect(await nft.ownerOf(NFT_TOKEN_ID)).to.equal(defenDAO.address);
    // expect(await nft.balanceOf(defenDAO.address, NFT_TOKEN_ID)).to.equal(1);

    /* Version 2. raw tx data 전송 */
    // const tx = await buyer.sendTransaction({
    //   to: SEAPORT_CONTRACT,
    //   data: "0xe7acab24000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000005a00000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000000000000000000000000000fad445029d2ba1fab6d5d3225e0f52b3ea8d812f00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000046000000000000000000000000000000000000000000000000000000000000004e0000000000000000000000000601984a2a5a910981fb8d60c4d8c00d5d49093b600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000022000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000063331aaa00000000000000000000000000000000000000000000000000000000635aa67e0000000000000000000000000000000000000000000000000000000000000000360c6ebe00000000000000000000000000000000000000000fddbc404d44c58c0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000672f466b13ee1856c32f8bd956730d8eff28bf160000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000376c1e0a7f000000000000000000000000000000000000000000000000000000376c1e0a7f000000000000000000000000000601984a2a5a910981fb8d60c4d8c00d5d49093b6000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016bcc41e9000000000000000000000000000000000000000000000000000000016bcc41e90000000000000000000000000000000a26b00c1f0df003000390027140000faa7190000000000000000000000000000000000000000000000000000000000000041049f4c88299c200e49d4d3c35ccaa2efc58cd64064ce4c173bbfe9b89aff58ea6215bd49b799caa4178b368493715623d1784c2d91fb1030578024fe3242b81c1b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    //   gasLimit: 130_000,
    //   value: ethNumToWeiBn(0.001),
    // });
    // const receipt = await tx.wait();
    // console.log("tx:", tx);
    // console.log("receipt:", receipt);

    /* Version 3. seaport contract 에 직접 전송 */
    // const seaport = await ethers.getContractAt(seaportAbi, SEAPORT_CONTRACT);
    // const tx = await seaport
    //   .connect(buyer)
    //   .fulfillAdvancedOrder(
    //     orderParams,
    //     criteriaResolvers,
    //     fulfillerConduitKey,
    //     recipient,
    //     {
    //       gasLimit: 500_000,
    //     }
    //   );
    // const receipt = await tx.wait();
    // console.log("tx:", tx);
    // console.log("receipt:", receipt);

    /* Version 3. seaport contract 에 직접 전송 */
    // const seaport = await ethers.getContractAt(seaportAbi, SEAPORT_CONTRACT);
    console.log("BLOCK NUMBER:", await ethers.provider.getBlockNumber());
    const buyer = await impersonateAddress(buyerAddress);
    const giver = await impersonateAddress(
      "0x1D7C6783328C145393e84fb47a7f7C548f5Ee28d"
    );
    await giver.sendTransaction({
      to: buyer.address,
      value: ethNumToWeiBn(1),
    });
    //await buyer
    console.log("BUYER", buyer.address);
    console.log(NFT_TOKEN_ID);
    const NFT = await ERC721__factory.connect(NFT_CONTRACT, deployer);
    console.log("NFT OWNER:", await NFT.ownerOf(NFT_TOKEN_ID));
    console.log(
      "Balance : ",
      ethers.utils.formatEther(await buyer.getBalance())
    );

    const seaport = await ISeaport__factory.connect(SEAPORT_CONTRACT, buyer);
    const tx = await seaport.fulfillBasicOrder(orderParams, {
      value: offerPrice,
      nonce: 332,
    });
    const receipt = await tx.wait();
    console.log("tx:", tx);
    console.log("receipt:", receipt);
  });

  // it("Should claim NFT", async function () {
  //   // TODO(liayoo): update this
  //   const claimerAddress = await defenDAO.claimableNFTs([tokenId]);
  //   const claimer = await impersonateAddress(claimerAddress);
  //   await defenDAO.connect(claimer).claimNFTs([tokenId]);
  //   const nft = ERC1155__factory.connect(NFT_CONTRACT, deployer);
  //   expect(await nft.balanceOf(claimerAddress, NFT_TOKEN_ID)).to.equal(1);
  // });
});
