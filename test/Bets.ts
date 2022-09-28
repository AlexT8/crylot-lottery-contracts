import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { deployContract } from "../scripts/deploy";
const getContract = () => loadFixture(deployContract);

describe("Bets", function () {

    describe("Min bet", () => {
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
  
        const bet = ethers.utils.parseEther("0.05")
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

      it("Should NOT set MAX bet lower than min bet", async function () {
        const contract = await getContract()
        
        const newMaxBet = ethers.utils.parseEther("0")

        await expect(contract.setMaxBet(newMaxBet)).to.be.revertedWith("The maximum bet must be higher than the minimum bet")
      });
      
    })
});

describe("Ownable", () => {
  it("Should NOT set MIN bet if is not an admin", async () => {
    const contract = await getContract()

    const newMin = ethers.utils.parseEther("0.0001")
    const [_owner, other] = await ethers.getSigners()

    await expect(contract.connect(other).setMinBet(newMin)).to.be.revertedWith("You are not an admin")

  })

  it("Should NOT set MAX bet if is not an admin", async () => {
    const contract = await getContract()

    const newMaxBet = ethers.utils.parseEther("0.0001")
    const [_owner, other] = await ethers.getSigners()

    await expect(contract.connect(other).setMaxBet(newMaxBet)).to.be.revertedWith("You are not an admin")

  })
})

describe("Settings", () => {
  it("Should pause the lottery", async () => {
    const contract = await getContract()

    await contract.setPaused(true)

    expect(await contract.isInPause()).to.be.true
  })

  it("Should revert if NOT owner is pausing", async () => {
    const contract = await getContract()
    const [_owner, other] = await ethers.getSigners()


    await expect(contract.connect(other).setPaused(true)).to.be.revertedWith("Ownable: caller is not the owner")
  })
})

describe("Bet", () => {
  it("Should bet if is not paused", async () => {
    const contract = await getContract()
    const bet = ethers.utils.parseEther("0.008")

    await expect(contract.bet(15, 1, {value:bet})).to.be.eventually.ok
  })

  it("Should NOT bet if IS paused", async () => {
    const contract = await getContract()
    const bet = ethers.utils.parseEther("0.01")

    await contract.setPaused(true)

    await expect(contract.bet(15, 1, {value:bet})).to.be.revertedWith("The game is paused")
  })

  it("Bet should be higher than minimum bet", async () => {
    const contract = await getContract()
    const bet = ethers.utils.parseEther("0.01")

    await expect(contract.bet(15, 1, {value:bet})).to.be.eventually.ok
  })

  it("Should revert if bet is lower than minimum", async () => {
    const contract = await getContract()
    const bet = ethers.utils.parseEther("0")

    await expect(contract.bet(15, 1, {value:bet})).to.be.revertedWith("The bet must be higher or equal than min bet")
  })

  it("Bet should be lower than maximum bet", async () => {
    const contract = await getContract()
    const bet = ethers.utils.parseEther("0.01")

    await expect(contract.bet(15, 1, {value:bet})).to.be.eventually.ok
  })

  it("Should revert if bet is higher than maximum", async () => {
    const contract = await getContract()
    const bet = ethers.utils.parseEther("0.1")

    await expect(contract.bet(15, 1, {value:bet})).to.be.revertedWith("The bet must be lower or equal than max bet")
  })

  it("Should count 5 bets", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.01")

    for(let i = 0; i<5;i++){
      await contract.bet(15, 1, {value:bet})
    }

    expect(await contract.getTotalBets()).to.be.equal(5)
  })

  it("Should increase balance", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.01")

    for(let i = 0; i<10;i++){
      await contract.bet(15, 1, {value:bet})
    }

    expect(await contract.getBalance()).to.be.equal(ethers.utils.parseEther("0.1"))
  })

  it("Should increase balance without user funds", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.01")

    await contract.bet(15, 1, {value:bet})

    expect(await contract.getFunds()).to.be.equal(ethers.utils.parseEther("0"))
  })

  it("Should save 7x user bet", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.04")

    await contract.bet(5, 0, {value:bet})

    expect(await contract.getFunds()).to.be.equal(ethers.utils.parseEther("0.28"))
  })

  it("Should save 35x user bet", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.04")

    await contract.bet(5, 1, {value:bet})

    expect(await contract.getFunds()).to.be.equal(ethers.utils.parseEther("1.4"))
  })

  it("Should save 70x user bet", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.04")

    await contract.bet(5, 2, {value:bet})

    expect(await contract.getFunds()).to.be.equal(ethers.utils.parseEther("2.8"))
  })

  it("Should revert if bet is out of categorie", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.04")

    await expect(contract.bet(5, 3, {value:bet})).to.be.revertedWith("The categorie must be lower than 3")
  })
  
})

describe("Withdraw", () => {
  it("Should withdraw user funds", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.04")

    for(let i = 0; i < 40; i++){
      await contract.bet(1, 1, {value:bet})
    }

    await contract.bet(5, 1, {value:bet})

    await contract.withdrawUserFunds()

    expect(await contract.getBalance()).to.be.equal(ethers.utils.parseEther("0.24"))
  })

  it("Should revert if user funds = 0", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.04")

    await contract.bet(4, 1, {value:bet})

    await expect(contract.withdrawUserFunds()).to.be.revertedWith("You do not have any funds")
  })

  it("Should revert if contract has no liquidity", async () => {
    const contract = await getContract()

    const bet = ethers.utils.parseEther("0.04")

    await contract.bet(5, 1, {value:bet})

    await expect(contract.withdrawUserFunds()).to.be.revertedWith("The contract has no liquidity")
  })
})