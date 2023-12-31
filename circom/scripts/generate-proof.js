import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, verifyProof } from "@semaphore-protocol/proof"
import { IncrementalMerkleTree } from "@semaphore-research/merkle-tree"
import { readFileSync } from "fs"
import { poseidon1 } from "poseidon-lite/poseidon1.js"
import { poseidon2 } from "poseidon-lite/poseidon2.js"
import { prove, verify, buildBn128 } from "@zk-kit/groth16"
import { time } from "./utils.js"

await buildBn128()

// ############## PoseidonProof ##############
{
    // Generate proof

    const fullProof = await time(
        () =>
            prove(
                {
                    in: 1,
                    scope: 2
                },
                "./build/poseidon-proof/index_js/index.wasm",
                "./build/poseidon-proof/index_final.zkey"
            ),
        "Generate Poseidon proof"
    )

    // Verify proof

    await time(async () => {
        const verificationKey = JSON.parse(readFileSync("./build/poseidon-proof/verification_key.json", "utf8"))

        if (!(await verify(verificationKey, fullProof))) {
            console.error("The proof is not valid!")
        }
    }, "Verify Poseidon proof")
}

// ############## Semaphore V3 ##############
{
    const identity = new Identity()
    const group = new Group(1, 16, [1, 2, 3, 4, 5, identity.commitment])

    // Generate proof

    const fullProof = await time(
        () =>
            generateProof(identity, group, 1, 999, {
                zkeyFilePath: "./build/semaphore-v3/semaphore.zkey",
                wasmFilePath: "./build/semaphore-v3/semaphore.wasm"
            }),
        "Generate v3 proof"
    )

    // Verify proof

    await time(async () => {
        await verifyProof(fullProof, 16)
    }, "Verify v3 proof")
}

// ############## Semaphore V4 ##############
{
    const identitySecret = 123
    const identityCommitment = poseidon1([identitySecret])

    const tree = new IncrementalMerkleTree((a, b) => poseidon2([a, b]), [1, 2, 3, 4, 5, identityCommitment])

    const { siblings, index } = tree.generateProof(6)

    // The index must be converted to a list of indices, 1 for each tree level.
    // The circuit tree depth is 10, so the number of siblings must be 10, even if
    // the tree depth is actually 2. The missing siblings can be set to 0, as they
    // won't be used in the circuit.
    let indices = []

    for (let i = 0; i < 16; i++) {
        indices.push((index >> i) & 1)

        if (siblings[i] === undefined) {
            siblings[i] = 0
        }
    }

    // Generate proof

    const fullProof = await time(
        () =>
            prove(
                {
                    identitySecret,
                    treeDepth: tree.depth,
                    treeIndices: indices,
                    treeSiblings: siblings,
                    scope: 1,
                    message: 999
                },
                "./build/semaphore-v4/index_js/index.wasm",
                "./build/semaphore-v4/index_final.zkey"
            ),
        "Generate v4 proof"
    )

    // Verify proof

    await time(async () => {
        const verificationKey = JSON.parse(readFileSync("./build/semaphore-v4/verification_key.json", "utf8"))

        if (!(await verify(verificationKey, fullProof))) {
            console.error("The proof is not valid!")
        }
    }, "Verify v4 proof")
}
