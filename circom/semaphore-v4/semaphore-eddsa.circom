pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/babyjub.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";
include "../merkle-tree/index.circom";

template Semaphore(MAX_DEPTH) {
    signal input privateKey;
    signal input treeDepth, treeIndices[MAX_DEPTH], treeSiblings[MAX_DEPTH];
    signal input message;
    signal input scope;

    signal output treeRoot, nullifier;

    var Ax, Ay;
    (Ax, Ay) = BabyPbk()(privateKey);

    var treeLeaf = Poseidon(2)([Ax, Ay]);

    treeRoot <== CalculateMerkleRoot(MAX_DEPTH)(treeLeaf, treeDepth, treeIndices, treeSiblings);
    nullifier <== Poseidon(2)([scope, privateKey]);

    // Dummy constraint to prevent compiler from optimizing it.
    signal dummySquare <== message * message;
}

component main {public [message, scope]} = Semaphore(16);
