import { poseidon2 } from "poseidon-lite/poseidon2"
import { MerkleProof, IncrementalMerkleTree as OIncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { IncrementalMerkleTree } from "../src"
import { FN } from "./types"
import generateBenchmarks from "./benchmark"

const name = "incremental-merkle-tree"

export default async function run() {
    const tree1 = new IncrementalMerkleTree((a, b) => poseidon2([a, b]))
    const tree2 = new OIncrementalMerkleTree(poseidon2, 20, BigInt(0), 2)

    const numberOfLeaves = 2 ** 8

    const leaves: any[] = []

    for (let i = 0; i < numberOfLeaves; i += 1) {
        leaves.push(i + 1)
    }

    {
        const fn1: FN = [
            `New IncrementalMerkleTree - Initialize tree with list of leaves (${leaves.length})`,
            () => {
                new IncrementalMerkleTree((a, b) => poseidon2([a, b]), leaves)
            }
        ]

        const fn2: FN = [
            `Old IncrementalMerkleTree - Initialize tree with list of leaves (${leaves.length})`,
            () => {
                new OIncrementalMerkleTree(poseidon2, 20, BigInt(0), 2, leaves)
            }
        ]

        await generateBenchmarks(fn1, fn2, name, "Create tree")
    }

    {
        const fn1: FN = [
            `New IncrementalMerkleTree - insertMany (${leaves.length})`,
            () => {
                tree1.insertMany(leaves)
            }
        ]

        const fn2: FN = [
            `Old IncrementalMerkleTree - insertMany (${leaves.length})`,
            () => {
                for (let i = 0; i < leaves.length; i += 1) {
                    tree2.insert(leaves[i])
                }
            }
        ]

        await generateBenchmarks(fn1, fn2, name, "insertMany")
    }

    {
        const fn1: FN = [
            `New IncrementalMerkleTree - insert (1)`,
            () => {
                tree1.insert(leaves.length)
            }
        ]

        const fn2: FN = [
            `Old IncrementalMerkleTree - insert (1)`,
            () => {
                tree2.insert(leaves.length)
            }
        ]

        await generateBenchmarks(fn1, fn2, name, "insert")
    }

    {
        const fn1: FN = [
            `New IncrementalMerkleTree - insert (${leaves.length})`,
            () => {
                for (let i = 0 + 1; i < leaves.length; i += 1) {
                    tree1.insert(leaves[i] * 2 + 1)
                }
            }
        ]

        const fn2: FN = [
            `Old IncrementalMerkleTree - insert (${leaves.length})`,
            () => {
                for (let i = 0; i < leaves.length; i += 1) {
                    tree2.insert(leaves[i] * 2 + 1)
                }
            }
        ]

        await generateBenchmarks(fn1, fn2, name, "insert")
    }

    {
        const fn1: FN = [
            `New IncrementalMerkleTree - update (1)`,
            () => {
                tree1.update(0, 2)
            }
        ]

        const fn2: FN = [
            `Old IncrementalMerkleTree - update (1)`,
            () => {
                tree2.update(0, 2)
            }
        ]

        await generateBenchmarks(fn1, fn2, name, "update")
    }

    {
        const fn1: FN = [
            `New IncrementalMerkleTree - delete (1)`,
            () => {
                tree1.delete(0)
            }
        ]

        const fn2: FN = [
            `Old IncrementalMerkleTree - delete (1)`,
            () => {
                tree2.delete(0)
            }
        ]

        await generateBenchmarks(fn1, fn2, name, "delete")
    }

    {
        let proofNewIMT: any
        let proofOldIMT: MerkleProof

        const fn1: FN = [
            `New IncrementalMerkleTree - generateProof`,
            () => {
                proofNewIMT = tree1.generateProof(1)
            }
        ]

        const fn2: FN = [
            `Old IncrementalMerkleTree - generateProof`,
            () => {
                proofOldIMT = tree2.createProof(1)
            }
        ]

        await generateBenchmarks(fn1, fn2, name, "generateProof")

        const fn3: FN = [
            `New IncrementalMerkleTree - verifyProof`,
            () => {
                tree1.verifyProof(proofNewIMT)
            }
        ]

        const fn4: FN = [
            `Old IncrementalMerkleTree - verifyProof`,
            () => {
                tree2.verifyProof(proofOldIMT)
            }
        ]

        await generateBenchmarks(fn3, fn4, name, "verifyProof")
    }
}
