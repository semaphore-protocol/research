import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "./tasks/deploy-merkle-tree"
import "./tasks/deploy-binary-merkle-tree"

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS === "true"
  }
}

export default config
