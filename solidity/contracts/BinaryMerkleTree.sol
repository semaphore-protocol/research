// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {PoseidonT3} from "poseidon-solidity/PoseidonT3.sol";

struct MerkleTreeData {
    uint256 size;
    uint256 depth;
    mapping(uint256 => uint256) siblings;
    mapping(uint256 => bool) leaves;
}

library BinaryMerkleTree {
    uint256 internal constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    function insert(MerkleTreeData storage self, uint256 leaf) public returns (uint256) {
        require(leaf < SNARK_SCALAR_FIELD, "MerkleTree: leaf must be < SNARK_SCALAR_FIELD");
        require(leaf != 0, "MerkleTree: leaf cannot equal zero");
        require(!has(self, leaf), "MerkleTree: leaf already exists");

        while (2**self.depth < self.size + 1) {
            self.depth += 1;
        }

        uint256 index = self.size;
        uint256 node = leaf;

        for (uint256 i = 0; i < self.depth; ) {
            if (index >> i & 1 == 1) {
                node = PoseidonT3.hash([self.siblings[i], node]);
            } else {
                self.siblings[i] = node;
            }

            unchecked {
                ++i;
            }
        }

        self.size += 1;

        self.siblings[self.depth] = node;
        self.leaves[leaf] = true;

        return node;
    }

    function has(MerkleTreeData storage self, uint256 leaf) public view returns (bool) {
        return self.leaves[leaf];
    }

    function root(MerkleTreeData storage self) public view returns (uint256) {
        return self.siblings[self.depth];
    }
}
