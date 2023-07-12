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

    component babyPbk = BabyPbk();
    babyPbk.in <== privateKey;

    treeRoot <== CalculateTreeRoot(MAX_DEPTH)(babyPbk.Ay, treeDepth, treeIndices, treeSiblings);
    nullifier <== Poseidon(2)([topic, privateKey]);
}

component main {public [message, topic]} = Semaphore(30);
