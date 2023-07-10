pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/babyjub.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";
include "./tree.circom";

template Semaphore(MAX_DEPTH) {
    signal input privateKey;
    signal input treeIndex;
    signal input treeDepth;
    signal input treeSiblings[MAX_DEPTH];

    signal input signalHash;
    signal input topic;

    signal output root;
    signal output nullifierHash;

    component babyPbk = BabyPbk();
    babyPbk.in <== privateKey;

    component inclusionProof = MerkleTreeInclusionProof(MAX_DEPTH);
    inclusionProof.leaf <== babyPbk.Ay;
    inclusionProof.index <== treeIndex;
    inclusionProof.depth <== treeDepth;

    for (var i = 0; i < MAX_DEPTH; i++) {
        inclusionProof.siblings[i] <== treeSiblings[i];
    }

    root <== inclusionProof.root;

    component poseidon2 = Poseidon(2);

    poseidon2.inputs[0] <== topic;
    poseidon2.inputs[1] <== privateKey;

    nullifierHash <== poseidon2.out;
}

component main {public [signalHash, topic]} = Semaphore(30);
