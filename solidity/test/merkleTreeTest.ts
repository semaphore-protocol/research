import { expect } from "chai"
import { Contract } from "ethers"
import { ethers, run } from "hardhat"
import { createTree } from "./utils"

describe.skip("MerkleTreeTest", () => {
  let merkleTree: Contract

  const treeId = ethers.utils.formatBytes32String("treeId")

  before(async () => {
    const { contract: _merkleTree } = await run("deploy:merkle-tree-test", {
      logs: false
    })
    merkleTree = _merkleTree
  })

  describe("# insert", () => {
    it("Should insert 100 leaves in a generic tree", async () => {
      const treeId = ethers.utils.formatBytes32String("generic-tree")

      const tree = createTree(0)
      await merkleTree.createTree(treeId, 2)

      for (let i = 0; i < 100; i += 1) {
        tree.insert(BigInt(i + 1))
        const transaction = merkleTree.insertLeaf(treeId, BigInt(i + 1))

        await expect(transaction)
          .to.emit(merkleTree, "LeafInserted")
          .withArgs(treeId, BigInt(i + 1), tree.root)
      }
    })
  })
})
