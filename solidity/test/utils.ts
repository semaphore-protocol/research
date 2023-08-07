import { IncrementalMerkleTree } from "@semaphore-research/merkle-tree"
import { poseidon2 } from "poseidon-lite"

export function createTree(numberOfNodes = 0): IncrementalMerkleTree {
  const tree = new IncrementalMerkleTree((a, b) => poseidon2([a, b]))

  for (let i = 0; i < numberOfNodes; i += 1) {
    tree.insert(BigInt(i + 1))
  }

  return tree
}
