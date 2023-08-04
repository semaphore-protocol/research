import { task, types } from "hardhat/config"

task("deploy:binary-merkle-tree-test", "Deploy a BinaryMerkleTreeTest contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<any> => {
        const PoseidonLibFactory = await ethers.getContractFactory("PoseidonT3")
        const poseidonLib = await PoseidonLibFactory.deploy()

        await poseidonLib.deployed()

        if (logs) {
            console.info(`PoseidonT3 library has been deployed to: ${poseidonLib.address}`)
        }

        const BinaryMerkleTreeLibFactory = await ethers.getContractFactory("BinaryMerkleTree", {
            libraries: {
                PoseidonT3: poseidonLib.address
            }
        })
        const binaryMerkleTreeLib = await BinaryMerkleTreeLibFactory.deploy()

        await binaryMerkleTreeLib.deployed()

        if (logs) {
            console.info(`BinaryMerkleTree library has been deployed to: ${binaryMerkleTreeLib.address}`)
        }

        const ContractFactory = await ethers.getContractFactory("BinaryMerkleTreeTest", {
            libraries: {
                BinaryMerkleTree: binaryMerkleTreeLib.address
            }
        })

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        if (logs) {
            console.info(`BinaryMerkleTreeTest contract has been deployed to: ${contract.address}`)
        }

        return {
            library: binaryMerkleTreeLib,
            contract
        }
    })
