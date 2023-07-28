// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {PoseidonT3} from "poseidon-solidity/PoseidonT3.sol";

uint256 constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

struct MerkleTreeData {
    uint256 arity;
    uint256 size;
    uint256 depth;
    mapping(uint256 => uint256) siblings;
    mapping(uint256 => uint256) leaves;
}

error ArityCannotBeZero();
error TreeAlreadyInitialized();
error TreeNotInitialized();
error LeafGreaterThanSnarkScalarField();
error LeafCannotBeZero();
error LeafAlreadyExists();

library MerkleTree {
    /// @dev Initializes a tree with a specific arity.
    /// @param self: Tree data.
    /// @param arity: Tree arity.
    function init(
        MerkleTreeData storage self,
        uint256 arity
    ) public {
        if (arity == 0) {
            revert ArityCannotBeZero();
        } else if (self.arity != 0) {
            revert TreeAlreadyInitialized();
        }

        self.arity = arity;
    }

    /// @dev Inserts a new leaf in the tree.
    /// @param self: Tree data.
    /// @param leaf: Leaf to be inserted.
    function insert(MerkleTreeData storage self, uint256 leaf) public returns (uint256) {
        if (self.arity == 0) {
            revert TreeNotInitialized();
        } else if (leaf >= SNARK_SCALAR_FIELD) {
            revert LeafGreaterThanSnarkScalarField();
        } else if (leaf == 0) {
            revert LeafCannotBeZero();
        } else if (has(self, leaf)) {
            revert LeafAlreadyExists();
        }

        while (self.arity**self.depth < self.size + 1) {
            self.depth += 1;
        }

        uint256 index = self.size;
        uint256 node = leaf;

        for (uint256 i = 0; i < self.depth; ) {
            if (index % self.arity != 0) {
                node = PoseidonT3.hash([self.siblings[i], node]);
            } else {
                self.siblings[i] = node;
            }

            unchecked {
                index /= self.arity;
                ++i;
            }
        }

        self.size += 1;

        self.siblings[self.depth] = node;
        self.leaves[leaf] = self.size;

        return node;
    }

    function has(MerkleTreeData storage self, uint256 leaf) public view returns (bool) {
        return self.leaves[leaf] != 0;
    }

    function indexOf(MerkleTreeData storage self, uint256 leaf) public view returns (uint256) {
        return self.leaves[leaf] - 1;
    }

    function root(MerkleTreeData storage self) public view returns (uint256) {
        return self.siblings[self.depth];
    }
}
