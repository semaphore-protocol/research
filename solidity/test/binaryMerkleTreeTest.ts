import { expect } from "chai"
import { Contract } from "ethers"
import { ethers, run } from "hardhat"
import { createTree } from "./utils"

describe("BinaryMerkleTreeTest", () => {
  let binaryMerkleTree: Contract
  let binaryMerkleTreeLib: Contract

  const treeId = ethers.utils.formatBytes32String("treeId")

  before(async () => {
    const { contract: _binaryMerkleTree, library: _binaryMerkleTreeLib } =
      await run("deploy:binary-merkle-tree-test", { logs: false })

    binaryMerkleTree = _binaryMerkleTree
    binaryMerkleTreeLib = _binaryMerkleTreeLib
  })

  describe("# insert", () => {
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
  })

  describe("# update", () => {
    it("Should not update a leaf if the leaf does not exist", async () => {
      const leaf = BigInt(1)
      const treeId = ethers.utils.formatBytes32String("treeUpdate")
      const transaction = binaryMerkleTree.updateLeaf(
        treeId,
        BigInt(2),
        leaf,
        [1, 2, 3, 4]
      )
      await expect(transaction).to.be.revertedWithCustomError(
        binaryMerkleTreeLib,
        "LeafDoesNotExist"
      )
    })
    it.only("Should update a leaf in the tree", async () => {
      const treeId = ethers.utils.formatBytes32String("treeUpdate")
      const numberOfNodes = 3
      const tree = createTree(numberOfNodes)

      const leaf = BigInt(1234)

      tree.update(1, leaf)
      const merkleProof = tree.generateMerkleProof(leaf)

      for (let i = 0; i < numberOfNodes; i += 1) {
        await binaryMerkleTree.insertLeaf(treeId, BigInt(i + 1))
      }

      const transaction = binaryMerkleTree.updateLeaf(
        treeId,
        BigInt(2),
        leaf,
        merkleProof.siblings
      )

      await expect(transaction)
        .to.emit(binaryMerkleTree, "LeafUpdated")
        .withArgs(treeId, leaf, tree.root)
    })
  })

  describe("# remove", () => {
    it("Should remove a leaf", async () => {
      const treeId = ethers.utils.formatBytes32String("treeRemove")
      const numberOfNodes = 3
      const tree = createTree(numberOfNodes)

      const leaf = BigInt(2)

      tree.delete(1)

      const merkleProof = tree.generateMerkleProof(0)

      for (let i = 0; i < numberOfNodes; i += 1) {
        await binaryMerkleTree.insertLeaf(treeId, BigInt(i + 1))
      }

      const transaction = binaryMerkleTree.removeLeaf(
        treeId,
        leaf,
        merkleProof.siblings
      )

      await expect(transaction)
        .to.emit(binaryMerkleTree, "LeafRemoved")
        .withArgs(treeId, leaf, tree.root)
    })
  })

  describe("# has", () => {
    it("Should return true because the node is in the Tree", async () => {
      const treeId = ethers.utils.formatBytes32String("treeHas")
      const node = BigInt(1)
      await binaryMerkleTree.insertLeaf(treeId, node)

      const response = await binaryMerkleTree.hasLeaf(treeId, node)

      await expect(response).to.be.true
    })
    it("Should return false because the node is not the Tree", async () => {
      const treeId = ethers.utils.formatBytes32String("treeHas")
      const node = BigInt(2)

      const response = await binaryMerkleTree.hasLeaf(treeId, node)

      await expect(response).to.be.false
    })
  })
  describe("# indexOf", () => {
    it("Should return the index of a leaf", async () => {
      const treeId = ethers.utils.formatBytes32String("treeIndexOf")
      const node = BigInt(1)
      await binaryMerkleTree.insertLeaf(treeId, node)

      const response = await binaryMerkleTree.indexOfLeaf(treeId, node)

      await expect(response).to.be.equal(0)
    })
  })
})
