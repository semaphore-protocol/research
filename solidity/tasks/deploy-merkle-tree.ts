import { task, types } from "hardhat/config"

task("deploy:merkle-tree-test", "Deploy a MerkleTreeTest contract")
  .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
  .setAction(async ({ logs }, { ethers }): Promise<any> => {
    const PoseidonLibFactory = await ethers.getContractFactory("PoseidonT3")
    const poseidonLib = await PoseidonLibFactory.deploy()

    await poseidonLib.deployed()

    if (logs) {
      console.info(
        `PoseidonT3 library has been deployed to: ${poseidonLib.address}`
      )
    }

    const MerkleTreeLibFactory = await ethers.getContractFactory("MerkleTree", {
      libraries: {
        PoseidonT3: poseidonLib.address
      }
    })
    const merkleTreeLib = await MerkleTreeLibFactory.deploy()

    await merkleTreeLib.deployed()

    if (logs) {
      console.info(
        `MerkleTree library has been deployed to: ${merkleTreeLib.address}`
      )
    }

    const ContractFactory = await ethers.getContractFactory("MerkleTreeTest", {
      libraries: {
        MerkleTree: merkleTreeLib.address
      }
    })

    const contract = await ContractFactory.deploy()

    await contract.deployed()

    if (logs) {
      console.info(`Test contract has been deployed to: ${contract.address}`)
    }

    return {
      library: merkleTreeLib,
      contract
    }
  })
