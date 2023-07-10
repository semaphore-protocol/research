export type Node = number | string | bigint

export type HashFunction = (a: Node, b: Node) => Node

export type MerkleProof = {
    root: Node
    leaf: Node
    path: number
    siblings: Node[]
}
