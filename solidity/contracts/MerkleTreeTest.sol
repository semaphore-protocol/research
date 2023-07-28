// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./MerkleTree.sol";

contract MerkleTreeTest {
    using MerkleTree for MerkleTreeData;

    event TreeCreated(bytes32 indexed treeId, uint256 arity);
    event LeafInserted(bytes32 indexed treeId, uint256 leaf, uint256 root);
    event LeafUpdated(bytes32 indexed treeId, uint256 leaf, uint256 root);
    event LeafRemoved(bytes32 indexed treeId, uint256 leaf, uint256 root);

    mapping(bytes32 => MerkleTreeData) public trees;

    function createTree(bytes32 _treeId, uint256 _arity) external {
        trees[_treeId].init(_arity);

        emit TreeCreated(_treeId, _arity);
    }

    function insertLeaf(bytes32 _treeId, uint256 _leaf) external {
        uint256 root = trees[_treeId].insert(_leaf);

        emit LeafInserted(_treeId, _leaf, root);
    }
}
