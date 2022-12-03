import { ethers } from "hardhat";

export const ethNumToWeiBn = (eth: number) =>
  ethers.utils.parseEther(eth.toString());
