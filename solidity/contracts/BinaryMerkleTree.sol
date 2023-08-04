// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {PoseidonT3} from "poseidon-solidity/PoseidonT3.sol";

uint256 constant SNARK_SCALAR_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

struct MerkleTreeData {
    uint256 size;
    uint256 depth;
    mapping(uint256 => uint256) rightmostNodes;
    mapping(uint256 => uint256) leaves;
}

error WrongTreeDepth();
error WrongSiblingNodes();
error LeafGreaterThanSnarkScalarField();
error LeafCannotBeZero();
error LeafAlreadyExists();
error LeafDoesNotExist();

library BinaryMerkleTree {
    function insert(MerkleTreeData storage self, uint256 leaf) public returns (uint256) {
        if (leaf >= SNARK_SCALAR_FIELD) {
            revert LeafGreaterThanSnarkScalarField();
        } else if (leaf == 0) {
            revert LeafCannotBeZero();
        } else if (has(self, leaf)) {
            revert LeafAlreadyExists();
        }

        while (2**self.depth < self.size + 1) {
            self.depth += 1;
        }

        uint256 index = self.size;
        uint256 node = leaf;

        for (uint256 i = 0; i < self.depth; ) {
            if (index >> i & 1 == 1) {
                node = PoseidonT3.hash([self.rightmostNodes[i], node]);
            } else {
                self.rightmostNodes[i] = node;
            }

            unchecked {
                ++i;
            }
        }

        self.size += 1;

        self.rightmostNodes[self.depth] = node;
        self.leaves[leaf] = self.size;

        return node;
    }

    function update(
        MerkleTreeData storage self,
        uint256 oldLeaf,
        uint256 newLeaf,
        uint256[] calldata siblingNodes
    ) public returns (uint256) {
        if (newLeaf >= SNARK_SCALAR_FIELD) {
            revert LeafGreaterThanSnarkScalarField();
        } else if (!has(self, oldLeaf)) {
            revert LeafDoesNotExist();
        } else if (siblingNodes.length != self.depth) {
            revert WrongTreeDepth();
        }

        uint256 index = indexOf(self, oldLeaf);
        uint256 node = newLeaf;
        uint256 oldRoot = oldLeaf;

        for (uint256 i = 0; i < self.depth; ) {
            if (siblingNodes[i] >= SNARK_SCALAR_FIELD) {
                revert LeafGreaterThanSnarkScalarField();
            }

            if (siblingNodes[i] == self.rightmostNodes[i]) {
                self.rightmostNodes[i] = node;
            }

            if (index >> i & 1 != 0) {
                node = PoseidonT3.hash([siblingNodes[i], node]);
                oldRoot = PoseidonT3.hash([siblingNodes[i], oldRoot]);
            }

            unchecked {
                ++i;
            }
        }

        if (oldRoot != root(self)) {
            revert WrongSiblingNodes();
        }

        self.rightmostNodes[self.depth] = node;
        self.leaves[newLeaf] = self.leaves[oldLeaf];
        self.leaves[oldLeaf] = 0;

        return node;
    }

    function remove(
        MerkleTreeData storage self,
        uint256 oldLeaf,
        uint256[] calldata siblingNodes
    ) public returns (uint256) {
        return update(self, oldLeaf, 0, siblingNodes);
    }

    function has(MerkleTreeData storage self, uint256 leaf) public view returns (bool) {
        return self.leaves[leaf] != 0;
    }

    function indexOf(MerkleTreeData storage self, uint256 leaf) public view returns (uint256) {
        return self.leaves[leaf] - 1;
    }

    function root(MerkleTreeData storage self) public view returns (uint256) {
        return self.rightmostNodes[self.depth];
    }
}
