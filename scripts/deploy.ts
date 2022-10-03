import { ethers } from "hardhat";

const GOERLI_SETTINGS = {
  keyHash:"0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
  vrfConsumer:"0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
  subscriptionId:3330
}
const MAINNET_SETTINGS = {
  keyHash:"0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef",
  vrfConsumer:"0x271682DEB8C4E0901D1a1550aD2e64D568E69909",
  subscriptionId:3330
}

export async function deployContract() {

  const prod = false;
  const settings = prod ? MAINNET_SETTINGS : GOERLI_SETTINGS
  const { keyHash, vrfConsumer, subscriptionId } = settings

  const Crylot = await ethers.getContractFactory("Crylot");
  const lock = await Crylot.deploy(keyHash, vrfConsumer, subscriptionId);

  console.log("Contract deployed to: " + lock.address)
  return lock.deployed();
}

async function main() {
  await deployContract();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});