<p align="center">
    <h1 align="center">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
            <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        </picture>
        Semaphore V4 - Circuits
    </h1>
</p>

## Usage

Once you are in `circom` folder:

1. Install [Circom](https://docs.circom.io/getting-started/installation/) and [SnarkJS](https://github.com/iden3/snarkjs)
2. Install the NPM dependencies with `yarn`
3. Run `yarn run:ceremony` to compile the circuit and run a fake trusted-setup for testing
4. Run `yarn start` to generate and verify Semaphore v3 and v4 proofs and compare them

## Benchmarks

The difference between version 3 and 4 is in this case mainly due to the different version of SnarkJS. Benchmarks were run on a Intel Core i7-1165G7, 16 GB RAM machine.

|              | Generate proof | Verify proof | Constraints | Tree depth |
| ------------ | -------------- | ------------ | ----------- | ---------- |
| Semaphore v3 | `404ms`        | `14ms`       | `4582`      | `16`       |
| Semaphore v4 | `382ms`        | `13ms`       | `4374`      | `16`       |
