import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from 'dotenv'
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    development: {
      url: "http://127.0.0.1:7545",     // Localhost (default: none)
      // @ts-ignore
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*"        // Any network (default: none)
    },
    goerli: {
    url: `https://goerli.infura.io/v3/${process.env.INFURA_APIKEY}`, //Infura url with projectId
      accounts: [process.env.SIGNER_PRIVATE_KEY || ''] // add the account that will deploy the contract (private key)
    }
  }
};

export default config;
