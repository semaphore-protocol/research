import { expect } from "chai"
import { Contract } from "ethers"
import { ethers, run } from "hardhat"
import { createTree } from "./utils"

describe("BinaryMerkleTreeTest", () => {
  let binaryMerkleTree: Contract
  let binaryMerkleTreeLib: Contract
  let merkleTree: Contract

  const treeId = ethers.utils.formatBytes32String("treeId")

  before(async () => {
    const { contract: _binaryMerkleTree, library: _binaryMerkleTreeLib } =
      await run("deploy:binary-merkle-tree-test", { logs: false })
    const { contract: _merkleTree } = await run("deploy:merkle-tree-test", {
      logs: false
    })

    binaryMerkleTree = _binaryMerkleTree
    binaryMerkleTreeLib = _binaryMerkleTreeLib
    merkleTree = _merkleTree
  })

  it("Should not insert a leaf if its value is > SNARK_SCALAR_FIELD", async () => {
    const leaf = BigInt(
      "21888242871839275222246405745257275088548364400416034343698204186575808495618"
    )

    const transaction = binaryMerkleTree.insertLeaf(treeId, leaf)

    await expect(transaction).to.be.revertedWithCustomError(
      binaryMerkleTreeLib,
      "LeafGreaterThanSnarkScalarField"
    )
  })

  it("Should insert a leaf in a binary tree", async () => {
    const leaf = BigInt(1)

    const tree = createTree(1)

    const transaction = binaryMerkleTree.insertLeaf(treeId, leaf)

    await expect(transaction)
      .to.emit(binaryMerkleTree, "LeafInserted")
      .withArgs(treeId, leaf, tree.root)
  })

  it("Should insert 100 leaves in a binary tree", async () => {
    const treeId = ethers.utils.formatBytes32String("tree2")

    const tree = createTree(0)

    for (let i = 0; i < 100; i += 1) {
      tree.insert(BigInt(i + 1))
      const transaction = binaryMerkleTree.insertLeaf(treeId, BigInt(i + 1))

      await expect(transaction)
        .to.emit(binaryMerkleTree, "LeafInserted")
        .withArgs(treeId, BigInt(i + 1), tree.root)
    }
  })

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
