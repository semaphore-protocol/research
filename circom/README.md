<p align="center">
    <h1 align="center">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
            <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        </picture>
        Semaphore V4 - Circom
    </h1>
</p>

## Changelog

The Semaphore v4 circuit maintains pretty much the same structure as version 3. The main differences are:

* Variable names: The external nullifier is now called "scope".
* Simplified identity: The two old identity secrets (`trapdoor` and `nullifier`) have been replaced by 1 secret only (`secret`). So `identity commitment = hash(identity secret)`, and `nullifier hash = hash(scope, identity secret)`.
* Syntactic sugar: The circuit uses the new Circom [Anonymous Components](https://docs.circom.io/circom-language/anonymous-components-and-tuples/#anonymous-components) and contains [23](https://github.com/semaphore-protocol/research/blob/main/circom/semaphore-v4/index.circom) (Semaphore) + [33](https://github.com/semaphore-protocol/research/blob/main/circom/merkle-tree/index.circom) (Merkle tree) lines of code. Semaphore v3 contains [90](https://github.com/semaphore-protocol/semaphore/blob/main/packages/circuits/semaphore.circom) + [40](https://github.com/semaphore-protocol/semaphore/blob/main/packages/circuits/tree.circom) lines of code.
* Additional input: The circuit takes an extra parameter to define the tree depth, which can now be dynamic. Even if the circuit has been compiled with a constant tree depth of 20, proofs generated with a Merkle tree with a depth of less than 20 can still be verified with the same circuit.
* Additional circuit: A [new circuit](https://github.com/semaphore-protocol/research/blob/main/circom/preimage-proof/index.circom) has been added to allow developers to prove they own the Semaphore identity secret without revealing it. This circuit could be part of the [zk-kit monorepo](https://github.com/privacy-scaling-explorations/zk-kit) and used for other use-cases too as it's basically a simple pre-image proof with a nullifier.

## Usage

Once you are in `circom` folder:

1. Install [Circom](https://docs.circom.io/getting-started/installation/) and [SnarkJS](https://github.com/iden3/snarkjs)
2. Install the NPM dependencies with `yarn`
3. Run `yarn run:ceremony` to compile the circuit and run a fake trusted-setup for testing
4. Run `yarn start` to generate and verify Semaphore v3 and v4 proofs and compare them

## Benchmarks

The difference between version 3 and 4 is in this case mainly due to the different version of SnarkJS. Benchmarks were run on a Intel Core i7-1165G7, 16 GB RAM machine.

|                | Generate proof | Verify proof | SnarkJS version | Constraints | Tree depth |
| -------------- | -------------- | ------------ | ----------------| ----------- | ---------- |
| Semaphore v3   | `1219ms`       |     `343ms`  | `v0.4.16`       |  `4582`     |  `16`      |
| Semaphore v4   | `525ms`        |     `139ms`  | `v0.7.0`        |  `4374`     |  `16`      |
