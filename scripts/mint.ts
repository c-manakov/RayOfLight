import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [minter] = await ethers.getSigners();

  const rayOfLight = await ethers.getContractAt("RayOfLight", '0xa71fa4Af2A3273609d79883ADb31b872520a1983')

  await rayOfLight.connect(minter).mintHigherRay(minter.address, { gasLimit: 100000, value: 1000 })

  console.log("Greeter deployed to:", rayOfLight.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
