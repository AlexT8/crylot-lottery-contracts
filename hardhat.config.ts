import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from 'dotenv'
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    development: {
      url: "http://127.0.0.1:7545",     // Localhost (default: none)
    },
    goerli: {
    url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.SIGNER_PRIVATE_KEY || ''] // add the account that will deploy the contract (private key)
    }
  }
};

export default config;
