import { groth16 } from "snarkjs"
import { IncrementalMerkleTree } from "../../javascript/incremental-merkle-tree"
import { poseidon2 } from "poseidon-lite/poseidon2"
import { poseidon1 } from "poseidon-lite/poseidon1"

const identitySecret = 123
const identityCommitment = poseidon1([identitySecret])

const tree = new IncrementalMerkleTree((a, b) => poseidon2([a, b]), [1, 2, 3, 4, identityCommitment])

const { root, leaf, siblings, index } = tree.generateMerkleProof(identityCommitment)

console.log(tree)

let indices = []

for (let i = 0; i < 10; i++) {
    indices.push((index >> i) & 1)
}

console.log(indices)

//const { proof, publicSignals } = await groth16.fullProve(
//{
//identitySecret,
//treeDepth: siblings.length,
//treeIndices: merkleProof.pathIndices,
//treeSiblings: merkleProof.siblings,
//scope: 1,
//signalHash: 999
//},
//"../build/index_js/index.wasm",
//"../build/index_final.zkey"
//)
