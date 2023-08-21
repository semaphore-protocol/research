import { poseidon2 } from "poseidon-lite/poseidon2"
import { IncrementalMerkleTree } from "../src"
import { FN } from "./types"
import generateBenchmarks from "./benchmark"

const name = "incremental-merkle-tree"

export default async function run() {
    const numberOfLeaves = 2 ** 12

    const leaves: any[] = []

    for (let i = 0; i < numberOfLeaves; i += 1) {
        leaves.push(i + 1)
    }

    const tree1 = new IncrementalMerkleTree((a, b) => poseidon2([a, b]), leaves.slice())
    const tree2 = new IncrementalMerkleTree((a, b) => poseidon2([a, b]), leaves.slice())

    // Batch insertion New Incremental Merkle Tree
    const fn1: FN = [
        `New IncrementalMerkleTree - insert multiple leaves using insert function`,
        () => {
            for (let i = 500; i < 510; i += 1) {
                tree1.insert(i)
            }
        }
    ]

    const fn2: FN = [
        `New IncrementalMerkleTree - insert multiple leaves using insertMany function`,
        () => {
            tree2.insertMany([500, 501, 502, 503, 504, 505, 506, 507, 508, 509])
        }
    ]

    generateBenchmarks(fn1, fn2, name, "insertManyNewIMT")
}
