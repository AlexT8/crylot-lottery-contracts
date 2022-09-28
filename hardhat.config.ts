import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    development: {
      url: "http://127.0.0.1:7545",     // Localhost (default: none)
      // @ts-ignore
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*"        // Any network (default: none)
     }
  }
};

export default config;
