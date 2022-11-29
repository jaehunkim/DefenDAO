import { ethers } from "hardhat";

export const ethStrToWeiBn = (eth: string) => ethers.utils.parseEther(eth);
