// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";

const CONTRACT_ADDRESS = '0xd09188c6328018B4a9892DB112E473db76647E4d'

const getTokenId = async (result: ContractTransaction) => {
  const finishedTransaction: ContractReceipt = await result.wait()
  console.log(finishedTransaction)
  const transferEvent: any = finishedTransaction.events && finishedTransaction.events.find(it => it.event === 'Transfer')
  const [add1, add2, tokenId]: any = transferEvent.args
  return tokenId
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [deployer, minterWallet, buyerWallet] = await ethers.getSigners();

  console.log("Deployer account balance:", (await deployer.getBalance()).toString());

  const rayOfLight = await ethers.getContractAt("RayOfLight", CONTRACT_ADDRESS);

  console.log(`Minting a new ray from ${minterWallet.address}`)
  const result = await rayOfLight.mintHigherRay(minterWallet.address, { gasLimit: 10000000, value: 1000 })
  console.log(result)
  const tokenId = await getTokenId(result)

  console.log(`Minted token id: ${tokenId}`)

  console.log(`Setting current price to 2000 and making purchasable`)
  await (await rayOfLight.connect(minterWallet).setCurrentPrice(tokenId, 2000, { gasLimit: 100000 })).wait()
  await (await rayOfLight.connect(minterWallet).makePurchasable(tokenId, { gasLimit: 100000 })).wait()

  const deployerBalanceBeforeCommission = await deployer.getBalance()
  console.log(`Deployer balance before purchase: ${deployerBalanceBeforeCommission}`)
  const priceWithCommission = await rayOfLight.connect(minterWallet).getCurrentPriceWithCommission(tokenId)
  const minterBalanceBeforePurchase = await minterWallet.getBalance()
  console.log(`Minter balance before purchase: ${deployerBalanceBeforeCommission}`)

  console.log(`Purchasing the token from ${buyerWallet.address}`)
  await (await rayOfLight.connect(buyerWallet).purchase(tokenId, { gasLimit: 100000, value: priceWithCommission })).wait()
  const minterBalanceAfterPurchase = await minterWallet.getBalance()
  console.log(`Minter balance after purchase: ${minterBalanceAfterPurchase}`)

  const deployerBalanceAfterCommission = await deployer.getBalance()
  const ownerOfToken = await rayOfLight.ownerOf(tokenId)

  expect(buyerWallet.address == ownerOfToken).to.equal(true)

  const walletBalance = await rayOfLight.balanceOf(buyerWallet.address)

  expect(walletBalance).to.equal(BigNumber.from("1"))

  expect(deployerBalanceAfterCommission.sub(deployerBalanceBeforeCommission)).to.equal(BigNumber.from("100"))
  expect(minterBalanceAfterPurchase.sub(minterBalanceBeforePurchase)).to.equal(BigNumber.from("2000"))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
