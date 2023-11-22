pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template PoseidonProof() {
    signal input in;
    signal input scope;

    signal output nullifier;
    signal output out;

    out <== Poseidon(1)([in]);
    nullifier <== Poseidon(2)([scope, in]);
}

component main {public [scope]} = PoseidonProof();
