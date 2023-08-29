import { poseidon2 } from "poseidon-lite/poseidon2"
import { IncrementalMerkleTree, MerkleProof, Node } from "."

describe("Incremental Merkle Tree", () => {
    const hash = (a: Node, b: Node): Node => poseidon2([a, b])

    let tree: IncrementalMerkleTree
    let merkleProof: MerkleProof

    describe("# new IncrementalMerkleTree", () => {
        it("Should create a new incremental Merkle tree", () => {
            tree = new IncrementalMerkleTree(hash, [1, 5, 10, 3])

            expect(tree.size).toBe(4)
            expect(tree.root).toBe(
                BigInt("13796895624326512777705288145200123398071480688497188196865118529490944284269")
            )
            expect(tree.depth).toBe(2)
            expect(tree.leaves).toStrictEqual([1, 5, 10, 3])
        })
    })

    describe("# indexOf", () => {
        it("Should get the index of an element in the tree", () => {
            const index = tree.indexOf(3)

            expect(index).toBe(3)
        })

        it("Should return -1 if the leaf does not exist", () => {
            const index = tree.indexOf(22)

            expect(index).toBe(-1)
        })
    })

    describe("# has", () => {
        it("Should return true because the leaf is in the tree", () => {
            const isLeaf = tree.has(3)

            expect(isLeaf).toBeTruthy()
        })

        it("Should return false because the leaf is not in the tree", () => {
            const isLeaf = tree.has(50)

            expect(isLeaf).toBeFalsy()
        })
    })

    describe("# insert", () => {
        it("Should add a new leaf", () => {
            tree.insert(7)

            expect(tree.size).toBe(5)
            expect(tree.indexOf(7)).toBe(4)
            expect(tree.root.toString()).toBe(
                "14324522008807171552282549137352626416574507330699293218149247806508134512160"
            )
        })
    })

    describe("# update", () => {
        it("Should update a leaf", () => {
            tree.update(3, 2)

            expect(tree.root.toString()).toBe(
                "20744357674430648223713282912887217832199510941906022125981010855764581322102"
            )
        })

        it("Should match the root if it updates the leaf with its old value", () => {
            tree.update(3, 3)

            expect(tree.root.toString()).toBe(
                "14324522008807171552282549137352626416574507330699293218149247806508134512160"
            )
        })
    })

    describe("# delete", () => {
        it("Should delete a leaf", () => {
            tree.delete(4)

            expect(tree.root.toString()).toBe(
                "9734888361088118201917483973197253211896215590318522673486889585690879475948"
            )
        })
    })

    describe("# generateProof", () => {
        it("Should generate a Merkle Proof", () => {
            merkleProof = tree.generateProof(2)

            expect(merkleProof.leaf).toBe(10)
        })
    })

    describe("# verifyProof", () => {
        it("Should verify a Merkle Proof", () => {
            const response = tree.verifyProof(merkleProof)

            expect(response).toBe(true)
        })
    })
    describe("# insertMany", () => {
        it("Should insert multiple leaves", () => {
            const tree1 = new IncrementalMerkleTree(hash)
            const tree2 = new IncrementalMerkleTree(hash)

            for (let i = 1; i < 50; i++) {
                tree1.insert(i)
            }

            tree2.insertMany(tree1.leaves)

            expect(tree1.root).toBe(tree2.root)
        })
    })
})
