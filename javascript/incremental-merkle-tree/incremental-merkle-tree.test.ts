import { IncrementalMerkleTree, Node, MerkleProof } from "."

import { poseidon2 } from "poseidon-lite/poseidon2"

describe("Incremental Merkle Tree", () => {
    let mt: IncrementalMerkleTree
    let merkleProof: MerkleProof
    it("Should create a new Incremental Merkle Tree", () => {
        const hash = (a: Node, b: Node): Node => {
            return Number(a) - Number(b)
        }
        // const hash = (a: Node, b: Node) => poseidon2([a, b])
        mt = new IncrementalMerkleTree(hash, [1, 5, 10, 3])
        console.log(mt)
        expect(mt.size).toBe(4)
    })
    it("Should get the root of the Tree", () => {
        const root = mt.root
        expect(root).toBe(-11)
        // expect(root).toBe(BigInt("13796895624326512777705288145200123398071480688497188196865118529490944284269"))
    })
    it("Should get the depth of the Tree", () => {
        const depth = mt.depth
        expect(depth).toBe(2)
    })
    it("Should get the leaves of the Tree", () => {
        const leaves = mt.leaves
        console.log(leaves)
        expect(leaves).toStrictEqual([1, 5, 10, 3])
    })
    it("Should get the size of the Tree", () => {
        const size = mt.size
        expect(size).toBe(4)
    })
    it("Should get the index of an element in the Tree", () => {
        const index = mt.indexOf(3)
        expect(index).toBe(3)
    })
    describe("# has", () => {
        it("Should return true because the leaf is in the Tree", () => {
            const isLeaf = mt.has(3)
            expect(isLeaf).toBe(true)
        })
        it("Should return false because the leaf is not in the Tree", () => {
            const isLeaf = mt.has(50)
            expect(isLeaf).toBe(false)
        })
    })
    it("Should add a new leaf", () => {
        mt.insert(7)
        expect(mt.size).toBe(5)
    })
    it("Should generate a Merkle Proof", () => {
        merkleProof = mt.generateMerkleProof(3)
        console.log("Merkle Proof", merkleProof)
        expect(merkleProof.leaf).toBe(3)
    })
    // it("Should verify a Merkle Proof", () => {
    //     const response = mt.verifyProof(merkleProof)
    //     expect(response).toBe(true)
    // })
})
