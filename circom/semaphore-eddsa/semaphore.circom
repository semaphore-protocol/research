pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/babyjub.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";
include "./tree.circom";

// The current Semaphore smart contracts require nLevels <= 32 and nLevels >= 16.
template Semaphore(nLevels) {
    signal input privateKey;
    signal input treePathIndices[nLevels];
    signal input treeSiblings[nLevels];

    signal input signalHash;
    signal input topic;

    signal output root;
    signal output nullifierHash;

    component babyPbk = BabyPbk();
    babyPbk.in <== privateKey;

    component inclusionProof = MerkleTreeInclusionProof(nLevels);
    inclusionProof.leaf <== babyPbk.Ay;

    for (var i = 0; i < nLevels; i++) {
        inclusionProof.siblings[i] <== treeSiblings[i];
        inclusionProof.pathIndices[i] <== treePathIndices[i];
    }

    root <== inclusionProof.root;

    component poseidon2 = Poseidon(2);

    poseidon2.inputs[0] <== topic;
    poseidon2.inputs[1] <== privateKey;

    // Dummy square to prevent tampering signalHash.
    signal signalHashSquared;
    signalHashSquared <== signalHash * signalHash;

    nullifierHash <== poseidon2.out;
}

component main {public [signalHash, topic]} = Semaphore(30);
