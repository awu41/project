const { expect } = require("chai");
const { ethers } = require("hardhat");


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
  });

  describe("Gameplay Functions", function () {
    it("Should update mood and energy when playing with Gotchi", async function () {
      await boilerGotchi.connect(addr1).createGotchi("Pete");
      await boilerGotchi.connect(addr1).playBoilerGotchi();
      const gotchi = await boilerGotchi.gotchis(addr1.address);
      expect(gotchi.mood.toNumber()).to.equal(101);
      expect(gotchi.energy.toNumber()).to.equal(99);
    });
  });
});
