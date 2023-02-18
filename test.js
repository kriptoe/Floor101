const hre = require("hardhat");
const { ethers } = hre;
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("🚩 FLOOR 101 Testing", function () {

  this.timeout(120000);

  let stakerContract;
  let marketContract;
  let daiContract;
  let floorContract;
  //console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

  describe("Dai deployment", function () {

    let contractArtifact;
    if (process.env.CONTRACT_ADDRESS) {
      contractArtifact = `contracts/${process.env.CONTRACT_ADDRESS}.sol:Dai`
    } else {
      contractArtifact = "contracts/Staker.sol:Dai";
    }

    it("Should deploy Dai contract ", async function () {
      const ExampleExternalContract = await ethers.getContractFactory("Dai");
      daiContract = await ExampleExternalContract.deploy();
      console.log('\t',"🛰  Dai Contract contract deployed on", daiContract.address)
    });

    it("Should deploy Marketplace contract ", async function () {
      const ExampleExternalContract = await ethers.getContractFactory("Marketplace");
      marketContract = await ExampleExternalContract.deploy(daiContract.address);
      console.log('\t',"🛰  Marketplace Contract deployed on ", marketContract.address)
    });

    it("Should deploy Floor101 contract ", async function () {
      const ExampleExternalContract = await ethers.getContractFactory("Floor101");
      floorContract = await ExampleExternalContract.deploy(daiContract.address , marketContract.address );
      console.log('\t',"🛰  Floor101 Contract deployed on ", floorContract.address)
    }); 



    describe(" Test Dai mint ", function () {
      it("Check mint() function works", async function () {
        const [ owner ] = await ethers.getSigners();
        console.log('\t'," 🧑 Tester Address: ", owner.address)
        await daiContract.mint(owner.address, ethers.utils.parseEther("500") )
        const stakeResult = await daiContract.balanceOf(owner.address) + ""
        console.log ("stake result ", stakeResult)
       expect(stakeResult).to.equal("50000000000000000000000", "Error owner should have 500 dai"); 
      })
    })

    describe(" Test NFT dai approval ", function () {
      it("Check NFT approval function works", async function () {
        const [ owner ] = await ethers.getSigners();
        await daiContract.approve(owner.address, ethers.utils.parseEther("5000") )
        console.log('\t',"🛰  Floor101 Contract approved to spend dai on address ", owner.address) 
      })
    })
/*
    describe(" Get listing fee function", function () {
      it("Check getListingFee() function returns ", async function () {
        const [ owner ] = await ethers.getSigners();

        console.log('\t'," 🧑 Tester Address: ", owner.address)

        const startingBalance = await marketContract.getListingFee()
        console.log('\t'," 💰 Listing fee is : ",startingBalance.toNumber())
        expect(startingBalance.toNumber()).to.equal(600000000000000, "Error listing fee should equal 600000000000000"); 
      })
    })
    */    

  });
});
