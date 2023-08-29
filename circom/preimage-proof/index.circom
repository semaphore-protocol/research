pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Preimage() {
    signal input message;
    signal input scope;

    signal output nullifier;
    signal output out;

    out <== Poseidon(1)([message]);
    nullifier <== Poseidon(2)([scope, message]);
}

component main {public [scope]} = Preimage();
