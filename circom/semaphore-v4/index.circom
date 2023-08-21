pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../merkle-tree/index.circom";

template Semaphore(MAX_DEPTH) {
    signal input identitySecret;
    signal input treeDepth, treeIndices[MAX_DEPTH], treeSiblings[MAX_DEPTH];
    signal input signalHash;
    signal input scope;

    signal output treeRoot, nullifierHash;

    var leaf = Poseidon(1)([identitySecret]);

    treeRoot <== CalculateMerkleRoot(MAX_DEPTH)(leaf, treeDepth, treeIndices, treeSiblings);
    nullifierHash <== Poseidon(2)([scope, identitySecret]);

    // Dummy constraint to prevent compiler from optimizing it.
    signal signalHashSquared <== signalHash * signalHash;
}

component main {public [signalHash, scope]} = Semaphore(10);
