const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // Getting a previously deployed contract
 // const DaiContractPolygon = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";

  await deploy("Dai", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [  DaiContract.address ],
    log: true,
  });

//  const dc = await ethers.getContract("Dai", deployer);
//  await dc.mint("0x780f3f68B50d2a684400ceA16C8f379041Ce3ECC", ethers.utils.parseEther("50000"));
};
module.exports.tags = ["Dai"];
