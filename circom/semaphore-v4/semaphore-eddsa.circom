pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/babyjub.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";
include "./tree.circom";

template Semaphore(MAX_DEPTH) {
    signal input privateKey;
    signal input treeDepth, treeIndices[MAX_DEPTH], treeSiblings[MAX_DEPTH];
    signal input message;
    signal input topic;

    signal output treeRoot, nullifier;

    var Ax, Ay;
    (Ax, Ay) = BabyPbk()(privateKey);

    var leaf = Poseidon(2)([Ax, Ay]);

    treeRoot <== CalculateTreeRoot(MAX_DEPTH)(leaf, treeDepth, treeIndices, treeSiblings);
    nullifier <== Poseidon(2)([topic, privateKey]);
}

component main {public [message, topic]} = Semaphore(30);
