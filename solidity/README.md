<p align="center">
    <h1 align="center">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
            <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        </picture>
        Semaphore V4 - Solidity
    </h1>
</p>

## Benchmarks

Benchmarks were run on a MacBook Pro, 16 GB RAM machine.

|                 | Insert (1) | Insert (100) | Insert (200) | Insert (500) | Update (1) | Remove (1) | Deployment |
| --------------- | ---------- | ------------ | ------------ | ------------ | ---------- | ---------- | ---------- |
| Old Mekrle tree | `1098014`  | `514772`     | `510467`     | `506582`     | `794762`   | `793419`   | `1834586`  |
| New Merkle tree | `96335`    | `187326`     | `206016`     | `234121`     | `192765`   | `192508`   | `663315`   |

If you want to run the benchmarks yourself install the dependencies with `yarn` in the `solidity` folder and then run `yarn test:report-gas`.
