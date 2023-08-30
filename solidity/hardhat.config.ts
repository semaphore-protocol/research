import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "./tasks/deploy-merkle-tree"
import "./tasks/deploy-binary-merkle-tree"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS === "true"
    // outputFile: "newIncrementalMerkleTree.txt",
    // noColors: true
  }
}

export default config
