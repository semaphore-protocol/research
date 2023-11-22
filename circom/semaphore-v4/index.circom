pragma circom 2.1.5;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../merkle-tree/index.circom";

template Semaphore(MAX_DEPTH) {
    signal input identitySecret;
    signal input treeDepth, treeIndices[MAX_DEPTH], treeSiblings[MAX_DEPTH];
    signal input message;
    signal input scope;

    signal output treeRoot, nullifier;

    var treeLeaf = Poseidon(1)([identitySecret]);

    treeRoot <== CalculateMerkleRoot(MAX_DEPTH)(treeLeaf, treeDepth, treeIndices, treeSiblings);
    nullifier <== Poseidon(2)([scope, identitySecret]);

    // Dummy constraint to prevent compiler from optimizing it.
    signal dummySquare <== message * message;
}

component main {public [message, scope]} = Semaphore(16);
