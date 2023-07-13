pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../merkle-tree/index.circom";

template Semaphore(MAX_DEPTH) {
    signal input identitySecret;
    signal input treeDepth, treeIndices[MAX_DEPTH], treeSiblings[MAX_DEPTH];
    signal input message;
    signal input topic;

    signal output treeRoot, nullifier;

    var leaf = Poseidon(1)([identitySecret]);

    treeRoot <== CalculateMerkleRoot(MAX_DEPTH)(leaf, treeDepth, treeIndices, treeSiblings);
    nullifier <== Poseidon(2)([topic, identitySecret]);
}

component main {public [message, topic]} = Semaphore(30);
