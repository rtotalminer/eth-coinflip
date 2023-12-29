import { BigNumberish } from "ethers";

export function formatNaN(input: number | BigNumberish) {
  return (isNaN(Number(input)) ? 0 : Number(input));
}