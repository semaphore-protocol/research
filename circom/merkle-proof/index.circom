pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";
include "../merkle-tree/index.circom";

template MerkleProof(MAX_DEPTH) {
    signal input identitySecret;
    signal input treeDepth, treeIndices[MAX_DEPTH], treeSiblings[MAX_DEPTH];

    signal output treeRoot;

    var leaf = Poseidon(1)([identitySecret]);

    treeRoot <== CalculateMerkleRoot(MAX_DEPTH)(leaf, treeDepth, treeIndices, treeSiblings);
}

component main = MerkleProof(30);
