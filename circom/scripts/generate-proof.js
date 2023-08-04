import { groth16 } from "snarkjs"
import { IncrementalMerkleTree } from "@semaphore-research/merkle-tree"
import { poseidon2 } from "poseidon-lite/poseidon2.js"
import { poseidon1 } from "poseidon-lite/poseidon1.js"

const identitySecret = 123
const identityCommitment = poseidon1([identitySecret])

const tree = new IncrementalMerkleTree((a, b) => poseidon2([a, b]), [1, 2, 3, 4, 5, identityCommitment])

const { root, leaf, siblings, index } = tree.generateMerkleProof(identityCommitment)

console.log(root)

let indices = []

for (let i = 0; i < 10; i++) {
    indices.push((index >> i) & 1)

    if (siblings[i] === undefined) {
        siblings[i] = 0
    }
}

const t0 = performance.now()

const fullProve = await groth16.fullProve(
    {
        identitySecret,
        treeDepth: 2,
        treeIndices: indices,
        treeSiblings: siblings,
        scope: 1,
        signalHash: 999
    },
    "./build/index_js/index.wasm",
    "./build/index_final.zkey"
)

const t1 = performance.now()

console.log(fullProve, t1 - t0)
