// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./BinaryMerkleTree.sol";

contract BinaryMerkleTreeTest {
    using BinaryMerkleTree for MerkleTreeData;

    event LeafInserted(bytes32 indexed treeId, uint256 leaf, uint256 root);
    event LeafUpdated(bytes32 indexed treeId, uint256 leaf, uint256 root);
    event LeafRemoved(bytes32 indexed treeId, uint256 leaf, uint256 root);

    mapping(bytes32 => MerkleTreeData) public trees;

    function insertLeaf(bytes32 _treeId, uint256 _leaf) external {
        uint256 root = trees[_treeId].insert(_leaf);

        emit LeafInserted(_treeId, _leaf, root);
    }

    function updateLeaf(
        bytes32 _treeId,
        uint256 _oldLeaf,
        uint256 _newLeaf,
        uint256[] calldata _siblingNodes
    ) external {
        uint256 root = trees[_treeId].update(_oldLeaf, _newLeaf, _siblingNodes);
        emit LeafUpdated(_treeId, _newLeaf, root);
    }

    function removeLeaf(
        bytes32 _treeId,
        uint256 _leaf,
        uint256[] calldata _siblingNodes
    ) external {
        uint256 root = trees[_treeId].remove(_leaf, _siblingNodes);
        emit LeafRemoved(_treeId, _leaf, root);
    }

    function hasLeaf(
        bytes32 _treeId,
        uint256 _leaf
    ) external view returns (bool) {
        return trees[_treeId].has(_leaf);
    }

    function indexOfLeaf(
        bytes32 _treeId,
        uint256 _leaf
    ) external view returns (uint256) {
        return trees[_treeId].indexOf(_leaf);
    }

    function rootTree(bytes32 _treeId) public view returns (uint256) {
        return trees[_treeId].root();
    }
}
