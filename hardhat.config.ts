import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import 'solidity-docgen';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const MUMBAI_ACCOUNTS = ['22ac439a4a804792e83ac0e2a9323ef6b5e97545aad85618561ae01f53273f8f', 'd246d2dad3be669c727dd8be44730f199baa34bd2f8bc9ca4bd349c696cd0e66', '720e1dda3ebb6398494f4504f1b2e01a1c753676d1e1966c861d56701b21153e', '660a2de92cf50531819b2e0f6a9445cc57fc613d6362886ad284bef684fb5768']
const RINKEBY_PRIVATE_KEY = '22ac439a4a804792e83ac0e2a9323ef6b5e97545aad85618561ae01f53273f8f'

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [process.env.PRIVATE_KEY || RINKEBY_PRIVATE_KEY]
    },
    mumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com',
      accounts: MUMBAI_ACCOUNTS
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
