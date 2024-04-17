const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("boilerGotchi contract", function () {
    let BoilerGotchi;
    let hardhatBoilerGotchi;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        BoilerGotchi = await ethers.getContractFactory("boilerGotchi");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatBoilerGotchi = await BoilerGotchi.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right token name and symbol", async function () {
            expect(await hardhatBoilerGotchi.name()).to.equal("BoilerGotchi");
            expect(await hardhatBoilerGotchi.symbol()).to.equal("BG");
        });
    });

    describe("Creating Gotchi", function () {
        it("Should create a Gotchi and verify its properties", async function () {
            await hardhatBoilerGotchi.connect(addr1).createGotchi("Gigacat");
            const gotchi = await hardhatBoilerGotchi.gotchis(addr1.address);
            expect(gotchi.name).to.equal("Gigacat");
            expect(gotchi.mood).to.equal(100);
            expect(gotchi.energy).to.equal(100);
            expect(gotchi.owner).to.equal(addr1.address);
        });

        it("Should prevent creating multiple Gotchis for the same owner", async function () {
            await hardhatBoilerGotchi.connect(addr1).createGotchi("Gigacat");
            await expect(hardhatBoilerGotchi.connect(addr1).createGotchi("Gigacat2")).to.be.revertedWith("You already have a gotchi");
        });
    });

    describe("Deleting Gotchi", function () {
        it("Allows owner to delete their Gotchi", async function () {
            await hardhatBoilerGotchi.connect(addr1).createGotchi("Gigacat");
            await hardhatBoilerGotchi.connect(addr1).deleteGotchi();
            const gotchi = await hardhatBoilerGotchi.gotchis(addr1.address);
            expect(gotchi.owner).to.equal(ethers.constants.AddressZero);
        });

        it("Prevents non-owners from deleting a Gotchi", async function () {
            await hardhatBoilerGotchi.connect(addr1).createGotchi("Gigacat");
            await expect(hardhatBoilerGotchi.connect(addr2).deleteGotchi()).to.be.revertedWith("You do not own a BoilerGotchi");
        });
    });

    describe("Interacting with Gotchi", function () {
        beforeEach(async function () {
            await hardhatBoilerGotchi.connect(addr1).createGotchi("Gigacat");
        });

        it("Should feed the Gotchi and increase its energy and mood", async function () {
            await hardhatBoilerGotchi.connect(addr1).feedBoilerGotchi();
            const gotchi = await hardhatBoilerGotchi.gotchis(addr1.address);
            expect(gotchi.energy).to.be.greaterThan(100);
            expect(gotchi.mood).to.be.greaterThan(100);
        });

        it("Should play with the Gotchi and decrease energy", async function () {
            await hardhatBoilerGotchi.connect(addr1).playBoilerGotchi();
            const gotchi = await hardhatBoilerGotchi.gotchis(addr1.address);
            expect(gotchi.energy).to.be.lessThan(100);
        });

        it("Should handle mood changes correctly", async function () {
            await hardhatBoilerGotchi.connect(addr1).playBoilerGotchi();
            const status = await hardhatBoilerGotchi.connect(addr1).checkStatus();
            expect(status).to.include("Mood");
        });
    });
});
