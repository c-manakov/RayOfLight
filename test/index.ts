import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import { RayOfLight, RayOfLightFactory } from "../typechain";

// const getTokenId = async (result: ContractTransaction) => {
//   const finishedTransaction: ContractReceipt = await result.wait()
//   const [add1, add2, tokenId]: any = finishedTransaction.events && finishedTransaction.events[0] && finishedTransaction.events[0].args
//   return tokenId
// }

const provider = new MockProvider({
  ganacheOptions: {
    accounts: [{ balance: 1000000000000000000000000, secretKey: '0x7f109a9e3b0d8ecfba9cc23a3614433ce0fa7ddcc80f2a8f10b222179a5a80d6' }, { balance: 1000000000000000000000, secretKey: '0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f' }, { balance: 1000000000000000000000000, secretKey: '0x6ec1f2e7d126a74a1d2ff9e1c5d90b92378c725e506651ff8bb8616a5c724628' }]
  }
});

describe("RayOfLight", function() {
  const [wallet, minterWallet, buyerWallet] = provider.getWallets();
  let rayOfLight: RayOfLight
  let rayOfLightFactory: RayOfLightFactory
  beforeEach(async () => {
    const proxyRegistryAddress = "0x1E525EEAF261cA41b809884CBDE9DD9E1619573A";
    const RayOfLight = await ethers.getContractFactory("RayOfLight");
    rayOfLight = await RayOfLight.deploy(proxyRegistryAddress);
    await rayOfLight.deployed();

    const RayOfLightFactory = await ethers.getContractFactory("RayOfLightFactory")
    rayOfLightFactory = await RayOfLightFactory.deploy(proxyRegistryAddress, rayOfLight.address)
    await rayOfLightFactory.deployed()

    await rayOfLight.transferOwnership(rayOfLightFactory.address);
  });

  it("Should display correct token_uri", async function() {
    expect(await rayOfLightFactory.tokenURI("0")).to.equal("https://ray-of-light-test-storj.s3.filebase.com/factory/0.json")
  });

  it("Should mint a new rayOfLight", async function () {
    
  })

  // it("Should purchase a minted ray", async function() {
  //   const result = await rayOfLight.mintHigherRay(minterWallet.address, { gasLimit: 1000000, value: 1000 })
  //   const tokenId = await getTokenId(result)
  //   const tokenURI = await rayOfLight.tokenURI(tokenId)

  //   const metadata = await axios.get(tokenURI)
  //   expect(metadata.headers['content-type']).to.equal('application/json')
  //   expect(metadata.data).to.haveOwnProperty('description')
  //   console.log(metadata)

  //   await (await rayOfLight.connect(minterWallet).setCurrentPrice(tokenId, 2000, { gasLimit: 1000000 })).wait()
  //   await (await rayOfLight.connect(minterWallet).makePurchasable(tokenId, { gasLimit: 1000000 })).wait()

  //   const creatorBalanceBeforeCommission = await wallet.getBalance()
  //   const priceWithCommission = await rayOfLight.connect(minterWallet).getCurrentPriceWithCommission(tokenId)
  //   const minterBalanceBeforePurchase = await minterWallet.getBalance()
  //   await (await rayOfLight.connect(buyerWallet).purchase(tokenId, { gasLimit: 1000000, value: priceWithCommission })).wait()
  //   const minterBalanceAfterPurchase = await minterWallet.getBalance()

  //   const creatorBalanceAfterCommission = await wallet.getBalance()
  //   const ownerOfToken = await rayOfLight.ownerOf(tokenId)

  //   expect(buyerWallet.address == ownerOfToken).to.equal(true)

  //   const walletBalance = await rayOfLight.balanceOf(buyerWallet.address)

  //   expect(walletBalance).to.equal(BigNumber.from("1"))

  //   console.log(minterBalanceBeforePurchase)
  //   console.log(minterBalanceAfterPurchase)
  //   expect(creatorBalanceAfterCommission.sub(creatorBalanceBeforeCommission)).to.equal(BigNumber.from("100"))
  //   expect(minterBalanceAfterPurchase.sub(minterBalanceBeforePurchase)).to.equal(BigNumber.from("2000"))
  // })
});
