import { ethers } from "hardhat";

export async function deployContract() {

  const Crylot = await ethers.getContractFactory("Crylot");
  const lock = await Crylot.deploy();

  return lock.deployed();
}

async function main() {
  await deployContract();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});