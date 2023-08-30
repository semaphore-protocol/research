<p align="center">
    <h1 align="center">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
            <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        </picture>
        Semaphore v4 research
    </h1>
</p>

<p align="center">
    <a href="https://github.com/semaphore-protocol" target="_blank">
        <img src="https://img.shields.io/badge/project-Semaphore-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/semaphore-protocol/research/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/semaphore-protocol/research.svg?style=flat-square">
    </a>
</p>

<div align="center">
    <h4>
        <a href="./CONTRIBUTING.md">
            👥 Contributing
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="./CODE_OF_CONDUCT.md">
            🤝 Code of conduct
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://github.com/semaphore-protocol/research/issues/new/choose">
            🔎 Issues
        </a>
        <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
        <a href="https://semaphore.appliedzkp.org/discord">
            🗣️ Chat &amp; Support
        </a>
    </h4>
</div>

| This repository is used mainly for code related to specific research issues, such as improvements to protocol, contracts and libraries. It currently contains three main folders, each targeting one part of the Semaphore protocol (i.e. Circom, Solidity and JavaScript). Please be aware that maintaining this repository is not an active priority and the code is experimental. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

## What's new

### Optimized Merkle tree

The Merkle tree improvements have mainly focused on making on-chain insertions cheaper and are basically two:

1. No zero hashes: In the old implementation, if the parent node has 1 child only, it will be calculated as the hash of that child node and a zero hash. The parent node can actually equal the child node itself. This shouldn't affect the properties of the tree and it would need to
   calculate far fewer hashes.
2. Dynamic depth: In the current implementation, where the tree has a static depth, each insertion needs to update a number of nodes which equals the static depth of the tree. If the tree depth grew with the number of leaves, each insertion would only require updating a number of nodes proportional to the current number of leaves.

While the first property mostly makes the data structure simpler, the second property allows small groups to save a lot of gas.

### Circuits improvements

The Semaphore v4 circuit maintains pretty much the same structure as version 3. The improvements have mainly focused on making them neater and less complex and are basically 5:

1. Variable names:
    1. External Nullifier → Scope
    2. Siblings → Tree Siblings
    3. Path Indices → Tree Indices
2. Simplified identity: The two old identity secrets (`trapdoor` and `nullifier`) have been replaced by 1 secret only (`secret`). So `identity commitment = hash(identity secret)`, and `nullifier hash = hash(scope, identity secret)`.
3. Syntactic sugar: The circuit uses the new Circom [Anonymous Components](https://docs.circom.io/circom-language/anonymous-components-and-tuples/#anonymous-components) and contains [23](https://github.com/semaphore-protocol/research/blob/main/circom/semaphore-v4/index.circom) (Semaphore) + [33](https://github.com/semaphore-protocol/research/blob/main/circom/merkle-tree/index.circom) (Merkle tree) lines of code. Semaphore v3 contains [90](https://github.com/semaphore-protocol/semaphore/blob/main/packages/circuits/semaphore.circom) + [40](https://github.com/semaphore-protocol/semaphore/blob/main/packages/circuits/tree.circom) lines of code.
4. Additional input: The circuit takes an extra parameter to define the tree depth, which can now be dynamic. Even if the circuit has been compiled with a constant tree depth of 20, proofs generated with a Merkle tree with a depth of less than 20 can still be verified with the same circuit.
5. Additional circuit: A [new circuit](https://github.com/semaphore-protocol/research/blob/main/circom/preimage-proof/index.circom) has been added to allow developers to prove they own the Semaphore identity secret without revealing it. This circuit could be part of the [zk-kit monorepo](https://github.com/privacy-scaling-explorations/zk-kit) and used for other use-cases too as it's basically a simple pre-image proof with a nullifier.

---

Please, go to the specific folders to know how to try the code or read benchmarks:

-   Solidity: [`research/solidity`](/solidity)
-   JavaScript: [`research/javascript`](/javascript)
-   Circom: [`research/circom`](/circom)
