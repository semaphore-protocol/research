import { expect } from "chai"
import { Contract } from "ethers"
import { ethers, run } from "hardhat"
import { createTree } from "./utils"

describe("MerkleTreeTest", () => {
    let contract: Contract

    const treeId = ethers.utils.formatBytes32String("treeId")

    before(async () => {
        contract = await run("deploy:merkle-tree-test", { logs: false })
    })

    it("Should not insert a leaf if its value is > SNARK_SCALAR_FIELD", async () => {
        const leaf = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495618")

        const transaction = contract.insertLeaf(treeId, leaf)

        await expect(transaction).to.be.revertedWith("MerkleTree: leaf must be < SNARK_SCALAR_FIELD")
    })

    it("Should insert a leaf in a tree", async () => {
        const leaf = BigInt(1)

        const tree = createTree(1)

        const transaction = contract.insertLeaf(treeId, leaf)

        await expect(transaction).to.emit(contract, "LeafInserted").withArgs(treeId, leaf, tree.root)
    })

    it("Should insert 4 leaves in a tree", async () => {
        const treeId = ethers.utils.formatBytes32String("tree2")

        const tree = createTree(0)

        for (let i = 0; i < 100; i += 1) {
            tree.insert(BigInt(i + 1))
            const transaction = contract.insertLeaf(treeId, BigInt(i + 1))

            await expect(transaction)
                .to.emit(contract, "LeafInserted")
                .withArgs(treeId, BigInt(i + 1), tree.root)
        }
    })
})
