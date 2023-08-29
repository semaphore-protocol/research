<p align="center">
    <h1 align="center">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
            <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        </picture>
        Semaphore V4 - JavaScript
    </h1>
</p>

## Changelog

Semaphore v4 JS libraries will keep the same interface but they'll probably use an optimized incremental Merkle tree, whose differences with the old version will be described below. The improvements have mainly focused on making on-chain insertions cheaper and are basically two:

* No zero hashes: In the old implementation, if the parent node has 1 child only, it will be calculated as the hash of that child node and a zero hash. The parent node can actually equal the child node itself. This shouldn't affect the properties of the tree and it would need to calculate far fewer hashes.
* Dynamic depth: In the current implementation, where the tree has a static depth, each insertion needs to update a number of nodes which equals the static depth of the tree. If the tree depth grew with the number of leaves, each insertion would only require updating a number of nodes proportional to the current number of leaves.

While the first property mostly makes the data structure simpler, the second property allows small groups to save a lot of gas.

## Install

Install the `@semaphore-research/merkle-tree` package with npm:

```bash
npm i @semaphore-research/merkle-tree --save
```

or yarn:

```bash
yarn add @semaphore-research/merkle-tree
```

## Usage

\# **new IncrementalMerkleTree**(hash: _HashFunction_, leaves?: _Node\[]_): _IncrementalMerkleTree_

```typescript
import { IncrementalMerkleTree } from "@semaphore-research/merkle-tree"
import { poseidon2 } from "poseidon-lite/poseidon2"

const hash = (a: Node, b: Node): Node => poseidon2([a, b])
const tree = new IncrementalMerkleTree(hash, [1, 2, 3])
```

\# **insert**(leaf: _Node_)

```typescript
tree.insert(1)
```

\# **update**(index: _number_, newLeaf: _Node_)

```typescript
tree.update(0, 2)
```

\# **delete**(index: _number_)

```typescript
tree.delete(0)
```

\# **indexOf**(leaf: _Node_): _number_

```typescript
tree.insert(2)

const index = tree.indexOf(BigInt(2))

console.log(index) // 1
```

\# **has**(leaf: _Node_): _boolean_

```typescript
console.log(tree.has(2)) // true
```

\# **generateProof**(index: _number_): _MerkleProof_

```typescript
const proof = tree.generateProof(1)
```

\# **verifyProof**(proof: _MerkleProof_): _boolean_

```typescript
console.log(tree.verifyProof(proof)) // true
```

## Benchmarks

WIP

For more information about gas savings and Solidity benchmarks read the `solidity` [README.md](https://github.com/semaphore-protocol/research/tree/main/solidity) file.
