import checkParameter from "./checkParameter"
import { HashFunction, MerkleProof, Node } from "./types"

export default class IncrementalMerkleTree {
    private readonly _nodes: Node[][]
    private readonly _hash: HashFunction

    /**
     * Initializes the tree with a given hash function and an
     * optional list of leaves.
     * @param hash Hash function.
     * @param leaves List of leaves.
     */
    constructor(hash: HashFunction, leaves: Node[] = []) {
        checkParameter(hash, "hash", "function")

        // Initialize the attributes.
        this._nodes = [[]]
        this._hash = hash

        // It initializes the tree with a list of leaves if there are any.
        if (leaves.length > 0) {
            this.insertMany(leaves)
        }
    }

    /**
     * Returns the root hash of the tree.
     * @returns Root hash.
     */
    public get root(): Node {
        return this._nodes.at(-1)![0]
    }

    /**
     * Returns the depth of the tree.
     * @returns Tree depth.
     */
    public get depth(): number {
        return this._nodes.length - 1
    }

    /**
     * Returns the leaves of the tree.
     * @returns List of leaves.
     */
    public get leaves(): Node[] {
        return this._nodes[0].slice()
    }

    /**
     * Returns the number of leaves in the tree.
     * @returns Number of leaves.
     */
    public get size(): number {
        return this._nodes[0].length
    }

    /**
     * Returns the index of a leaf. If the leaf does not exist it returns -1.
     * @param leaf Tree leaf.
     * @returns Index of the leaf.
     */
    public indexOf(leaf: Node): number {
        checkParameter(leaf, "leaf", "number", "string", "bigint")

        return this._nodes[0].indexOf(leaf)
    }

    /**
     * Returns true if the leaf exists and false otherwise
     * @param leaf Tree leaf.
     * @returns true or false.
     */
    public has(leaf: Node): boolean {
        checkParameter(leaf, "leaf", "number", "string", "bigint")

        return this._nodes[0].includes(leaf)
    }

    /**
     * Inserts a new leaf in the tree.
     * @param leaf New leaf.
     */
    public insert(leaf: Node) {
        checkParameter(leaf, "leaf", "number", "string", "bigint")

        if (leaf === 0) {
            throw new Error("The leaf cannot be zero")
        }

        // It calculates the next depth.
        if (this.depth < Math.ceil(Math.log2(this.size + 1))) {
            this._nodes.push([])
        }

        let node = leaf
        let index = this.size

        for (let level = 0; level < this.depth; level += 1) {
            this._nodes[level][index] = node

            // Bitwise AND, 0 -> left or 1 -> right.
            // If the node is a right node the parent node will be the hash
            // of the child nodes. Otherwise, parent will equal left child node.
            if (index & 1) {
                const sibling = this._nodes[level][index - 1]
                node = this._hash(sibling, node)
            }

            // Right shift, it divides a number by 2 and discards the remainder.
            index >>= 1
        }

        // Finally, it stores the new root.
        this._nodes[this.depth] = [node]
    }

    public insertMany(leaves: Node[]) {
        checkParameter(leaves, "leaves", "object")

        if (leaves.length <= 0) {
            throw new Error("There are not leaves")
        }

        leaves.forEach((leaf: Node) => {
            if (leaf === 0) {
                throw new Error("The value cannot be zero")
            }
        })

        const pos = this.size

        this._nodes[0].push(...leaves)

        // It calculates the depth based on the number of leaves.
        const depth = Math.ceil(Math.log2(this.size))

        const newLevels = depth - this.depth

        for (let i = 0; i < newLevels; i += 1) {
            this._nodes.push([])
        }

        for (let level = 0; level < depth; level += 1) {
            const len = Math.ceil(this._nodes[level].length / 2)
            for (let index = pos >> (level + 1); index < len; index += 1) {
                let parentNode: Node

                const rightNode = this._nodes[level][index * 2 + 1]
                const leftNode = this._nodes[level][index * 2]

                if (rightNode) {
                    parentNode = this._hash(leftNode, rightNode)
                } else {
                    parentNode = leftNode
                }

                this._nodes[level + 1][index] = parentNode
            }
        }
    }

    /**
     * Updates a leaf in the tree.
     * @param index Index of the leaf to be updated.
     * @param newLeaf New leaf value.
     */
    public update(index: number, newLeaf: Node) {
        checkParameter(index, "index", "number")
        checkParameter(newLeaf, "newLeaf", "number", "string", "bigint")

        if (newLeaf === 0) {
            throw new Error("The value cannot be zero")
        }

        this._update(index, newLeaf)
    }

    /**
     * Deletes a leaf from the tree. It does not remove the leaf from
     * the data structure. It sets the leaf to be deleted to zero.
     * @param index Index of the leaf to be deleted.
     */
    public delete(index: number) {
        checkParameter(index, "index", "number")

        this._update(index, 0)
    }

    public generateProof(index: number): MerkleProof {
        checkParameter(index, "index", "number")

        if (index === -1) {
            throw new Error("The leaf does not exist in this tree")
        }

        const leaf = this.leaves[index]
        const siblings: Node[] = []
        const path: number[] = []

        for (let level = 0; level < this.depth; level += 1) {
            const isRightNode = index & 1
            const siblingIndex = isRightNode ? index - 1 : index + 1
            const sibling = this._nodes[level][siblingIndex]

            if (sibling !== undefined) {
                path.push(isRightNode)
                siblings.push(sibling)
            }

            index >>= 1
        }

        return { root: this.root, leaf, index: Number.parseInt(path.reverse().join(""), 2), siblings }
    }

    public verifyProof(proof: MerkleProof): boolean {
        checkParameter(proof, "proof", "object")

        const { root, leaf, siblings, index } = proof

        checkParameter(proof.root, "proof.root", "number", "string", "bigint")
        checkParameter(proof.leaf, "proof.leaf", "number", "string", "bigint")
        checkParameter(proof.siblings, "proof.siblings", "object")
        checkParameter(proof.index, "proof.path", "number")

        let node = leaf

        for (let i = 0; i < siblings.length; i += 1) {
            if ((index >> i) & 1) {
                node = this._hash(siblings[i], node)
            } else {
                node = this._hash(node, siblings[i])
            }
        }

        return root === node
    }

    private _update(index: number, newLeaf: Node) {
        let node = newLeaf

        for (let level = 0; level < this.depth; level += 1) {
            this._nodes[level][index] = node

            if (index & 1) {
                const sibling = this._nodes[level][index - 1]
                node = this._hash(sibling, node)
            } else {
                const sibling = this._nodes[level][index + 1]

                if (sibling) {
                    node = this._hash(node, sibling)
                }
            }

            index >>= 1
        }

        this._nodes[this.depth] = [node]
    }
}
