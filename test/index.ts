import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import { RayOfLight } from "../typechain";
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import { assert } from "console";

const getTokenId = async (result: ContractTransaction) => {
  const finishedTransaction: ContractReceipt = await result.wait()
  const [add1, add2, tokenId]: any = finishedTransaction.events && finishedTransaction.events[0] && finishedTransaction.events[0].args
  return tokenId
}

const provider = new MockProvider({
  ganacheOptions: {
    accounts: [{ balance: 1000000000000000000000000, secretKey: '0x7f109a9e3b0d8ecfba9cc23a3614433ce0fa7ddcc80f2a8f10b222179a5a80d6' }, { balance: 1000000000000000000000000, secretKey: '0x6ec1f2e7d126a74a1d2ff9e1c5d90b92378c725e506651ff8bb8616a5c724628' }, { balance: 1000000000000000000000000, secretKey: '0x6ec1f2e7d126a74a1d2ff9e1c5d90b92378c725e506651ff8bb8616a5c724628' }]
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
    const result = await rayOfLight.mintHigherRay(minterWallet.address, { gasLimit: 100000, value: 1000 })
    const tokenId = await getTokenId(result)
    expect(tokenId == BigNumber.from("1"))
    const result2 = await rayOfLight.mintHigherRay(minterWallet.address, { gasLimit: 100000, value: 1000 })
    const tokenId2 = await getTokenId(result2)
    expect(tokenId2 == BigNumber.from("2"))
  });

  it("Should purchase a minted ray", async function () {
    const result = await rayOfLight.mintHigherRay(minterWallet.address, { gasLimit: 100000, value: 1000 })
    const tokenId = await getTokenId(result)

    await (await rayOfLight.connect(minterWallet).setCurrentPrice(tokenId, 2000, { gasLimit: 100000 })).wait()
    await (await rayOfLight.connect(minterWallet).makePurchasable(tokenId, { gasLimit: 100000 })).wait()

    const balanceBeforeCommission = await wallet.getBalance()
    console.log('kek')
    const priceWithCommission = await rayOfLight.connect(minterWallet).getCurrentPrice(tokenId, {gasLimit: 10000})
    console.log('kek')
    console.log(priceWithCommission)
    await (await rayOfLight.connect(buyerWallet).purchase(tokenId, { gasLimit: 100000, value: priceWithCommission })).wait()

    const ownerOfToken = await rayOfLight.ownerOf(tokenId)

    expect(buyerWallet.address == ownerOfToken)

    const walletBalance = await rayOfLight.balanceOf(buyerWallet.address)
    
    expect(walletBalance == BigNumber.from("1"))

    const balanceAfterCommission = await wallet.getBalance()
    assert(balanceBeforeCommission.sub(balanceAfterCommission) == BigNumber.from("100"))
  })
});
