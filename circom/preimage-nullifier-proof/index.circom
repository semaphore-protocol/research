pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template PreimageWithNullifier() {
    signal input message;
    signal input topic;

    signal output nullifier;
    signal output out;

    out <== Poseidon(1)([message]);
    nullifier <== Poseidon(2)([topic, message]);
}

component main {public [topic]} = PreimageWithNullifier();
