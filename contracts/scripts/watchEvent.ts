/* eslint-disable camelcase */
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, userConfig } from "hardhat";
import {
  MockERC721__factory,
  TestDefenDAOFactory__factory,
  TestDefenDAO__factory,
} from "../typechain";
import { SEAPORT_CONTRACT } from "../test/data/optimism_success_721";
import { EtherscanProvider } from "@ethersproject/providers";
import { string } from "hardhat/internal/core/params/argumentTypes";

const collectionAddr = "0x3aE88bed7Ee6D8be8631e687F7AC217FBc44C4b2";

async function main() {
  const [deployer] = await ethers.getSigners();
  const defenDAO = await TestDefenDAO__factory.connect(
    collectionAddr,
    deployer
  );

  const filter = defenDAO.filters.MadeOffer();

  ethers.provider.on(filter, (data) => {
    console.log(data);
    console.log("USER", data.topics[1]);
    console.log("PRICE", ethers.utils.formatEther(data.topics[2]));
    console.log("offerCount", data.topics[3]);
    // do whatever you want here
    // I'm pretty sure this returns a promise, so don't forget to resolve it
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
