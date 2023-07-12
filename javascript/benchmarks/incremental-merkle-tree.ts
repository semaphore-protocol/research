import b from "benny"
import { poseidon2 } from "poseidon-lite/poseidon2"
import { IncrementalMerkleTree as OIncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { IncrementalMerkleTree } from "../incremental-merkle-tree"
import { getExecutionTime } from "./utils"
import { FN } from "./types"

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

    console.log(fn1[0], getExecutionTime(fn1[1]))
    console.log(fn2[0], getExecutionTime(fn2[1]))

    b.suite(
        name,
        b.add(...fn1),
        b.add(...fn2),
        b.cycle(),
        b.complete(),
        b.save({ folder: "benchmarks/results", file: name, version: "1.0.0", details: true }),
        b.save({ folder: "benchmarks/results", file: name, format: "chart.html", details: true }),
        b.save({ folder: "benchmarks/results", file: name, format: "table.html", details: true })
    )
}
