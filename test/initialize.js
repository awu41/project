const { expect } = require("chai");
const { ethers } = require("hardhat");
const { use } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

const STARTENERGY = 100;
const STARTMOOD = 100;

describe("BoilerGotchi Contract", function () {
  let BoilerGotchi;
  let boilerGotchi;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    BoilerGotchi = await ethers.getContractFactory("boilerGotchi");
    boilerGotchi = await BoilerGotchi.deploy();
  });

  describe("Deployment", function () {
    it("Should deploy with the correct ERC721 name and symbol", async function () {
      expect(await boilerGotchi.name()).to.equal("BoilerGotchi");
      expect(await boilerGotchi.symbol()).to.equal("BG");
    });
  });

  describe("Gotchi Management", function () {
    it("Should create a new Gotchi with correct initial values", async function () {
      await boilerGotchi.connect(addr1).createGotchi("Pete");
      const gotchi = await boilerGotchi.gotchis(addr1.address);
      expect(gotchi.name).to.equal("Pete");
      expect(gotchi.mood.toNumber()).to.equal(STARTENERGY);
      expect(gotchi.energy.toNumber()).to.equal(STARTMOOD);
    });

    it("Should allow the owner to delete their Gotchi", async function () {
      await boilerGotchi.connect(addr1).createGotchi("Pete");
      await boilerGotchi.connect(addr1).deleteGotchi();
      const gotchi = await boilerGotchi.gotchis(addr1.address);
      expect(gotchi.owner).to.equal(ethers.constants.AddressZero);
    });

    it("Shouldn't allow the owner to create a Gotchi if they already have one", async function () {
      await boilerGotchi.connect(addr1).createGotchi("Pete");
      await expect(boilerGotchi.connect(addr1).createGotchi("Purdue")).to.be.revertedWith("You already have a gotchi");
    });

    it("Shouldn't allow the owner to create a Gotchi no name is given", async function () {
      await expect(boilerGotchi.connect(addr1).createGotchi("")).to.be.revertedWith("Name should not be empty");
    });  

    it("Shouldn't deletion of a gotchi if owner doesn't have one", async function () {
        await expect(boilerGotchi.connect(addr1).deleteGotchi()).to.be.revertedWith("You do not own a BoilerGotchi");
    });    
  });

  describe("Gameplay Functions", function () {
    it("Should update mood and energy when playing with Gotchi", async function () {
      await boilerGotchi.connect(addr1).createGotchi("Pete");
      await boilerGotchi.connect(addr1).playBoilerGotchi();
      const gotchi = await boilerGotchi.gotchis(addr1.address);
      expect(gotchi.mood.toNumber()).to.equal(101);
      expect(gotchi.energy.toNumber()).to.equal(99);
    });

    it("Should return false for isSuicidal if Gotchi has just been created", async function () {
        await boilerGotchi.connect(addr1).createGotchi("Pete");
        expect(await boilerGotchi.connect(addr1).checkSuicidal()).to.equal(false);
    });
    
    it("Should return true for isSuicidal if Gotchi not played with for over 365 days", async function () {
        await boilerGotchi.connect(addr1).createGotchi("Pete");
        await network.provider.send("evm_increaseTime", [365 * 24 * 60 * 60 + 1]); // advance time by more than 365 days
        await network.provider.send("evm_mine"); // mine the next block to ensure the timestamp is updated
        expect(await boilerGotchi.connect(addr1).checkSuicidal()).to.equal(true);
      });
    
    it("Should return false for isSuicidal if Gotchi played with recently", async function () {
    await boilerGotchi.connect(addr1).createGotchi("Pete");
    await network.provider.send("evm_increaseTime", [365 * 24 * 60 * 60 + 1]); // less than 365 days
    await network.provider.send("evm_mine");
    await boilerGotchi.connect(addr1).playBoilerGotchi();
    expect(await boilerGotchi.connect(addr1).checkSuicidal()).to.equal(false);
    });

    it("Shouldn't allow you to play with a gotchi if it has no energy", async function () {
        await boilerGotchi.connect(addr1).createGotchi("Pete");
        await boilerGotchi.connect(addr1).setBoilergotchiEnergyPoints(0);
        await expect(boilerGotchi.connect(addr1).playBoilerGotchi()).to.be.revertedWith("Your gotchi has no energy");
    });    

  });
});
