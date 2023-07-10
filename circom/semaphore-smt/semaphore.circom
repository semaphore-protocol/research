pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/babyjub.circom";
include "../node_modules/circomlib/circuits/smt/smtverifier.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

// The current Semaphore smart contracts require nLevels <= 32 and nLevels >= 16.
template Semaphore(nLevels) {
    signal input privateKey;
    signal input smtSiblings[nLevels];

    signal input signalHash;
    signal input topic;

    signal input smtRoot;
    signal output nullifierHash;

    component babyPbk = BabyPbk();
    babyPbk.in <== privateKey;

    component smtVerifier = SMTVerifier(nLevels);
    smtVerifier.enabled <== 1;
    smtVerifier.root <== smtRoot;
    for (var i = 0; i < nLevels; i++) smtVerifier.siblings[i] <== smtSiblings[i];
    smtVerifier.oldKey <== 0;
    smtVerifier.oldValue <== 0;
    smtVerifier.isOld0 <== 0;
    smtVerifier.key <== babyPbk.Ax;
    smtVerifier.value <== babyPbk.Ay;
    smtVerifier.fnc <== 0;

    component poseidon = Poseidon(2);

    poseidon.inputs[0] <== topic;
    poseidon.inputs[1] <== privateKey;

    // Dummy square to prevent tampering signalHash.
    signal signalHashSquared;
    signalHashSquared <== signalHash * signalHash;

    nullifierHash <== poseidon.out;
}

component main {public [signalHash, topic]} = Semaphore(30);
