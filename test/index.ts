import { expect } from "chai";
import { ethers } from "hardhat";
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import { RayOfLight } from "../typechain";

const provider = new MockProvider({
  ganacheOptions: {
    accounts: [{balance: 1000000000000000000000000, secretKey: '0x7f109a9e3b0d8ecfba9cc23a3614433ce0fa7ddcc80f2a8f10b222179a5a80d6'}, {balance: 50000, secretKey: '0x6ec1f2e7d126a74a1d2ff9e1c5d90b92378c725e506651ff8bb8616a5c724628'}]
  }
});

describe("RayOfLight", function () {
  const [wallet, minterWallet, buyerWallet] = provider.getWallets();
  let rayOfLight: RayOfLight
  beforeEach(async () => {
    const RayOfLight = await ethers.getContractFactory("RayOfLight", wallet);
    rayOfLight = await RayOfLight.deploy(1000);
    await rayOfLight.deployed()
  });

  it("Should deploy ray of light and mint the first ray", async function () { 
    // rayOfLight.mintHigherRay()
    console.log(await rayOfLight.mintHigherRay(minterWallet.address, {gasLimit: 100000, value: 1000}))
    console.log(await )
  });
});
