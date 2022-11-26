import { ethers } from "hardhat";

export const stringifyNestedObject = (obj: object): string => {
  return (
    "[" +
    Object.values(obj)
      .map((x) => {
        if (Array.isArray(x)) {
          return "[" + x.map((y) => stringifyNestedObject(y)).join(",") + "]";
        }
        if (ethers.BigNumber.isBigNumber(x)) {
          return `"${x.toString()}"`;
        }
        if (typeof x === "object") {
          return stringifyNestedObject(x);
        }
        return `"${x}"`;
      })
      .join(",") +
    "]"
  );
};
