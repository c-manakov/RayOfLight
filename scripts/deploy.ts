// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  let proxyRegistryAddress
  proxyRegistryAddress = "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A";
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const RayOfLight = await ethers.getContractFactory("RayOfLight");
  const rayOfLight = await RayOfLight.deploy(proxyRegistryAddress);
  await rayOfLight.deployed();

  const RayOfLightFactory = await ethers.getContractFactory("RayOfLightFactory")
  const rayOfLightFactory = await RayOfLightFactory.deploy(proxyRegistryAddress, rayOfLight.address)
  await rayOfLightFactory.deployed()

  await rayOfLight.transferOwnership(rayOfLightFactory.address);


  console.log("Factory deployed to:", rayOfLightFactory.address);
  console.log("Contract deployed to:", rayOfLight.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
