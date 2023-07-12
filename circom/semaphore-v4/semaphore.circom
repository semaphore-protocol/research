pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/babyjub.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";
include "./tree.circom";

template Semaphore(MAX_DEPTH) {
    signal input privateKey;

    signal input treeIndex;
    signal input treeDepth;
    signal input treeSiblings[MAX_DEPTH];

    signal input message;
    signal input topic;

    signal output treeRoot;
    signal output nullifierHash;

    component babyPbk = BabyPbk();
    babyPbk.in <== privateKey;

    component calculateTreeRoot = TreeRoot(MAX_DEPTH);
    calculateTreeRoot.leaf <== babyPbk.Ay;
    calculateTreeRoot.index <== treeIndex;
    calculateTreeRoot.depth <== treeDepth;

    for (var i = 0; i < MAX_DEPTH; i++) {
        calculateTreeRoot.siblings[i] <== treeSiblings[i];
    }

    treeRoot <== calculateTreeRoot.out;

    component poseidon = Poseidon(2);

    poseidon.inputs[0] <== topic;
    poseidon.inputs[1] <== privateKey;

    nullifierHash <== poseidon.out;
}

component main {public [message, topic]} = Semaphore(30);
