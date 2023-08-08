import { poseidon2 } from "poseidon-lite/poseidon2"
import { MerkleProof, IncrementalMerkleTree as OIncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { IncrementalMerkleTree } from "../src"
import { FN } from "./types"
import generateBenchmarks from "./benchmark"

const name = "incremental-merkle-tree"

export default async function run() {
    const tree1 = new IncrementalMerkleTree((a, b) => poseidon2([a, b]))
    const tree2 = new OIncrementalMerkleTree(poseidon2, 20, BigInt(0), 2)

    const numberOfLeaves = 2 ** 12

    const leaves: any[] = []

    for (let i = 0; i < numberOfLeaves; i += 1) {
        leaves.push(i + 1)
    }

    const fn1: FN = [
        `New IncrementalMerkleTree - insert (${numberOfLeaves} leaves)`,
        () => {
            new IncrementalMerkleTree((a, b) => poseidon2([a, b]), leaves)
        }
    ]

    const fn2: FN = [
        `Old IncrementalMerkleTree - insert (${numberOfLeaves} leaves)`,
        () => {
            new OIncrementalMerkleTree(poseidon2, 20, BigInt(0), 2, leaves)
        }
    ]

    generateBenchmarks(fn1, fn2, name, "createIMT")

    // insert a new leaf

    const fn3: FN = [
        `New IncrementalMerkleTree - insert one leaf`,
        () => {
            tree1.insert(1)
        }
    ]

    const fn4: FN = [
        `Old IncrementalMerkleTree - insert one leaf`,
        () => {
            tree2.insert(1)
        }
    ]

    generateBenchmarks(fn3, fn4, name, "insert")

    // update one leaf

    const fn5: FN = [
        `New IncrementalMerkleTree - update one leaf`,
        () => {
            tree1.update(0, 2)
        }
    ]

    const fn6: FN = [
        `Old IncrementalMerkleTree - update one leaf`,
        () => {
            tree2.update(0, 2)
        }
    ]

    generateBenchmarks(fn5, fn6, name, "update")

    // delete one leaf

    const fn7: FN = [
        `New IncrementalMerkleTree - delete one leaf`,
        () => {
            tree1.delete(0)
        }
    ]

    const fn8: FN = [
        `Old IncrementalMerkleTree - delete one leaf`,
        () => {
            tree2.delete(0)
        }
    ]

    generateBenchmarks(fn7, fn8, name, "delete")

    // generate merkle proof

    let proofNewIMT: any
    let proofOldIMT: MerkleProof

    const fn9: FN = [
        `New IncrementalMerkleTree - generate merkle proof`,
        () => {
            proofNewIMT = tree1.generateProof(1)
        }
    ]

    const fn10: FN = [
        `Old IncrementalMerkleTree - generate merkle proof`,
        () => {
            proofOldIMT = tree2.createProof(1)
        }
    ]

    generateBenchmarks(fn9, fn10, name, "generateProof")

    // verify proof

    const fn11: FN = [
        `New IncrementalMerkleTree - verify merkle proof`,
        () => {
            tree1.verifyProof(proofNewIMT)
        }
    ]

    const fn12: FN = [
        `Old IncrementalMerkleTree - verify merkle proof`,
        () => {
            tree2.verifyProof(proofOldIMT)
        }
    ]

    generateBenchmarks(fn11, fn12, name, "verifyProof")
}
