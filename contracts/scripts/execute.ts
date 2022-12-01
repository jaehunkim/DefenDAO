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
  ERC721__factory,
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
  criteriaResolvers,
  fulfillerConduitKey,
  recipient,
  txData,
} from "./data/optimism_success_721";
import seaportAbi from "../abis/seaport11.json";

const collectionAddr = "0x3aE88bed7Ee6D8be8631e687F7AC217FBc44C4b2";

const impersonateAddress = (address: string) => {
  return ethers.getImpersonatedSigner(address);
};

async function main() {
  const [deployer, seller, user1, user2] = await ethers.getSigners();
  const defenDAO = await TestDefenDAO__factory.connect(
    collectionAddr,
    deployer
  );

  const seaport = await ethers.getContractAt(seaportAbi, SEAPORT_CONTRACT);
  const offerer = await impersonateAddress(orderParams.parameters.offerer);
  const erc721 = ERC721__factory.connect(NFT_CONTRACT, deployer);

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

  const executeTx = await defenDAO
    .connect(deployer)
    .execute(offerPrice, orderParams, criteriaResolvers, fulfillerConduitKey, {
      gasLimit: 500_000,
    });
  console.log("executeTx:", executeTx);
  console.log("NFT OWNER:", await erc721.ownerOf(NFT_TOKEN_ID));
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
  console.log(
    "await erc721.ownerOf(NFT_TOKEN_ID): ",
    await erc721.ownerOf(NFT_TOKEN_ID)
  );
  const claimerAddress = await defenDAO.claimableNFTs(NFT_TOKEN_ID);
  console.log("claimerAddress: ", claimerAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
