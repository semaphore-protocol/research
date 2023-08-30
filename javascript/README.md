<p align="center">
    <h1 align="center">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
            <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        </picture>
        Semaphore V4 - Javascript Merkle tree
    </h1>
</p>

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

Benchmarks were run on a Intel Core i7-1165G7, 16 GB RAM machine.

|                 | Init (256) | Insert (1) | Insert (256)\* | InsertMany (256) | Update (1) |
| --------------- | ---------- | ---------- | -------------- | ---------------- | ---------- |
| Old Mekrle tree | `57ms`     | `3.6ms`    | `956ms`        | Not implemented  | `4ms`      |
| New Merkle tree | `54ms`     | `1ms`      | `348ms`        | `46ms`           | `3ms`      |

If you want to run the benchmarks yourself install the dependencies with `yarn` in the `javascript` folder and then run `yarn benchmarks`.

For more information about gas savings and Solidity benchmarks read the `solidity` [README.md](https://github.com/semaphore-protocol/research/tree/main/solidity) file.

\*The `insert` function has been executed 256 times as it only takes 1 leaf as a parameter, whereas the `insertMany` function supports batch insertions and takes a list of leaves as a parameter.
