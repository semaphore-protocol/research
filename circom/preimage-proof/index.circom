pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Preimage() {
    signal input message;

    signal output out;

    out <== Poseidon(1)([message]);
}

component main = Preimage();
