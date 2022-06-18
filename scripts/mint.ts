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

  const rayOfLight = await ethers.getContractAt("RayOfLight", '0x174446CE452CE759318fDC2841Fe6DECc25D2a71')

  const result = await rayOfLight.connect(minter).mintHigherRay(minter.address, { gasLimit: 1000000, value: 1000 })
  console.log(result)

  console.log(await minter.getBalance())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
