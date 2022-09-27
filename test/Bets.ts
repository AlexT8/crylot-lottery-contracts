import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { deployContract } from "../scripts/deploy";
const getContract = () => loadFixture(deployContract);

describe("Bets", function () {

    describe("MIN bet", () => {
      it("Should get MIN bet", async function () {
        const contract = await getContract()
  
        const bet = ethers.utils.parseEther("0.005")
        const minBet = await contract.getMinBet()
  
        expect(bet).to.be.equal(minBet)
      });

      it("Should set MIN bet", async function () {
        const contract = await getContract()
        
        const newMinBet = ethers.utils.parseEther("0.1")
        await contract.setMinBet(newMinBet)

        const actualBet = await contract.getMinBet()
  
        expect(newMinBet).to.be.equal(actualBet)
      });

      it("Should NOT set MIN bet to 0", async function () {
        const contract = await getContract()
        
        const newMinBet = ethers.utils.parseEther("0")

        await expect(contract.setMinBet(newMinBet)).to.be.revertedWith("The minimum bet must be higher than 0")
      });
    })

    describe("Max bet", () => {
      it("Should get MAX bet", async function () {
        const contract = await getContract()
  
        const bet = ethers.utils.parseEther("0.01")
        const maxBet = await contract.getMaxBet()
  
        expect(bet).to.be.equal(maxBet)
      });

      it("Should set MAX bet", async function () {
        const contract = await getContract()
        
        const newMaxBet = ethers.utils.parseEther("0.1")
        await contract.setMaxBet(newMaxBet)

        const actualBet = await contract.getMaxBet()
  
        expect(newMaxBet).to.be.equal(actualBet)
      });

      it("Should NOT set MAX bet to 0", async function () {
        const contract = await getContract()
        
        const newMaxBet = ethers.utils.parseEther("0")

        await expect(contract.setMaxBet(newMaxBet)).to.be.revertedWith("The maximum bet must be higher than 0")
      });
    })
});
